import React from 'react';
import './App.css';
import {Button, Nav, Navbar} from "react-bootstrap";
import Mint from "./Mint";
import {getAlbedoPublicKey} from "./lib/albedo";
import {shorten} from "./lib/utils";

interface IAppState {
    connected: boolean
    address: string

}

class App extends React.Component<any, IAppState> {
    constructor(props: any) {
        super(props)
        this.state = {
            connected: false,
            address: ""
        }
    }

    header() {
        return (
            <Navbar fixed="top" bg="dark" variant="dark">
                <Nav.Item>
                    <Nav.Link href="/">Mint</Nav.Link>
                </Nav.Item>
                <Nav.Item className="AlbedoRight">
                    <Button className="float-end m-2" onClick={() => this.connectAlbedo()}>
                        {this.state.connected ? shorten(this.state.address) : "Connect"}
                    </Button>
                </Nav.Item>
            </Navbar>
        )
    }

    connectAlbedo() {
        if (this.state.connected) {
            this.setState({
                connected: false,
                address: ""
            })
            return
        }
        getAlbedoPublicKey().then((res) => {
            console.log(`connected ${res}`)
            this.setState({
                connected: true,
                address: res
            })
        })
    }

    render() {
        return (
            <div className="App">
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
                    integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
                    crossOrigin="anonymous"
                />
                {this.header()}
                <Mint address={this.state.address} connected={this.state.connected}/>
            </div>
        )
    }

}


export default App;
