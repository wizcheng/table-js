import React, {Component} from "react";
import "./HeaderMenu.css";

export default class HeaderMenu extends Component {

  render() {

    const {onClick} = this.props;
    const _handleClick = (type) => {
      if (onClick) {
        onClick({
          sortOrder: type
        })
      }
    };

    return <div className="header-menu">
      Sort<br/>
      <div className="item" onClick={_handleClick.bind(this, "ascending")}>ascending</div>
      <div className="item" onClick={_handleClick.bind(this, "descending")}>descending</div>
    </div>
  }
}
