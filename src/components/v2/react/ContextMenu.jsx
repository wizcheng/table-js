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

  constructor(props){
    super(props);
    this.handleEscape = this.handleEscape.bind(this);
  }

  handleEscape(e) {
    if (e.keyCode === 27) {
      console.log("Escape pressed");
      if (this.props.onEscape){
        this.props.onEscape();
      }
    }
  }

  componentDidMount() {
    document.addEventListener("keyup", this.handleEscape);
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.handleEscape);
  }

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
