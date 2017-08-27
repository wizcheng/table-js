import React, {Component} from "react";
import R from "ramda";

const itemsToDOM = R.addIndex(R.map)((item, i) => {
  const style = {
    top: item.top,
    left: item.left,
    width: item.width,
    position: "absolute"
  };
  return <div key={i} style={style}>{item.item}</div>;
});

class HeaderMenu extends Component {

  render() {

    const {width, height, zIndex, open, items} = this.props;
    const style = {
      width: 0,
      height: 0,
      zIndex: zIndex,
      border: "2px red solid",
      position: "absolute"
    };

    return (
      <div style={style}>
        {itemsToDOM(items)}
      </div>
    )
  }
}

export default HeaderMenu;
