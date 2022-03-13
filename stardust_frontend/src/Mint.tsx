import React from 'react';
import './App.css';
import {Button, Card, Form} from "react-bootstrap";
import {createDemoNft, findNfts, fractionalizeNft, Nft} from "./lib/stellar";
import {shorten} from "./lib/utils";
import {Asset} from "stellar-sdk";


interface IMintState {
    nfts: Array<Nft>,

}

interface IMintProps {
    address: string
    connected: boolean
}

class Mint extends React.Component<IMintProps, IMintState> {
    constructor(props: IMintProps) {
        super(props)
        this.state = {nfts: []}
    }
    selectedNft : Nft | null = null
    mintAmount  : string | null = null

    componentDidMount() {
        this.getNfts()
    }


    // static async getDerivedStateFromProps(props: IMintProps, state: IMintState): Promise<IMintState> {
    //     if (props.connected) {
    //         return {nfts: await findNfts(props.address)}
    //     }
    //     return {nfts:[]}
    // }

    componentDidUpdate(prevProps: Readonly<IMintProps>, prevState: Readonly<IMintState>, snapshot?: any) {
        if(!prevProps.connected){
            this.getNfts()
        }
    }


    getNfts() {
        if (!this.props.address) {
            return
        }
        findNfts(this.props.address).then((res) => {
            console.log(res)
            this.setState({
                nfts: res
            })
        })
    }

    getNftOptions(nfts:Nft[])  {
        console.log("in get nft option",nfts)
        if(nfts.length > 0){
            this.selectedNft = nfts[0]
        }
        return nfts.map((nft)=>{
            return <option onChange={(e)=> this.selectedNft = nft} key={`${nft.code}-${nft.issuer}`} value={`${nft.code}-${nft.issuer}`}>
                {`${nft.code}-${shorten(nft.issuer)}`}
            </option>
        })
    }

    render() {
        // @ts-ignore
        return (<Card className="Mint">
            <Card.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="nft">
                        <Form.Label>Select an Nft</Form.Label>
                        <Form.Select >
                            {this.getNftOptions(this.state.nfts)}
                        </Form.Select>
                        {/*{this.state.nfts[0]?.name}f*/}
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="amount" >
                        <Form.Label>Fractions to make</Form.Label>
                        <Form.Control type="text" placeholder="0" onChange={(e)=> this.mintAmount = e.target.value}/>
                    </Form.Group>
                    <Button variant="primary" onClick={()=>{
                        fractionalizeNft(this.selectedNft as Nft,this.props.address,this.mintAmount as string)
                            .then((res)=>alert("fracked nft!")).catch(()=>alert("failed to frack nft!"))
                    }}>
                        Mint
                    </Button>
                </Form>
                <Button className="mt-2" variant ="primary" onClick={() => createDemoNft(this.props.address)}>Create demo nft</Button>
            </Card.Body>
        </Card>)
    }

}


export default Mint;
