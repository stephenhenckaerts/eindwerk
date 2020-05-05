import React, { Component } from "react";
import { connect } from "react-redux";

import Map from "../Map/Map";
import "ol/ol.css";
import styles from "./PlotViewer.module.scss";
import NotesEditor from "../NotesEditor/NotesEditor";

class PlotViewer extends Component {
  state = {
    showUploadFileWindow: false,
  };

  constructor(props) {
    super(props);
    this.Map = new Map();
    this.Map.createNewMap();
  }

  componentDidMount() {
    this.Map.setBackgroundTileLayer(this.props.type);
    this.Map.map.setTarget("map");
    this.Map.changeControls(false);
  }

  resetMapLayers() {
    this.Map.setBackgroundTileLayer(this.props.type);
    this.Map.togglePlotBoundriesLayers(this.props.plotBoundriesState);

    if (this.props.feature !== null) {
      if (this.props.showNotes) {
        if (this.props.feature.shapefile !== "None") {
          this.Map.setShapeFile(this.props.shapefile);
        }
      } else {
        this.Map.addUsersPlotBoundriesLayer(null, null, [this.props.feature]);
      }
      this.Map.setExtentOfMapByUserFeaters(this.props.feature.coords);
    }
  }

  render() {
    this.resetMapLayers();
    let notesOptions = null;
    if (this.props.showNotes) {
      notesOptions = (
        <NotesEditor
          shapefile={this.props.feature.shapefile}
          uploadShapefile={(shapefile) => this.props.uploadShapefile(shapefile)}
        />
      );
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

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(PlotViewer);
