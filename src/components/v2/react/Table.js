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

    const style = {width, height, position: "relative"};

    return (
      <div className="table" style={style}>

        <Header
          zIndex={0}
          scrollLeftTo={bodyOffsetLeft}
          left={table.utils.headerLeft()}
          top={table.utils.headerTop()}
          visibleWidth={table.utils.headerVisibleWidth()}
          visibleHeight={table.utils.headerVisibleHeight()}
          width={table.utils.headerWidth()}
          height={table.utils.headerHeight()}
          offsetLeft={bodyOffsetLeft}
          offsetTop={0}
          cells={cellToComponents(table.visibleHeaders())}
        />
        <Body
          zIndex={0}
          scrollTopTo={bodyOffsetTop}
          left={table.utils.bodyLeft()}
          top={table.utils.bodyTop()}
          visibleWidth={table.utils.bodyVisibleWidth()}
          visibleHeight={table.utils.bodyVisibleHeight()}
          width={table.utils.bodyWidth()}
          height={table.utils.bodyHeight()}
          cells={cellToComponents(table.visibleCells())}
          onScroll={this.handleScroll}
        />


        <Header
          zIndex={1}
          scrollLeftTo={0}
          left={0}
          top={table.utils.headerTop()}
          visibleWidth={table.utils.headerLeft()}
          visibleHeight={table.utils.headerVisibleHeight()}
          width={table.utils.headerLeft()}
          height={table.utils.headerHeight()}
          offsetLeft={0}
          offsetTop={0}
          cells={cellToComponents(table.visibleFixedHeaders())}
        />
        <Body
          zIndex={1}
          scrollTopTo={bodyOffsetTop}
          left={0}
          top={table.utils.bodyTop()}
          visibleWidth={table.utils.bodyLeft()}
          visibleHeight={table.utils.bodyVisibleHeight()}
          width={table.utils.bodyLeft()}
          height={table.utils.bodyHeight()}
          cells={cellToComponents(table.visibleFixedCells())}
          // onScroll={this.handleScroll}
          noScroll
        />
      </div>
    );


  }
}
