import type { IncomingMessage, SignupIncomingMessage } from "common";
import { prisma } from "db/client";
import { randomUUIDv7, type ServerWebSocket} from "bun";
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import nacl_util, { decodeUTF8 } from "tweetnacl-util";

const CALLBACKS: {[callbackId: string]: (data: IncomingMessage) => void} = {}
const COST_PER_VALIDATION =  100 // in lamports

const availableValidators: {validatorId: string | undefined, publicKey: string | undefined , socket: ServerWebSocket<unknown>}[] = []

Bun.serve({
    fetch(req, server) {
        if(server.upgrade(req)) {
            return;
        }
        return new Response("Upgrade Failed", {status: 500})
    },
    port: 8081,
    websocket: {
        async message(ws: ServerWebSocket<unknown>, message: string) {
            const data: IncomingMessage = JSON.parse(message)

            if(data.type === "signup") {
                const verified = await verifyMessage(
                    `Signed message for ${data.data.callbackId}, ${data.data.publicKey}`, 
                    data.data.signedMessage,
                    data.data.publicKey
                )
                if(verified) {
                    await signupHandler(ws, data.data);
                }
            }
            else if (data.type === "validate") {
                CALLBACKS[data.data.callbackId] = () => {

                }
            }
        }
    }
})

async function signupHandler (ws: ServerWebSocket<unknown>, {ip, publicKey, signedMessage, callbackId}: SignupIncomingMessage) {
    const  validatorDb = await prisma.validator.findFirst({
        where: {
            publicKey
        }
    })

    if(validatorDb) {
        ws.send(JSON.stringify({
            type: "signup",
            data: {
                callbackId,
                validatorId: validatorDb.id
            }
        }));
    }

    availableValidators.push({
        validatorId: validatorDb?.id,
        socket: ws,
        publicKey: validatorDb?.publicKey
    })
}

async function verifyMessage(message: string, signature: string, publicKey: string) {
    const messageBytes = nacl_util.decodeUTF8(message);
    const result = nacl.sign.detached.verify(
        messageBytes,
        new Uint8Array(JSON.parse(signature)),
        new PublicKey(publicKey).toBytes()
    );
    return result;
}

setInterval(async () => {
    const websiteToMonitor = await prisma.website.findMany({
        where: {
            disabled: false
        }
    }) 
}, 1000); 

