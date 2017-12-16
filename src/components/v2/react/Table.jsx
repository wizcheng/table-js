import React, {Component} from "react";
import R from "ramda";
import "./Table.css";
import tableCreator from "../js/table";
import Cell from "./Cell";
import Body from "./Body";
import Header from "./Header";
import ContextMenu from "./ContextMenu";
import HeaderMenu from "./addons/HeaderMenu";

const MAX_SCROLL_BAR_SIZE = 20;

const context = {

  _items: [],

  showItem: (item) => {
    context._items = [item];
  },
  items: () => context._items,
  clear: () => {
    context._items = [];
  }
};

export default class Table extends Component {

  constructor(props) {
    super(props);

    this.handleScroll = this.handleScroll.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);

    const config = R.pick(["width", "height", "rowHeight", "headerRowHeight", "columns", 'groups'], props);

    const table = tableCreator.create();
    table.setConfig(config);
    table.setDataArray(props.data);

    this.state = {
      table: table,
      bodyOffsetLeft: 0,
      bodyOffsetTop: 0,
      mouseOverColumn: -1,
      mouseOverRow: -1,
      mouseClickColumn: -1,
      mouseClickRow: -1,
    }
  }

  handleScroll(x, y) {
    this.setState({
      bodyOffsetLeft: x,
      bodyOffsetTop: y,
      mouseClickRow: -1,
      mouseClickColumn: -1
    });
    context.clear();
  }

  handleMouseOver(row, column) {
    this.setState({
      mouseOverRow: row,
      mouseOverColumn: column
    })
  }

  handleMenuClick(column, action) {
    console.log("click " + column + " with action ", action);

    context.clear();

    if (action.sort){
      this.state.table.sort(column, action.sort.order);
    }
    if (action.filter){
      this.state.table.filter(column, action.filter.value);
    }

    this.setState({
      mouseClickRow: -1,
      mouseClickColumn: -1
    });
  }

  handleClick(row, column) {
    console.log("mouse click row/column", row, column);

    if (this.state.mouseClickColumn === column
      && this.state.mouseClickRow === row) {
      context.clear();
      this.setState({
        mouseClickRow: -1,
        mouseClickColumn: -1
      });
    } else {
      const pos = this.state.table.utils.rowAndColumnToPosition(row, column);
      context.showItem({
        top: pos.top + pos.height,
        left: pos.left,
        item: <div className="context-menu" style={{height: 80, width: 150}}>
          <HeaderMenu onClick={this.handleMenuClick.bind(this, column)}/>
        </div>
      });
      this.setState({
        mouseClickRow: row,
        mouseClickColumn: column
      });
    }
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
    const cellRenderer = this.props.cellRenderer ? this.props.cellRenderer : (c)=>c.value;
    const cellToComponents = R.map(c => {

      let className = c.row % 2 === 0 ? "even" : "odd";
      if (typeof this.state.mouseOverRow !== "undefined") {
        if (c.row === this.state.mouseOverRow) {
          className += " mouseover-row"
        }
      }
      if (typeof this.state.mouseOverColumn !== "undefined") {
        if (c.column === this.state.mouseOverColumn) {
          className += " mouseover-column"
        }
      }

      return <Cell key={c.x + "_" + c.y + "_" + c.width + "_" + c.height}
                   row={c.row}
                   column={c.column}
                   x={c.x}
                   y={c.y}
                   width={c.width}
                   height={c.height}
                   className={className}
                   onMouseOver={this.handleMouseOver}
                   onClick={this.handleClick}
      >{cellRenderer(c)}</Cell>
    });

    const style = {width, height, position: "relative"};

    return (
      <div className="simple-table" style={style}>

        <Header
          zIndex={0}
          scrollLeftTo={bodyOffsetLeft}
          left={table.utils.headerLeft()}
          top={table.utils.headerTop()}
          visibleWidth={table.utils.headerVisibleWidth()}
          visibleHeight={table.utils.headerVisibleHeight()}
          width={table.utils.headerWidth() + MAX_SCROLL_BAR_SIZE}
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
          context={context}
        />
        <Body
          zIndex={1}
          scrollTopTo={bodyOffsetTop}
          left={0}
          top={table.utils.bodyTop()}
          visibleWidth={table.utils.bodyLeft()}
          visibleHeight={table.utils.bodyVisibleHeight()}
          width={table.utils.bodyLeft()}
          height={table.utils.bodyHeight() + MAX_SCROLL_BAR_SIZE}
          cells={cellToComponents(table.visibleFixedCells())}
          // onScroll={this.handleScroll}
          noScroll
        />

        <ContextMenu
          zIndex={2}
          width={width}
          height={height}
          items={context.items()}
        />
      </div>
    );


  }
}
