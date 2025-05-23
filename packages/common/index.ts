

interface SignupIncomingMessage { // validator sending req to hub
    ip: string
    publicKey:string
    signedMessage: string
    callbackId: string
}

interface ValidateIncomingMessage { // validator sending validated data / response to hub
    callbackId: string
    signedMessage: string
    status: "Up" | "Down"
    latency: number
    websiteId: string
    validatorId: string
}       

interface SignupOutgoingMessage { // hub sending response to validator
    callbackId: string
    validatorId: string
}

interface ValidateOutgoingMessage {  // hub sending req to validator
    callbackId: string
    url: string
    websiteId: string                   
}

type IncomingMessage = {
    type: "signup" 
    data: SignupIncomingMessage
} | { 
    type: "validate"
    data: ValidateIncomingMessage
}

type OutgoingMessage = {
    type: "signup"
    data: SignupOutgoingMessage
} | {
    type: "validate"
    data: ValidateOutgoingMessage
}

export type { IncomingMessage, OutgoingMessage }
export type { SignupIncomingMessage, ValidateIncomingMessage, SignupOutgoingMessage, ValidateOutgoingMessage }