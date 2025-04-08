import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import type { IncomingMessage, SignupIncomingMessage } from "common";
import { prisma } from "db/client";
import { randomUUIDv7, type ServerWebSocket } from "bun";
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import nacl_util from "tweetnacl-util";

const CALLBACKS: { [callbackId: string]: (data: IncomingMessage) => void } = {};
const COST_PER_VALIDATION = 100; // in lamports

const availableValidators: {
    validatorId: string;
    socket: ServerWebSocket<unknown>;
    publicKey: string;
}[] = [];

// http server
Bun.serve({
    fetch(req, server) {
        if (server.upgrade(req)) {
            return;
        }
        return new Response("Upgrade Failed", { status: 500 });
    },
    port: 8081,
    websocket: {
        async message(ws: ServerWebSocket<unknown>, message: string) {
            const data: IncomingMessage = JSON.parse(message);

            if (data.type === "signup") {
                const verified = await verifyMessage(
                    `Signed message for ${data.data.callbackId}, ${data.data.publicKey}`,
                    data.data.publicKey,
                    data.data.signedMessage
                );
                if (verified) {
                    await signupHandler(ws, data.data);
                }
            }
            // callback function to call when
            // validator returns the data on
            // status and latency and the callback
            // function stores it in db
            else if (data.type === "validate") {
                CALLBACKS[data.data.callbackId](data);
                delete CALLBACKS[data.data.callbackId];
            }
        },
        // callback to remove validator when connection closes or validator disconnects
        async close(ws: ServerWebSocket<unknown>) {
            availableValidators.splice(
                availableValidators.findIndex((v) => v.socket === ws),
                1
            );
        },
    },
});

async function signupHandler(
    ws: ServerWebSocket<unknown>,
    { ip, publicKey, signedMessage, callbackId }: SignupIncomingMessage
) {
    const validatorDb = await prisma.validator.findFirst({
        // check if already exists in db
        where: {
            publicKey,
        },
    });

    if (validatorDb) {
        // if exists then send them back their callback id and push into available validators array
        ws.send(
            JSON.stringify({
                type: "signup",
                data: {
                    validatorId: validatorDb.id,
                    callbackId,
                },
            })
        );

        availableValidators.push({
            validatorId: validatorDb?.id,
            socket: ws,
            publicKey: validatorDb?.publicKey,
        });

        return;
    }

    // else if first time signup then create db entry and send
    //  back message and push to available validators array

    // find location through ip
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    const location = (await response.json()) as {
        city: string;
        region: string;
        country: string;
    };

    const validator = await prisma.validator.create({
        data: {
            ip,
            publicKey,
            location: "Pune",
        },
    });

    ws.send(
        JSON.stringify({
            type: "signup",
            data: {
                validatorId: validator.id,
                callbackId,
            },
        })
    );

    availableValidators.push({
        validatorId: validator.id,
        socket: ws,
        publicKey: validator.publicKey,
    });
}

// to verify if signature is coming from validator or not
async function verifyMessage(
    message: string,
    publicKey: string,
    signature: string
) {
    try {
        const messageBytes = nacl_util.decodeUTF8(message);
        const result = nacl.sign.detached.verify(
            messageBytes,
            new Uint8Array(JSON.parse(signature)),
            new PublicKey(publicKey).toBytes()
        );

        return result;
    } catch (error) {
        console.error("Signature verification failed:", error);
        return false;
    }
}

// distibuting load / url to validators every minute and storing the response in db
setInterval(async () => {
    const websiteToMonitor = await prisma.website.findMany({
        where: {
            disabled: false,
        },
    });

    for (const website of websiteToMonitor) {
        availableValidators.forEach((validator) => {
            const callbackId = randomUUIDv7();
            console.log(
                `Sending validate to ${validator.validatorId} ${website.url}`
            );
            validator.socket.send(
                JSON.stringify({
                    type: "validate",
                    data: {
                        url: website.url,
                        callbackId,
                    },
                })
            );

            // callback function to call when the validator returns the data (status, latency)
            CALLBACKS[callbackId] = async (data: IncomingMessage) => {
                if (data.type === "validate") {
                    const { validatorId, status, latency, signedMessage } = data.data;

                    const validator = await prisma.validator.findUnique({
                        where: { id: validatorId },
                    });

                    if (!validator) return;

                    const verified = await verifyMessage(
                        `Replying to ${callbackId}`,
                        validator.publicKey,
                        signedMessage
                    );

                    if (!verified) {
                        return;
                    }

                    await prisma.$transaction(async (tx) => {
                        await tx.websiteTick.create({
                            data: {
                                websiteId: website.id,
                                validatorId,
                                status,
                                latency,
                                createdAt: new Date(),
                            },
                        });

                        await tx.validator.update({
                            where: {
                                id: validatorId,
                            },
                            data: {
                                pendingPayouts: {
                                    increment: COST_PER_VALIDATION,
                                },
                            },
                        });
                    });
                }
            };
        });
    }
    console.log("started");
}, 3 * 60 * 1000);
