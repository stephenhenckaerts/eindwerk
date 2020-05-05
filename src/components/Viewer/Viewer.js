import React, { Component } from "react";
import { connect } from "react-redux";

import Map from "../Map/Map";
import "ol/ol.css";
import styles from "./Viewer.module.scss";
import Overlay from "ol/Overlay";
import Button from "../UI/Button/Button";

class Viewer extends Component {
  constructor(props) {
    super(props);
    this.Map = new Map();
    this.Map.createNewMap();

    this.popup = React.createRef();
    this.popupContent = React.createRef();
  }

  componentDidMount() {
    this.Map.addBoundriesLayer(this.featureSelected);
    this.Map.map.setTarget("map");
    let container = this.popup.current;
    let overlay = new Overlay({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250,
      },
    });
    this.overlay = overlay;
    this.Map.map.addOverlay(overlay);
  }

  resetMapLayers() {
    this.Map.setBackgroundTileLayer(this.props.type);
    this.Map.togglePlotBoundriesLayers(this.props.plotBoundriesState);
  }

  featureSelected = (event, select) => {
    if (event.selected[0]) {
      this.selectedFeature = event.selected[0];
      let selectedFeature = {
        id: event.selected[0].id_,
        gewasgroepnaam: event.selected[0].getProperties().GEWASGROEP,
        gewasnaam: event.selected[0].getProperties().LBLHFDTLT,
        oppervlak: (event.selected[0].getProperties().OPPERVL / 10000).toFixed(
          2
        ),
        coords: event.selected[0].getProperties().geometry.extent_,
      };

      let content = this.popupContent.current;
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
    this.Map.clearSelect();
    return false;
  }

  addFeature() {
    this.overlay.setPosition(undefined);
    this.Map.clearSelect();
    this.props.featureAddedHandler(this.selectedFeature);
  }

  render() {
    this.resetMapLayers();
    return (
      <div>
        <div id="map" className={styles.Map}></div>
        <div ref={this.popup} className={styles.OlPopup}>
          <div className={styles.OlPopupButtonsDiv}>
            <Button
              btnType="Danger"
              className={[styles.PopupButton, styles.ClosePopupButton].join(
                " "
              )}
              clicked={() => this.closePopup()}
            >
              Annuleer
            </Button>
            <Button
              btnType="Success"
              className={[styles.PopupButton, styles.AddPopupButton].join(" ")}
              clicked={() => this.addFeature()}
            >
              Voeg Toe
            </Button>
          </div>
          <div ref={this.popupContent}></div>
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

export default connect(mapStateToProps)(Viewer);
