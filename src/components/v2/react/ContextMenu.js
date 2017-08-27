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

class ContextMenu extends Component {

  render() {

    const {zIndex, items} = this.props;
    const style = {
      width: 0,
      height: 0,
      zIndex: zIndex,
      position: "absolute"
    };

    return (
      <div style={style}>
        {itemsToDOM(items)}
      </div>
    )
  }
}

export default ContextMenu;
