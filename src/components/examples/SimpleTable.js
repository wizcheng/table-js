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
        name: "Column " + i,
        key: "column_" + i,
        width: 100
      }
    }, R.range(0, columnCount));

    columns[0].fixed = true;
    columns[1].fixed = true;

    const data = mockApi.loadData(10000, columnCount);
    const cellRenderer = (c) => {
      return <div className="myCell">{c.value}</div>
    };

    const columnKey1 = i => (i * 2);
    const columnKey2 = i => (i * 2 + 1);

    const fixedGroup = [];
    const normalGroup = [];

    const groups = [
      {
        type: 'group',
        name: 'Fixed Group',
        key: 'fixed_group',
        children: fixedGroup
      },
      {
        type: 'group',
        name: 'Normal Group',
        key: 'normal_group',
        children: normalGroup
      }
    ];

    for (let i=0; i < columnCount / 2; i++){
      const groupDefinition = {
        type: 'group',
        name: "Group " + columnKey1(i) + " & " + columnKey2(i),
        key: 'group_' + i,
        children: [
          {type: 'column', key: 'column_' + columnKey1(i)},
          {type: 'column', key: 'column_' + columnKey2(i)},
        ]
      };

      if (i===0){
        fixedGroup.push(groupDefinition);
      } else {
        normalGroup.push(groupDefinition);
      }
    }


    return (
      <div style={{display: "inline-block"}}>
        <Table
          width={800}
          height={350}
          rowHeight={20}
          headerRowHeight={26}
          columns={columns}
          groups={groups}
          data={data}
          cellRenderer={cellRenderer}/>

      </div>
    )
  }
}

export default SimpleTable;
