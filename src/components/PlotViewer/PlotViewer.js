import React, { Component } from "react";
import { connect } from "react-redux";

import Map from "../Map/Map";
import "ol/ol.css";
import styles from "./PlotViewer.module.scss";
import NotesEditor from "../NotesEditor/NotesEditor";

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
    Map.changeControls(false);
  }

  resetMapLayers() {
    Map.setBackgroundTileLayer(this.props.type);
    Map.togglePlotBoundriesLayers(this.props.plotBoundriesState);

    if (this.props.feature !== null) {
      if (this.props.showNotes) {
        if (this.props.feature.shapefile !== "None") {
          Map.setShapeFile(this.props.shapefile);
        }
      } else {
        Map.addUsersPlotBoundriesLayer(null, null, [this.props.feature]);
      }
      Map.setExtentOfMapByUserFeaters(this.props.feature.coords);
    }
  }

  render() {
    this.resetMapLayers();
    let notesOptions = null;
    if (this.props.showNotes) {
      notesOptions = <NotesEditor shapefile={this.props.feature.shapefile} />;
    }
    return (
      <div>
        <div id="map" className={styles.Map}>
          {notesOptions}
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

export default connect(mapStateToProps)(PlotViewer);
