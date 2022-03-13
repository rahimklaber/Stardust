import {Controller, Get, Post, Req, Res} from '@nestjs/common';
import {StellarService} from "./stellar.service";
import {Request, Response} from 'express';
import {Networks, Transaction} from "stellar-sdk";
import {addNft, addProp, getNfts, getProps, Nft, Proposal, vote} from "./db";


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

    @Get("/props")
    async getProps(): Promise<Proposal[]> {
        return getProps()
    }

    @Post("/prop")
    async addProp(@Req() request: Request){
        const prop = request.body
        // console.log(prop)
        await addProp(prop)
    }

    @Post("/vote")
    async voteforprop(@Req() request: Request){
        const {prop,votes} = request.body
        await vote(prop,10)
    }

    @Post("/execute")
    async executeProp(@Req() request: Request) : Promise<string>{
        const proposal : Proposal = request.body
        console.log(proposal)
        const tx = new Transaction(proposal.xdr,Networks.TESTNET)
        tx.sign(await this.stellarService.getKeyPair())

       return this.stellarService.server.submitTransaction(tx)
            .then((res)=>{
                return res.hash
            }).catch((er)=>er)
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
            }).catch((res)=>{
                console.log(res)
                return null
        })
        if(res == null){
            throw "failed"
        }
    }
}
