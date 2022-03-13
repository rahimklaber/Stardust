import {Asset, Keypair, Networks, Operation, Server, Transaction, TransactionBuilder} from "stellar-sdk";
import {Buffer} from "buffer";
import {signTx} from "./albedo";
import {getServerAccountId, mintFracs} from "./backend";

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

        //todo check that the account is locked
        console.log("hash", issuer.data_attr["ipfshash"]);
        if (asset.records[0].amount == "0.0000001" && /*issuer.signers[0].weight == 0 &&*/ issuer.data_attr["ipfshash"] != null) { // check if nft and in litemint format
            let buff = new Buffer(issuer.data_attr["ipfshash"], 'base64');
            let ipfshash = buff.toString('ascii');
            const metadata = await fetch(`https://ipfs.io/ipfs/${ipfshash}`).then((res) => res.json()).catch(() => null)
            if (metadata != null) {
                nfts.push({
                    name: metadata.name,
                    image: metadata.url,
                    issuer: asset.records[0].asset_issuer,
                    code: asset.records[0].asset_code
                })
            }
        }
    }
    return nfts


}

export async function createDemoNft(address: string) {
    const account = await server.loadAccount(address)
    let issueKeypair = Keypair.random()
    let asset = new Asset("demoNFT", issueKeypair.publicKey())
    const tx = new TransactionBuilder(account, {fee: "1000000", networkPassphrase: Networks.TESTNET})
        .addOperation(Operation.createAccount({
            source: address, destination: issueKeypair.publicKey(), startingBalance: "1.5"
        }))
        .addOperation(Operation.changeTrust({
            source: address, asset
        }))
        .addOperation(Operation.payment({
            source: issueKeypair.publicKey(), destination: address, asset, amount: "0.0000001"
        }))
        .addOperation(Operation.manageData({
            source: issueKeypair.publicKey(), name: "ipfshash", value: "QmVoug3is39yJ7b3qPtBJWvwF3NKBkRVSmkQzv37ej9wFu"
        }))
        .addOperation(Operation.setOptions({
            source: issueKeypair.publicKey(), medThreshold: 2, highThreshold: 2
        }))
        .setTimeout(0)
        .build()

    const signedTx = await signTx("testnet", tx.toXDR())
    const txToSubmit = new Transaction(signedTx, Networks.TESTNET)
    txToSubmit.sign(issueKeypair)
    server.submitTransaction(txToSubmit)
        .then((res) => alert("demo nft created!"))
        .catch((res) => {
            console.log(res)
            alert("creating demo nft failed")
        })

}

export async function fractionalizeNft(nft: Nft, address: string, amount : string) {
    const asset = new Asset(nft?.code as string,nft?.issuer)

    const issuerKeypair = Keypair.random()
    const fracNft = new Asset("fracNFT", issuerKeypair.publicKey())

    const account = await server.loadAccount(address)
    const serverAddress = await getServerAccountId()

    const tx = new TransactionBuilder(account, {fee: "1000000", networkPassphrase: Networks.TESTNET})
        .addOperation(Operation.createAccount({
            source: address, destination: issuerKeypair.publicKey(), startingBalance: "1.5"
        }))
        .addOperation(Operation.changeTrust({
            source: address, asset:fracNft
        }))
        .addOperation(Operation.payment({
            source: issuerKeypair.publicKey(), destination: address, asset:fracNft, amount: amount
        }))
        .addOperation(Operation.manageData({
            source : issuerKeypair.publicKey(),
            name : asset.code,
            value:asset.issuer
        }))
        .addOperation(Operation.changeTrust({
            source: serverAddress,
            asset:asset
        }))
        .addOperation(Operation.payment({
            source : address,
            destination : serverAddress,
            amount : "0.0000001",
            asset : asset
        }))
        .setTimeout(0)
        .build()

    tx.sign(issuerKeypair)

    const signedTx = await signTx("testnet",tx.toXDR())
    return mintFracs(signedTx,nft,fracNft.issuer,fracNft.code)



}
