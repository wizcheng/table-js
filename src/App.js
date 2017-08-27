import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import SimpleTable from "./components/examples/SimpleTable";

class App extends Component {


  render() {
    return (
      <div className="App">

        <h3>Simple Table</h3>

        <SimpleTable/>

      </div>
    );
  }
}

export default App;
