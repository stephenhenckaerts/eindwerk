import React, { Component } from "react";
import { connect } from "react-redux";

import Map from "../Map/Map";
import "ol/ol.css";
import styles from "./CompareViewer.module.scss";

class CompareViewer extends Component {
  state = {
    showLayerInfo: [null, null, null, null],
  };

  constructor(props) {
    super(props);

    this.Maps = [new Map(), new Map(), new Map(), new Map()];

    for (let i = 0; i < this.Maps.length; i++) {
      this.Maps[i].createNewMap();
      this.Maps[i].index = i + 1;
    }
  }

  componentDidMount() {
    for (let i = 0; i < this.Maps.length; i++) {
      this.addMapToElement(this.Maps[i], "map" + (i + 1));
    }
  }

  addMapToElement(map, element) {
    map.setBackgroundTileLayer(this.props.type);
    map.map.setTarget(element);
    map.changeControls(false);
  }

  resetMapLayers(map) {
    map.updateSize();
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
    if (this.props.selectedPlotIndex === map.index) {
      if (this.props.topLayers[this.props.selectedPlotIndex - 1] !== "normal") {
        //const vitoURL = "http://sentineldata.vito.be/ows?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&LAYERS=CGS_S2_RADIOMETRY_BROWSE&FORMAT=image/png&TIME=2017-05-19T09:05:30.000Z&SRS=EPSG:4326&WIDTH=1920&HEIGHT=800&BBOX=";
        //const vitoURL = "https://services.terrascope.be/wmts";
        const url =
          "http://localhost:3030/maps/map/http://localhost:8080/geoserver/bodemkaart/wms?tiled=true&service=WFS&request=GetFeature&version=1.1.0&typename=PUBLIC:20170710_bodemkaart_2_0&srsname=EPSG:3857&outputFormat=application/json&count=1000&bbox=";
        map.toggleTopLayer(url);
        setTimeout(() => {
          if (map.getTopLayer && map.topLayer !== "") {
            console.log(map.featureStyles);
          }
        }, 100);
      }
    }
  }

  render() {
    //First let the DIV elements be created
    setTimeout(() => {
      this.Maps.forEach((map) => {
        this.resetMapLayers(map);
      });
    }, 100);
    return (
      <div
        className={[
          styles.MapsDiv,
          this.props.amountOfPlots > 3 ? styles.Wrap : null,
        ].join(" ")}
      >
        <div className={styles.Map} id="map1"></div>
        <div className={styles.Map} id="map2"></div>
        {this.props.amountOfPlots > 2 ? (
          <div className={styles.Map} id="map3"></div>
        ) : (
          <div className={(styles.Map, styles.Disabled)} id="map3"></div>
        )}
        {this.props.amountOfPlots > 3 ? (
          <div className={styles.Map} id="map4"></div>
        ) : (
          <div className={(styles.Map, styles.Disabled)} id="map4"></div>
        )}
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
