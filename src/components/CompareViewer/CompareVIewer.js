import React, { Component } from "react";
import { connect } from "react-redux";

import Map from "../Map/Map";
import "ol/ol.css";
import styles from "./CompareViewer.module.scss";

class CompareViewer extends Component {
  state = {
    showUploadFileWindow: false,
  };

  constructor(props) {
    super(props);

    this.Map = new Map();
    this.SecondMap = new Map();

    this.Map.createNewMap();
    this.SecondMap.createNewMap();
  }

  componentDidMount() {
    this.addMapToElement(this.Map, "map");
    this.addMapToElement(this.SecondMap, "map2");
  }

  addMapToElement(map, element) {
    map.setBackgroundTileLayer(this.props.type);
    map.map.setTarget(element);
    map.changeControls(false);
  }

  resetMapLayers(map) {
    map.setBackgroundTileLayer(this.props.type);
    map.togglePlotBoundriesLayers(this.props.plotBoundriesState);

    if (this.props.feature !== null) {
      if (this.props.showNotes) {
        if (this.props.feature.shapefile !== "None") {
          map.setShapeFile(this.props.shapefile);
        }
      } else {
        map.addUsersPlotBoundriesLayer(null, null, [this.props.feature]);
      }
      map.setExtentOfMapByUserFeaters(this.props.feature.coords);
    }
  }

  render() {
    this.resetMapLayers(this.Map);
    this.resetMapLayers(this.SecondMap);
    return (
      <div>
        <div className={styles.MapsDiv}>
          <div className={styles.Map} id="map"></div>
          <div className={styles.Map} id="map2"></div>
        </div>
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

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(CompareViewer);
