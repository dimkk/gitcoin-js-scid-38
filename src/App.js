import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import IPFS from 'ipfs'

class App extends Component {
  constructor(props){
    super(props)
    this.state = {hello:'ipfs not loaded'}
  }
  componentDidMount(){
    //const IPFS = function(){}
    const node = new IPFS()

    node.on('ready', () => {
      // Your node is now ready to use \o/
      this.setState({hello:'ipfs READY!'})
      // stopping a node
      node.stop(() => {
        // node is now 'offline'
      })
    })
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          message from ipfs: {this.state.hello}
        </p>
      </div>
    );
  }
}

export default App;
