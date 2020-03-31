import React, { Component } from "react";
import { connect } from "react-redux";

import Map from "../Map/Map";
import "ol/ol.css";
import styles from "./Viewer.module.css";
import Select from "ol/interaction/Select";

class Viewer extends Component {
  componentDidMount() {
    Map.map.setTarget("map");
  }

  featureSelected = event => {
    if (event.selected[0]) {
      function capitalizeFirstLetter(string) {
        string = string.toLowerCase();
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
      /*this.setState({
        selectedFeature: {
          id: event.selected[0].id_,
          gewasgroepnaam: event.selected[0].getProperties().GEWASGROEPNAAM,
          gewasnaam: event.selected[0].getProperties().GWSNAM_H,
          plaats: capitalizeFirstLetter(
            event.selected[0].getProperties().PRC_GEM
          ),
          coords: event.selected[0].getProperties().geometry.extent_
        }
      });*/
      var selectedFeature = {
        id: event.selected[0].id_,
        gewasgroepnaam: event.selected[0].getProperties().GEWASGROEP,
        gewasnaam: event.selected[0].getProperties().LBLHFDTLT,
        oppervlak: event.selected[0].getProperties().OPPERVL,
        coords: event.selected[0].getProperties().geometry.extent_
      };
      console.log(selectedFeature);
    } else {
    }
  };

  render() {
    Map.removeAllLayers();
    Map.setBackgroundTileLayer(this.props.type);
    if (this.props.plotBoundriesState) {
      Map.togglePlotBoundriesLayers(this.props.plotBoundriesState);
      if (this.select == null) {
        this.select = new Select({});
        this.select.on("select", event => this.featureSelected(event));
        Map.map.addInteraction(this.select);
      }
    } else {
      Map.map.removeInteraction(this.select);
      this.select = null;
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
