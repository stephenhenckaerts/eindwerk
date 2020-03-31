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
    Map.removeAllLayers();
    Map.setBackgroundTileLayer(this.props.type);
    if (this.props.plotBoundriesState) {
      Map.togglePlotBoundriesLayers(this.props.plotBoundriesState);
    }
    return (
      <div>
        <div id="map" className={styles.Map}></div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    type: state.type,
    plotBoundriesState: state.state
  };
};

export default connect(mapStateToProps)(Viewer);
