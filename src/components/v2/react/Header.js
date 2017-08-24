import React, {Component} from "react";
import R from "ramda";
import "./Header.css";

export default class Header extends Component {

  render() {

    const {visibleWidth, visibleHeight, width, height, cells} = this.props;
    const style = {
      width: width,
      height: height,
      position: "relative"
    };

    return (
      <div id="header" ref="header" className="header" style={{
        width: visibleWidth,
        height: visibleHeight
      }}>
        <div style={style}>
          {cells}
        </div>
      </div>
    )
  }
}
