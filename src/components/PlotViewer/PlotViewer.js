import React, { Component } from "react";
import { connect } from "react-redux";

import Map from "../Map/Map";
import "ol/ol.css";
import styles from "./PlotViewer.module.scss";

class PlotViewer extends Component {
  constructor(props) {
    super(props);
    Map.createNewMap();
  }

  componentDidMount() {
    Map.setBackgroundTileLayer(this.props.type);
    /*Map.addUsersPlotBoundriesLayer(
      this.featureSelected,
      this.featureHovered,
      this.props.userFeatures
    );*/
    Map.map.setTarget("map");
  }

  resetMapLayers() {
    Map.setBackgroundTileLayer(this.props.type);
    Map.togglePlotBoundriesLayers(this.props.plotBoundriesState);

    if (this.props.shapefile) {
      Map.setShapeFile(this.props.shapefile);
    }
  }

  render() {
    this.resetMapLayers();
    if (this.props.feature !== null) {
      Map.addUsersPlotBoundriesLayer(null, null, [this.props.feature]);
      Map.setExtentOfMapByUserFeaters(this.props.feature.coords);
    }
    return (
      <div>
        <div id="map" className={styles.Map}></div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    type: state.mapDetails.type,
    plotBoundriesState: state.mapDetails.state,
  };
};

export default connect(mapStateToProps)(PlotViewer);
