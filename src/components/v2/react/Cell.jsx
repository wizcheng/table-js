import React, {Component} from "react";
import "./Cell.css";

export default class Cell extends Component {

  render() {

    const {type, row, column, x, y, width, height, children, className, onMouseOver, onClick} = this.props;
    const style = {
      top: y,
      left: x,
      width: width,
      height: height,
      position: "absolute"
    };

    const _handleMouseOver = () => {
      if (onMouseOver){
        onMouseOver(type, row, column);
      }
    };

    const _handleClick = () => {
      if (onClick){
        onClick(type, row, column);
      }
    };


    return (
      <div className={className + " cell"} style={style} onMouseOver={_handleMouseOver} onClick={_handleClick}>
        {children}
      </div>
    )
  }
}
