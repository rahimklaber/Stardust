import {Injectable} from "@nestjs/common";
import {Keypair, Server} from "stellar-sdk";
import {keyStore} from "./db";

@Injectable()
export class StellarService {
    keypair: Keypair
    server = new Server("https://horizon-testnet.stellar.org")

    async getKeyPair(): Promise<Keypair> {
        if (this.keypair != null) {
            return this.keypair
        }
        const secret = await keyStore.get("master").catch(() => null)
        if (secret == null) {
            this.keypair = Keypair.random()
        } else {
            this.keypair = Keypair.fromSecret(secret)
        }
        console.log(`funding account ${this.keypair.publicKey()}`)
        await this.server.friendbot(this.keypair.publicKey()).call().then(() => {
            console.log("account funded.")
        })
        await keyStore.put("master", {secret: this.keypair.publicKey()})
        return this.keypair
    }
}
