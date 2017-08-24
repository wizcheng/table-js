import React, {Component} from "react";
import R from "ramda";
import "./Body.css";

export default class Body extends Component {




  render() {

    const {visibleWidth, visibleHeight, width, height, cells, onScroll} = this.props;
    const style = {
      width: width,
      height: height,
      position: "relative"
    };

    const _handleScroll = () => {
      console.log("scroll");
      if (onScroll){
        onScroll(this.refs.body.scrollLeft, this.refs.body.scrollTop);
      }
    };

    return (
      <div ref="body" className="body" style={{
        width: visibleWidth,
        height: visibleHeight
      }} onScroll={_handleScroll}>
        <div style={style}>
          {cells}
        </div>
      </div>
    )
  }
}
