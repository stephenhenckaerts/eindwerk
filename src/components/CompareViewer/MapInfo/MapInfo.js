import React, { Component } from "react";

import ColorTypeInfo from "./ColorTypeInfo/ColorTypeInfo";
import DetailedInfo from "./DetailedInfo/DetailedInfo";

import styles from "./MapInfo.module.scss";

class MapInfos extends Component {
  state = {
    colorType: null,
  };

  colorTypeClicked(type) {
    this.setState({ colorType: type });
  }

  render() {
    let mapInfo = (
      <ColorTypeInfo
        colorTypeClicked={(type) => this.colorTypeClicked(type)}
        colors={this.props.colors}
      />
    );
    if (this.state.colorType) {
      mapInfo = (
        <DetailedInfo
          type={this.state.colorType}
          returnClicked={() => this.colorTypeClicked(null)}
        />
      );
    }
    return <div className={styles.InfoDiv}>{mapInfo}</div>;
  }
}

export default MapInfos;
