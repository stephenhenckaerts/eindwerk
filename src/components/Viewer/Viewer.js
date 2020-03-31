import React, { Component } from "react";
import { connect } from "react-redux";

import Map from "../Map/Map";
import "ol/ol.css";
import styles from "./Viewer.module.scss";
import Select from "ol/interaction/Select";
import Overlay from "ol/Overlay";
import Snackbar from "@material-ui/core/Snackbar";

class Viewer extends Component {
  componentDidMount() {
    Map.map.setTarget("map");
    var container = document.getElementById("popup");
    var overlay = new Overlay({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });
    this.overlay = overlay;
    Map.map.addOverlay(overlay);
  }

  featureSelected = event => {
    if (event.selected[0]) {
      this.selectedFeature = event.selected[0];
      var selectedFeature = {
        id: event.selected[0].id_,
        gewasgroepnaam: event.selected[0].getProperties().GEWASGROEP,
        gewasnaam: event.selected[0].getProperties().LBLHFDTLT,
        oppervlak: (event.selected[0].getProperties().OPPERVL / 10000).toFixed(
          2
        ),
        coords: event.selected[0].getProperties().geometry.extent_
      };

      var content = document.getElementById("popup-content");
      content.innerHTML =
        "<p><strong>Gewasgroepnaam: </strong>" +
        selectedFeature.gewasgroepnaam +
        "</p>" +
        "<p><strong>Gewasnaam: </strong>" +
        selectedFeature.gewasnaam +
        "</p>" +
        "<p><strong>Oppervlak: </strong>" +
        selectedFeature.oppervlak +
        " ha</p>";
      this.overlay.setPosition(event.mapBrowserEvent.coordinate);
    }
  };

  closePopup() {
    this.overlay.setPosition(undefined);
    this.select.getFeatures().clear();
    return false;
  }

  addFeature() {
    this.overlay.setPosition(undefined);
    this.select.getFeatures().clear();
    return false;
  }

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
        <div id="popup" className={styles.OlPopup}>
          <div className={styles.OlPopupButtonsDiv}>
            <button
              className={[styles.PopupButton, styles.ClosePopupButton].join(
                " "
              )}
              onClick={() => this.closePopup()}
            >
              Annuleer
            </button>
            <button
              className={[styles.PopupButton, styles.AddPopupButton].join(" ")}
              onClick={() => this.addFeature()}
            >
              Voeg Toe
            </button>
          </div>
          <div id="popup-content"></div>
        </div>
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
