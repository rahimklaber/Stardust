import React from 'react';
import './App.css';
import {Button, Card, Form, FormText} from "react-bootstrap";
import {findNfts, Nft} from "./lib/stellar";


interface IMintState {
    nfts: Array<Nft>
}

interface IMintProps {
    address: string
    connected: boolean
}

class Mint extends React.Component<IMintProps, IMintState> {
    constructor(props: IMintProps) {
        super(props)
        this.state = {nfts: []}
        this.getNfts()
    }

    getNfts() {
        if(!this.props.address){
            return
        }
        findNfts(this.props.address).then((res) => {
            this.setState({
                nfts: res
            })
        })
    }

    render() {
        return (<Card className="Mint">
            <Card.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" />
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Check me out" />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Card.Body>
        </Card>)
    }

}


export default Mint;
