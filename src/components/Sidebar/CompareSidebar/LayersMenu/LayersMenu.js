import React, { Component } from "react";

import bodemkaart from "../../../../assets/CompareSidebar/bodemkaart.png";
import dronebeelden from "../../../../assets/CompareSidebar/dronebeelden.png";
import satelliet from "../../../../assets/CompareSidebar/satelliet.svg";
import tractor from "../../../../assets/CompareSidebar/tractor.svg";
import back from "../../../../assets/CompareSidebar/back.svg";
import plantheight from "../../../../assets/CompareSidebar/plantheight.png";
import ndvi from "../../../../assets/CompareSidebar/NDVI.png";
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
        let convertedCoords = this.convertCoordinates(
          plot.geom.coordinates[0][0][0],
          plot.geom.coordinates[0][0][1]
        );
        if (
          this.checkCoordinatesForPlot(
            convertedCoords,
            this.props.feature.coords
          )
        ) {
          this.setState({ mapEOLayer: plot });
        }
      });
    }
  };

  bodemScanClickHandler = () => {
    if (this.state.mapEOLayer) {
      this.setState({ showMapEOLayer: true });
    } else {
      this.clickHandler("Dronebeelden");
    }
  };

  createConvertNames(name) {
    switch (name) {
      case "ortho":
        return "Luchtfoto";
      case "plantheight":
        return "Planthoogte";
      case "ndre":
        return "NDRE";
      case "ndvi":
        return "NDVI";
      default:
        return name;
    }
  }

  createConvertNameToImage(name) {
    switch (name) {
      case "plantheight":
        return plantheight;
      case "ndvi":
        return ndvi;
      case "ndre":
        return ndvi;
      default:
        return satelliet;
    }
  }

  checkCoordinatesForPlot(mapEOCoords, plotCoords) {
    if (
      (this.differenceBetweenCoordinates(plotCoords[0], mapEOCoords[0]) <
        1000 ||
        this.differenceBetweenCoordinates(plotCoords[2], mapEOCoords[0]) <
          1000) &&
      (this.differenceBetweenCoordinates(plotCoords[1], mapEOCoords[1]) <
        1000 ||
        this.differenceBetweenCoordinates(plotCoords[3], mapEOCoords[1]) < 1000)
    ) {
      return true;
    } else {
      return false;
    }
  }

  convertCoordinates(lon, lat) {
    var x = (lon * 20037508.34) / 180;
    var y = Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) / (Math.PI / 180);
    y = (y * 20037508.34) / 180;
    return [x, y];
  }

  differenceBetweenCoordinates(num1, num2) {
    if (num1 > num2) {
      return num1 - num2;
    } else {
      return num2 - num1;
    }
  }

  render() {
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
