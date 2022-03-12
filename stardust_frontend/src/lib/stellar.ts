import { Server} from "stellar-sdk";
import {Buffer} from "buffer";

export const server = new Server("https://horizon-testnet.stellar.org")

export interface Nft {
    name: string
    image: string
    issuer: string
    code: string
}

export async function findNfts(address: string): Promise<Nft[]> {
    const balances = await server
        .accounts()
        .accountId(address)
        .call()
        .then((res) => res.balances)

    const customAssets: any[] = balances.filter((item) => item.asset_type == "credit_alphanum12" || item.asset_type == "credit_alphanum4") as Array<any>

    const potentialNfts = customAssets.filter((item) => item.balance == "0.0000001")

    const nfts: Nft[] = []

    for (const item of potentialNfts) {
        const asset = await server.assets().forCode(item.asset_code).forIssuer(item.asset_issuer).call()
        const issuer = await server.accounts().accountId(item.asset_issuer).call()

        if (asset.records[0].amount == "0.0000001" && issuer.signers[0].weight == 0) { // check if nft
            let buff = new Buffer(issuer.data_attr["ipfshash"], 'base64');
            let ipfshash = buff.toString('ascii');
            const metadata = await fetch(`https://ipfs.io/ipfs/${ipfshash}`).then((res) => res.json())
            console.log(metadata)
            nfts.push({
                name: metadata.name,
                image: metadata.uri,
                issuer: asset.records[0].asset_issuer,
                code: asset.records[0].asset_code
            })
        }
    }
    return nfts


}
