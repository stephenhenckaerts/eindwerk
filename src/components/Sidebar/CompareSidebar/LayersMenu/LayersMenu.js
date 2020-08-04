import React, { Component } from "react";

import bodemkaart from "../../../../assets/CompareSidebar/bodemkaart.png";
import dronebeelden from "../../../../assets/CompareSidebar/dronebeelden.png";
import satelliet from "../../../../assets/CompareSidebar/satelliet.svg";
import tractor from "../../../../assets/CompareSidebar/tractor.svg";
import back from "../../../../assets/CompareSidebar/back.svg";
import plantheight from "../../../../assets/CompareSidebar/plantheight.png";
import MapEOService from "../../../MapEOService/MapEOService";

import Snackbar from "../../../UI/Snackbar/Snackbar";

import styles from "./LayersMenu.module.scss";
import Aux from "../../../../hoc/Aux/Aux";

class LayersMenu extends Component {
  state = {
    mapEOLayer: null,
    showMapEOLayer: false,
  };

  constructor(props) {
    super(props);

    this.snackbarRef = React.createRef();

    MapEOService.connectToMapEO(this.mapEOLoadedHandler);

    this.createConvertNames();
  }

  clickHandler = (type) => {
    this.snackbarRef.current.openSnackBar(type + " niet beschikbaar.");
  };

  backButtonHandler = () => {
    this.setState({ showMapEOLayer: false });
  };

  mapEOLoadedHandler = (response) => {
    if (this.props.feature) {
      response.forEach((plot) => {
        //console.log(plot);
        if (plot.name === "Wimmertingen") {
          this.setState({ mapEOLayer: plot });
        }
      });
    }
  };

  bodemScanClickHandler = () => {
    if (this.state.mapEOLayer) {
      this.setState({ showMapEOLayer: true });
    } else {
      this.clickHandler();
    }
  };

  createConvertNames(name) {
    switch (name) {
      case "ortho":
        return "Ortho";
      case "plantheight":
        return "Planthoogte";
      default:
        return name;
    }
  }

  createConvertNameToImage(name) {
    switch (name) {
      case "plantheight":
        return plantheight;
      default:
        return satelliet;
    }
  }

  render() {
    //console.log(this.props.feature);
    let backMenu = null;
    let menu = (
      <Aux>
        <div
          className={styles.Layer}
          onClick={() => this.props.menuItemClicked("bodemkaart")}
        >
          <img src={bodemkaart} alt="Bodemkaart" />
          <p>Bodemkaarten</p>
        </div>
        <div
          className={styles.Layer}
          onClick={() => this.clickHandler("Bodemscan ")}
        >
          <img src={tractor} alt="Bodemscans" />
          <p>Bodemscans</p>
        </div>
        <div className={styles.Layer} onClick={this.bodemScanClickHandler}>
          <img src={dronebeelden} alt="Dronebeelden" />
          <p>Dronebeelden</p>
        </div>
        <div
          className={styles.Layer}
          onClick={() => this.props.menuItemClicked("satteliet")}
        >
          <img src={satelliet} alt="Sattelietbeelden" />
          <p>Sattelietbeelden</p>
        </div>
      </Aux>
    );
    if (this.state.showMapEOLayer) {
      backMenu = (
        <div className={styles.Layer} onClick={this.backButtonHandler}>
          <img src={back} alt="Bodemkaart" />
          <p>Terug</p>
        </div>
      );
      menu = this.state.mapEOLayer.regionInstances[0].layers.map((layer) => (
        <div
          key={layer.imageType}
          className={styles.Layer}
          onClick={() => this.props.menuItemClicked("MapEO", layer)}
        >
          <img
            src={this.createConvertNameToImage(layer.imageType)}
            alt="Sattelietbeelden"
          />
          <p>{this.createConvertNames(layer.imageType)}</p>
        </div>
      ));
    }
    return (
      <div className={styles.Menu}>
        {backMenu}
        {menu}
        <Snackbar ref={this.snackbarRef} btnType="danger" />
      </div>
    );
  }
}

export default LayersMenu;
