import {Nft, server} from "./stellar";
import {ServerNft, ServerProposal} from "../Proposals";

const serverUrl = "http://localhost:8080"

export let serverAddress = ""
export async function getServerAccountId() : Promise<string> {
    return fetch(`${serverUrl}/dust/key`,{

    }).then((res)=> res.text())
        .then((res)=>{
            serverAddress  = res
            return res
        })
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

export async function getNftsFromServer() : Promise<ServerNft[]>{
    return fetch(`${serverUrl}/dust/dusts`)
        .then((res)=>res.json())
        .catch((err)=> {
            throw "error"
        })
}

export async function getPropsFromServer() : Promise<ServerProposal[]>{
    return fetch(`${serverUrl}/dust/props`)
        .then((res)=>res.json())
        .then((res)=>res[0])
        .catch((err)=> {
            throw "error"
        })
}

export async function addProp(prop : ServerProposal) {
    await fetch(`${serverUrl}/dust/prop`,
        {
            method: "POST",
            body: JSON.stringify(prop),
            headers: {
                "Content-type": "application/json"
            }
        })
}

export async function voteForProp(prop : ServerProposal) {
    await fetch(`${serverUrl}/vote`,
        {
            method: "POST",
            body: JSON.stringify(prop),
            headers: {
                "Content-type": "application/json"
            }
        })
}

export async function execute(prop : ServerProposal) {
    await fetch(`${serverUrl}/dust/execute`,
        {
            method: "POST",
            body: JSON.stringify(prop),
            headers: {
                "Content-type": "application/json"
            }
        }).then((res)=> res.text())
        .then((res)=>alert("execture respone : "+res))
}
