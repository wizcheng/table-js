import React, {Component} from "react";
import "./HeaderMenu.css";

export default class HeaderMenu extends Component {

  constructor(props){
    super(props);
    this._handleFilterChange = this._handleFilterChange.bind(this);
    this._handleKeyUp = this._handleKeyUp.bind(this);

    this.state = {
      filter: ""
    }
  }

  _handleFilterChange(event) {
    this.setState({
      filter: event.target.value
    })
  }

  _handleKeyUp(e){
    if (e.keyCode === 13){
      if (this.props.onClick){
        this.props.onClick({
          filter: {
            value: this.state.filter
          }
        })
      }
    }
  }

  render() {

    const {onClick} = this.props;
    const _handleClick = (type) => {
      if (onClick) {
        onClick({
          sort: {
            order: type
          }
        })
      }
    };

    const _handleFilterClear = () => {
      if (onClick){
        onClick({
          filter: {
            value: ""
          }
        })
      }
    }

    return <div className="header-menu">
      <div className="title">-- sort by --</div>
      <div className="item" onClick={_handleClick.bind(this, "ascending")}>ascending</div>
      <div className="item" onClick={_handleClick.bind(this, "descending")}>descending</div>
      <div className="item" onClick={_handleClick.bind(this, "clear")}>clear</div>
      <div className="title">-- filter by --</div>
      <div className="item-noclick">
          <input style={{width: "100%", boxSizing: "border-box"}} type="text" onChange={this._handleFilterChange} value={this.state.filter} onKeyUp={this._handleKeyUp}></input>
          (press enter)
      </div>
      <div className="item" onClick={_handleFilterClear}>clear</div>
    </div>
  }
}
