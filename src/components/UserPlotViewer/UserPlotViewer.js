import React, { Component } from "react";
import { connect } from "react-redux";

import Map from "../Map/Map";
import "ol/ol.css";
import styles from "./UserPlotViewer.module.scss";

class UserPlotViewer extends Component {
  constructor(props) {
    super(props);
    Map.createNewMap();

    this.mapBackgroundType = null;
  }

  componentDidMount() {
    Map.setBackgroundTileLayer(this.props.type);
    Map.addUsersPlotBoundriesLayer(
      this.featureSelected,
      this.featureHovered,
      this.props.userFeatures
    );
    Map.map.setTarget("map");
    Map.setExtentOfMapByUserFeaters();
  }

  resetMapLayers() {
    Map.setBackgroundTileLayer(this.props.type);
    Map.togglePlotBoundriesLayers(this.props.plotBoundriesState);
  }

  featureSelected = (event, select) => {
    if (event.selected[0]) {
      this.props.featureSelected(event.selected[0].id_);
    }
  };

  featureHovered = (featureId) => {
    this.props.featureHovered(featureId);
  };

  closePopup() {
    this.overlay.setPosition(undefined);
    Map.clearSelect();
    return false;
  }

  addFeature() {
    this.overlay.setPosition(undefined);
    Map.clearSelect();
    this.props.featureAddedHandler(this.selectedFeature);
  }

  render() {
    this.resetMapLayers();
    if (this.props.hoveredSideBarFeature) {
      Map.hoveredSideBarFeatureHandler(this.props.hoveredSideBarFeature);
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

export default connect(mapStateToProps)(UserPlotViewer);
