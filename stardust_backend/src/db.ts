import {Depot} from "depot-db"

type Key = {secret: string}
export type Nft = {name:string,asset_code : string, issuer:string, image_url:string, frac_code:string,frac_issuer:string}
export const keyStore = new Depot<Key>("./databases/keys")
export const nftStore = new Depot<Nft[]>("./databases/nfts")
export const propStore = new Depot<Proposal[]>("./databases/props")
export const voteStore = new Depot<number>("./databases/votes")
export type Proposal = {id:number, nft:Nft,text:string,xdr:string}


export async function addNft(nft:Nft){
    const nfts = await nftStore.get("master").catch(()=>null)
    if(nfts==null){
        await nftStore.put("master",[])
    }
    const updatedNfts = await nftStore.get("master")
    updatedNfts.push(nft)
    await nftStore.put("master", updatedNfts)
}

let id= 1

export async function addProp(prop:Proposal){
    prop.id = id
    id = id+1
    const props = await propStore.get(prop.nft.issuer).catch(()=>null)
    if(props == null){
        await propStore.put(prop.nft.issuer,[])
    }
    const updatedProps = await propStore.get(prop.nft.issuer)
    updatedProps.push(prop)
    console.log(updatedProps)
    await propStore.put(prop.nft.issuer,updatedProps)
}

export async function vote(prop:Proposal,shares:number){
    let votes = await voteStore.get(prop.id.toString()).catch(()=>null)
    if(votes == null){
       await voteStore.put(prop.id.toString(),shares)
    }else{
       await voteStore.put(prop.id.toString(),votes + shares)
    }
}

export async function getProps(): Promise<Proposal[]>{
    const props = []
    await propStore.find().then((list)=>{
        props.push(...list)
    })
    return props
}


export async function getNfts(){
    const nfts = await nftStore.get("master").catch(()=>null)
    if(nfts==null){
        await nftStore.put("master",[])
    }

    return await nftStore.get("master")

}
