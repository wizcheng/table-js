import React, { Component } from 'react';
import R from "ramda";
// eslint-disable-next-line
import TableCss from "./Table.css"

class Table extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      columns: props.columns,
      config: props.config
    }
  }

  renderCell(data, column, height){
    const style = {
      width: column.width,
      height: height,
      border: "1px solid #eeeeee",
    };
    return <div style={style} className="cell">{data[column.key]}</div>;
  }

  rowWidth(columns){
    return R.sum(R.map(c => c.width, columns));
  }

  renderRow(data, columns, height) {
    return R.map(col => {
      return this.renderCell(data, col, height);
    }, columns)
  }

  renderRows(dataList, columns, height) {
    const style = {
      width: this.rowWidth(columns),
      height: height
    };
    return R.map(data => {
      return <div className="row" style={style}>
        {this.renderRow(data, columns, height)}
      </div>
    }, dataList);
  }

  renderBody(dataList, columns, config, handleScroll) {
    const handleBodyScroll = (event) => {
      if (handleScroll){
        handleScroll(event.target.scrollLeft);
      }
    }
    const rows = this.renderRows(dataList, columns, config.rowHeight);
    const bodyStyle = {
      overflowX: "scroll",
      overflowY: "scroll",
      height: config.height - config.headerHeight
    };
    return <div style={bodyStyle} onScroll={handleBodyScroll}>
      {rows}
    </div>
  }

  renderHeaders(columns, config) {
    const style = {
      width: this.rowWidth(columns)
    };

    const headers = R.map(col => {
      const style = {
        width: col.width,
        height: config.headerHeight,
        border: "1px solid #eeeeee",
      };
      return <div className="cell" style={style}>{col.name}</div>
    }, columns);

    var headerRow = <div className="row header" style={style}>
      {headers}
    </div>;

    const headerStyle = {
      overflowX: "hidden",
      overflowY: "hidden"
    };

    return <div style={headerStyle} ref="header">
      {headerRow}
    </div>
  }


  render() {

    const handleScroll = (left) => {
      console.log(left)
      this.refs.header.scrollLeft = left;
    };

    const style = {
      width: this.state.config.width,
      height: this.state.config.height,
      border: "solid 1px red"
    };

    const headers = this.renderHeaders(this.state.columns, this.state.config);
    const body = this.renderBody(this.state.data, this.state.columns, this.state.config, handleScroll);
    return <div className="table" style={style}>
              {headers}
              {body}
    </div>
  }

}

export default Table
