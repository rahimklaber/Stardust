import {Depot} from "depot-db"

type Key = {secret: string}
export type Nft = {name:string,asset_code : string, issuer:string, image_url:string, frac_code:string,frac_issuer:string}
export const keyStore = new Depot<Key>("./databases/keys")
export const nftStore = new Depot<Nft[]>("./databases/nfts")

export async function addNft(nft:Nft){
    const nfts = await nftStore.get("master").catch(()=>null)
    if(nfts==null){
        await nftStore.put("master",[])
    }
    const updatedNfts = await nftStore.get("master")
    updatedNfts.push(nft)
    await nftStore.put("master", updatedNfts)
}



export async function getNfts(){
    const nfts = await nftStore.get("master").catch(()=>null)
    if(nfts==null){
        await nftStore.put("master",[])
    }

    return await nftStore.get("master")

}
