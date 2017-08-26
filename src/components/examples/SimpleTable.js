import React, {Component} from "react";
import Table from "../v2/react/Table";
import mockApi from "../../common/mockApi";
import R from "ramda";
import "./SimpleTable.css";

class SimpleTable extends Component {


  render() {

    const columnCount = 200;
    const columns = R.map(i => {
      return {
        name: "Field " + i,
        key: "field_" + i,
        width: 100
      }
    }, R.range(1, columnCount + 1));

    columns[0].fixed = true;
    columns[1].fixed = true;

    console.log("start mock data");
    const data = mockApi.loadData(10000, columnCount);
    console.log("start mock data ... done");


    const cellRenderer = (c) => {
      return <div className="myCell">{c.value}</div>
    };

    return (
      <div style={{display: "inline-block"}}>
        <Table
          width={1000}
          height={500}
          rowHeight={20}
          headerRowHeight={26}
          columns={columns}
          data={data}
          cellRenderer={cellRenderer}/>
      </div>
    )
  }
}

export default SimpleTable;
