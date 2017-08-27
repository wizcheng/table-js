import React, {Component} from "react";
import R from "ramda";
import "./Header.css";

export default class Header extends Component {

  constructor(props) {
    super(props);
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this._handleClick = this._handleClick.bind(this);
    this.state = {
      popupOpen: false
    }
  }

  componentWillReceiveProps(nextProps) {
    const {scrollLeftTo} = nextProps;
    this.header.scrollLeft = scrollLeftTo;
  }

  componentDidMount(){
  }

  _handleClick() {
    this.setState({
      popupOpen: !this.state.popupOpen
    })
  }

  render() {

    const {visibleWidth, visibleHeight, width, height, top, left, zIndex, cells} = this.props;
    const style = {
      width: width,
      height: height,
      position: "relative"
    };

    const constainerStyle = {
      top: top,
      left: left,
      width: visibleWidth,
      height: visibleHeight,
      position: "absolute",
      zIndex: zIndex,
    };

    return (
      <div id="header" ref={(header) => {this.header = header}} className="header" style={constainerStyle}>
        <div style={style}>
          {cells}
        </div>
      </div>
    )
  }
}
