import React, {Component} from "react";
import R from "ramda";
import "./Cell.css";

export default class Cell extends Component {


  render() {

    const {x, y, width, height, value} = this.props;
    const style = {
      top: y,
      left: x,
      width: width,
      height: height,
      position: "absolute"
    };

    return (
      <div className="cell" style={style}>
        {value}
      </div>
    )
  }
}
