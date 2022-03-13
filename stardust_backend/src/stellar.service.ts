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
        const secret = await keyStore.get("master").then((res)=>res.secret).catch(() => null)
        console.log(secret)
        if (secret == null) {
            this.keypair = Keypair.random()
            console.log(`funding account ${this.keypair.publicKey()}`)
            await this.server.friendbot(this.keypair.publicKey()).call().then(() => {
                console.log("account funded.")
                keyStore.put("master", {secret: this.keypair.secret()})
            })
        } else {
            this.keypair = Keypair.fromSecret(secret)
        }

        return this.keypair
    }
}
