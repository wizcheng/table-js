import React, {Component} from "react";
import R from "ramda";
import "./Header.css";

export default class Header extends Component {

  constructor(props){
    super(props);
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {scrollLeftTo} = nextProps;
    this.header.scrollLeft = scrollLeftTo;
  }

  render() {

    const {visibleWidth, visibleHeight, width, height, top, left, zIndex, cells} = this.props;
    const style = {
      width: width,
      height: height,
      position: "relative"
    };

    return (
      <div id="header" ref={(header) => {this.header = header}} className="header" style={{
        top: top,
        left: left,
        width: visibleWidth,
        height: visibleHeight,
        position: "absolute",
        zIndex: zIndex,
      }}>
        <div style={style}>
          {cells}
        </div>
      </div>
    )
  }
}
