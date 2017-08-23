import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Table from "./components/Table";
import mockApi from "./common/mockApi";
import R from "ramda";

class App extends Component {


  render() {

    const columnCount = 100;
    const columns = R.map(i => {
      return {
        name: "Field " + i,
        key: "field_" + i,
        width: 200
      }
    }, R.range(1, columnCount+1));

    const config = {
      height: 500,
      width: 500,
      rowHeight: 25,
      headerHeight: 30
    };

    console.log("start mock data");
    const data = mockApi.loadData(1000, columnCount);
    console.log("start mock data ... done");

    //<Table columns={columns} data={data} config={config}/>

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>



      </div>
    );
  }
}

export default App;
