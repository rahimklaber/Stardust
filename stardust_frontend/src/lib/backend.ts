import {Nft} from "./stellar";

const serverUrl = "http://localhost:8080"
export async function getServerAccountId() : Promise<string> {
    return fetch(`${serverUrl}/dust/key`,{

    }).then((res)=>res.text())
}


export async function mintFracs(xdr:string,nft:Nft,frac_issuer:string,frac_code:string) : Promise<Response> {
    console.log(xdr)
    return await fetch(`${serverUrl}/dust`,{
        method : "POST",
        body : JSON.stringify({xdr,nft,frac_issuer,frac_code}),
        headers : {
            "Content-type" : "application/json"
        }
    })
}
