import React, {Component} from "react";
import R from "ramda";
import "./Table.css";
import tableCreator from "../js/table";
import Cell from "./Cell";
import Body from "./Body";
import Header from "./Header";

export default class Table extends Component {

  constructor(props) {
    super(props);

    this.handleScroll = this.handleScroll.bind(this);

    const config = R.pick(["width", "height", "rowHeight", "headerRowHeight", "columns"], props);

    const table = tableCreator.create();
    table.setConfig(config);
    table.setDataArray(props.data);

    this.state = {
      table: table,
      bodyOffsetLeft: 0,
      bodyOffsetTop: 0,
    }
  }

  handleScroll(x, y) {
    console.log("scroll to x/y", x, y);
    this.setState({
      bodyOffsetLeft: x,
      bodyOffsetTop: y
    });
  }

  render() {

    const table = this.state.table;

    const bodyOffsetLeft = this.state.bodyOffsetLeft;
    const bodyOffsetTop = this.state.bodyOffsetTop;
    table.setViewport({
      offsetLeft: () => bodyOffsetLeft,
      offsetTop: () => bodyOffsetTop,
    });

    const {width, height} = table.config;
    const cellToComponents = R.map(c => <Cell key={c.x+"_"+c.y} x={c.x} y={c.y} width={c.width} height={c.height}
                                              value={c.value}/>)

    const cellWithOffset = (offsetLeft, offsetTop, cells) => {
      return R.map(c => <Cell key={c.x+"_"+c.y}
                              x={c.x + offsetLeft}
                              y={c.y + offsetTop}
                              width={c.width}
                              height={c.height}
                              value={c.value}/>, cells);
    }

    console.log("width and height", width, height);

    const style = {width, height};

    return (
      <div className="table" style={style}>
        <Header
          visibleWidth={table.utils.headerVisibleWidth()}
          visibleHeight={table.utils.headerVisibleHeight()}
          width={table.utils.headerWidth()}
          height={table.utils.headerHeight()}
          offsetLeft={bodyOffsetLeft}
          offsetTop={0}
          cells={cellWithOffset(-bodyOffsetLeft, 0, table.visibleHeaders())}
        />
        <Body
          visibleWidth={table.utils.bodyVisibleWidth()}
          visibleHeight={table.utils.bodyVisibleHeight()}
          width={table.utils.bodyWidth()}
          height={table.utils.bodyHeight()}
          cells={cellToComponents(table.visibleCells())}
          onScroll={this.handleScroll}
        />
      </div>
    );


  }
}
