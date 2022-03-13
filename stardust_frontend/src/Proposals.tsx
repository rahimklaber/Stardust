import React from 'react';
import './App.css';
import {Button, Card, Form, Image, Modal} from "react-bootstrap";
import {createDemoNft, findNfts, fractionalizeNft, Nft} from "./lib/stellar";
import {shorten} from "./lib/utils";
import {Asset} from "stellar-sdk";
import {
    addProp,
    execute,
    getNftsFromServer,
    getPropsFromServer,
    getServerAccountId,
    serverAddress
} from "./lib/backend";
import {Link} from "react-router-dom";

export type ServerNft = { name: string, asset_code: string, issuer: string, image_url: string, frac_code: string, frac_issuer: string }

export type ServerProposal = { nft: ServerNft, text: string, xdr: string }

interface IProposalState {
    nfts: Array<ServerNft>,
    proposals: ServerProposal[],
    show : boolean,
}

interface IProposalProps {
    address: string
    connected: boolean
}

class Proposals extends React.Component<IProposalProps, IProposalState> {
    // @ts-ignore
    selectedNft : ServerNft | null = null
    code: string =""
    issuer : string =""
    text : string =""
    xdr  : string = ""
    constructor(props: IProposalProps) {
        super(props)
        this.state = {nfts: [], proposals: [], show:false}
    }

    componentDidMount() {
        this.getServerNfts()
    }

    getServerNfts() {
        getNftsFromServer()
            .then((res) => {
                this.setState({nfts: res})
            })
    }

    getServerProps() {
        getPropsFromServer()
            .then((res) => {
                console.log(res)
                if(res){
                    this.setState({proposals: res})
                }
            })
    }


    componentDidUpdate(prevProps: Readonly<IProposalProps>, prevState: Readonly<IProposalState>, snapshot?: any) {
        console.log(prevProps)
        if (!prevProps.connected && this.props.connected) {
            this.getServerNfts()
            this.getServerProps()
        }
    }

    createProposals() {
        return this.state.proposals.map((proposal,idx) => {
            return (<Card key={idx} className="Mint">
                <Card.Body>
                   <div>
                       <div>
                           <img src={proposal.nft.image_url}/>
                           <span>{proposal.nft.name}</span>
                       </div>
                       <p>
                         description:   {proposal.text}
                       </p>
                       <p>
                          xdr:  {proposal.xdr}
                       </p>
                       <Button className="mt-2">
                           Vote for proposal
                       </Button>
                       <Button className="mt-2" onClick={()=>execute(proposal)}>
                           Try to execute proposal
                       </Button>
                   </div>
                </Card.Body>
            </Card>)
        })
    }

    show(){
        this.setState({show:true})
    }

    close(){
        this.setState({show:false})
    }

    getNftOptions(nfts:ServerNft[])  {
        console.log("in get server nft option",nfts)

        if(nfts.length > 0 && this.code == ""){
            this.selectedNft = nfts[0]
            this.code = nfts[0].asset_code
                this.issuer = nfts[0].issuer
            this.setState({nfts: this.state.nfts})
        }
        getServerAccountId()
        return nfts.map((nft,idx)=>{
            return <option onChange={(e)=> {
                this.selectedNft = nft
                this.code =   this.selectedNft.asset_code
                this.issuer =   this.selectedNft.issuer
            }} key={`${idx}`} value={`${nft.name}`}>
                {`${nft.name}`}
            </option>
        })
    }



    render() {
        // @ts-ignore
        return (<>
            <Card className="Proposals">
                <Button onClick={()=>this.show()}>
                    Create Proposal
                </Button>
                <Card.Body>
                    {this.createProposals( )}
                </Card.Body>
            </Card>
            <Modal show={this.state.show} size="lg" onHide={()=>this.close()}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Proposal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>nft code : {this.code}</div>
                    <span>nft issuer : {this.issuer}</span>
                    <div>server address: {serverAddress}</div>
                    <Form>
                        <Form.Group className="mb-3" controlId="nfts">
                            <Form.Label>Select an Nft</Form.Label>
                            <Form.Select >
                                {this.getNftOptions(this.state.nfts)}
                            </Form.Select>
                            {/*{this.state.nfts[0]?.name}f*/}
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="desc" >
                            <Form.Label>Proposal Description</Form.Label>

                            <Form.Control type="text" placeholder="" onChange={(e)=> this.text = e.target.value}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="xdr" >
                            <Form.Label>Paste in the proposal xdr here</Form.Label>
                            <Form.Control type="text" placeholder="" onChange={(e)=> this.xdr = e.target.value}/>
                        </Form.Group>

                        <Button variant="primary" onClick={()=>{
                            addProp({nft: this.selectedNft, text : this.text, xdr: this.xdr} as ServerProposal)
                                .then((res)=>alert("added proposal")).catch(()=>alert("failed to add proposal"))
                                .then((res)=> this.getServerProps())
                        }}>
                            Create proposal
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {/*<Button variant="secondary" onClick={()=>show = false}>*/}
                    {/*    Close*/}
                    {/*</Button>*/}
                    {/*<Button variant="primary" onClick={()=>show = false}>*/}
                    {/*    Save Changes*/}
                    {/*</Button>*/}
                </Modal.Footer>
            </Modal>

        </>)
    }

}


export default Proposals;
