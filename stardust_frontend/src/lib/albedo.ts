import albedo from "@albedo-link/intent";

/**
 * Request the public key from albedo.
 */
export async function getAlbedoPublicKey(): Promise<string> {
    const albedoResponse = await albedo.publicKey({})

    return albedoResponse.pubkey
}

/**
 * sign message with your albedo secret.
 * @param data data to sign
 * @param address account to sign with
 */
export async function signMessageWithAlbedo(address: string, data: string): Promise<string> {
    const albedoResponse = await albedo.signMessage({
        message: data,
        pubkey: address
    })

    return albedoResponse.message_signature
}


export async function signTx(network : string,xdr:string){
    const response = await albedo.tx({
        xdr,
        network
    })
    return response.signed_envelope_xdr
}
