import {Controller, Get, Post, Req, Res} from '@nestjs/common';
import {StellarService} from "./stellar.service";
import {Request, Response} from 'express';
import {Networks, Transaction} from "stellar-sdk";
import {addNft, getNfts, Nft} from "./db";


@Controller("/dust")
export class DustController {
    constructor(private readonly stellarService: StellarService) {}

    @Get("/key")
    async getServerAccount(): Promise<string> {
        return await this.stellarService.getKeyPair().then((res)=>res.publicKey())
    }

    @Get("/dusts")
    async getDusts(): Promise<Nft[]> {
        return await getNfts()
    }

    /**
     * {xdr,nft,frac_issuer,frac_code}
     */
    @Post()
    async dust(@Req() request: Request){
        const {xdr,nft,frac_issuer,frac_code} = request.body

        console.log(request.body)

        const tx = new Transaction(xdr,Networks.TESTNET)
        tx.sign(await this.stellarService.getKeyPair())
        const res = await this.stellarService.server.submitTransaction(tx)
            .then(()=>{
                const serverNft : Nft = {
                    name:nft.name,
                    asset_code:nft.code,
                    issuer:nft.issuer,
                    image_url:nft.image,
                    frac_code,
                    frac_issuer
                }
                addNft(serverNft)
                return true
            }).catch(()=>{
                return null
        })
        if(res == null){
            throw "failed"
        }
    }
}
