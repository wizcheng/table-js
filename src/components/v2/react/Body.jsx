import React, {Component} from "react";
import "./Body.css";

export default class Body extends Component {

  constructor(props){
    super(props);
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {scrollTopTo} = nextProps;
    this.body.scrollTop = scrollTopTo;
  }

  render() {

    const {visibleWidth, visibleHeight, width, height, cells, top, left, zIndex, onScroll, noScroll} = this.props;
    const style = {
      width: width,
      height: height,
      position: "relative"
    };

    const overflowX = noScroll ? "hidden" : "scroll";
    const overflowY = noScroll ? "hidden" : "scroll";

    const _handleScroll = () => {
      if (onScroll){
        onScroll(this.body.scrollLeft, this.body.scrollTop);
      }
    };

    return (
      <div ref={(body) => {this.body = body}} className="body" style={{
        top: top,
        left: left,
        zIndex: zIndex,
        width: visibleWidth,
        height: visibleHeight,
        position: "absolute",
        overflowX: overflowX,
        overflowY: overflowY,
      }} onScroll={_handleScroll}>
        <div style={style}>
          {cells}
        </div>
      </div>
    )
  }
}
