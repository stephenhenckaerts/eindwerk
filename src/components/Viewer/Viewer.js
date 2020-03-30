import React, { Component } from "react";
import { connect } from "react-redux";

import Map from "../Map/Map";
import "ol/ol.css";
import styles from "./Viewer.module.css";

class Viewer extends Component {
  componentDidMount() {
    Map.map.setTarget("map");
  }

  render() {
    Map.setBackgroundTileLayer(this.props.type);
    return (
      <div>
        <div id="map" className={styles.Map}></div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    type: state.type
  };
};

export default connect(mapStateToProps)(Viewer);
