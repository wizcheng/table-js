import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Table from "./components/v2/react/Table";
import mockApi from "./common/mockApi";
import R from "ramda";

class App extends Component {


  render() {

    const columnCount = 200;
    const columns = R.map(i => {
      return {
        name: "Field " + i,
        key: "field_" + i,
        width: 100
      }
    }, R.range(1, columnCount+1));

    columns[0].fixed = true;
    columns[1].fixed = true;

    console.log("start mock data");
    const data = mockApi.loadData(10000, columnCount);
    console.log("start mock data ... done");

    //<Table columns={columns} data={data} config={config}/>

    return (
      <div className="App">

        <h3>Simple Table</h3>

        <div style={{display: "inline-block"}}>
          <Table
            width={1000}
            height={500}
            rowHeight={25}
            headerRowHeight={30}
            columns={columns}
            data={data}/>
        </div>

      </div>
    );
  }
}

export default App;
