import { randomUUIDv7 } from "bun";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import nacl_util from 'tweetnacl-util';
import type { OutgoingMessage, SignupOutgoingMessage, ValidateOutgoingMessage } from "common";

const CALLBACKS: { [callbackId: string]: (data: SignupOutgoingMessage) => void } = {}

let validatorId: string | null = null;

async function main() {
    const keyPair = Keypair.fromSecretKey(
        Uint8Array.from(JSON.parse(process.env.PRIVATE_KEY!))
    );

    const ws = new WebSocket("ws://localhost:8081");

    ws.onmessage = async (event) => {
        const data: OutgoingMessage = JSON.parse(event.data);

        if (data.type === 'signup') {
            CALLBACKS[data.data.callbackId]?.(data.data);
            delete CALLBACKS[data.data.callbackId];
        }
        else if (data.type === 'validate') {
            await validateHandler(ws, data.data, keyPair);
        }
    }

    ws.onopen = async () => {
        const callbackId = randomUUIDv7();
        CALLBACKS[callbackId] = async (data: SignupOutgoingMessage) => {
            validatorId = data.validatorId
        }

        const signedMessage = await signMessage(`Signed message for ${callbackId}, ${keyPair.publicKey}`, keyPair);

        ws.send(JSON.stringify({
            type: 'signup',
            data: {
                callbackId,
                ip: '127.0.0.1',
                publicKey: keyPair.publicKey,
                signedMessage,
            }
        }));
    }
}

async function validateHandler(ws: WebSocket, { url, callbackId, websiteId }: ValidateOutgoingMessage, keyPair: Keypair) {
    console.log(`Validating ${url}`);

    const startTime = Date.now();
    const signature = await signMessage(`Replying to ${callbackId}`, keyPair);

    try {
        const response = await fetch(url);
        const endTime = Date.now();
        const latency = endTime - startTime;
        const status = response.status

        console.log(url);
        console.log(status);

        ws.send(JSON.stringify({
            type: 'validate',
            data: {
                callbackId,
                status: status === 200 ? "Up" : "Down",
                latency,
                websiteId,
                validatorId,
                signedMessage: signature
            }
        }));

    }
    catch (err) {
        ws.send(JSON.stringify({
            type: 'validate',
            data: {
                callbackId,
                status: 'Down',
                latency: 1000,
                websiteId,
                validatorId,
                signedMessage: signature,
            },
        }));
        console.error(err);
    }
}

async function signMessage(message: string, keyPair: Keypair) {
    const messageBytes = nacl_util.decodeUTF8(message);
    const signature = nacl.sign.detached(messageBytes, keyPair.secretKey);

    return JSON.stringify(Array.from(signature));
}

main();

setInterval(async () => {
    console.log('started again')
}, 1000);