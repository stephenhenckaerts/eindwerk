import React, { Component } from "react";
import { connect } from "react-redux";

import Map from "../Map/Map";
import "ol/ol.css";
import MapInfo from "./MapInfo/MapInfo";
import styles from "./CompareViewer.module.scss";
import MapEOService from "../MapEOService/MapEOService";

class CompareViewer extends Component {
  state = {
    mapInfos: [null, null, null, null],
  };

  constructor(props) {
    super(props);

    this.Maps = [new Map(), new Map(), new Map(), new Map()];

    for (let i = 0; i < this.Maps.length; i++) {
      this.Maps[i].createNewMap();
      this.Maps[i].index = i;
      this.Maps[i].topLayer = "normal";
    }

    this.mapEOService = MapEOService;
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

  updateTopLayer(map) {
    if (this.props.topLayers[map.index] !== map.topLayer) {
      map.topLayer = this.props.topLayers[map.index];
      map.removeTopLayer();
      if (map.topLayer === "bodemkaart") {
        const url = process.env.REACT_APP_GEOSERVER_BODEMKAART_API;
        map.addTopLayer(url);
        setTimeout(() => {
          this.updateMapInfo(map.index, map.topLayer, map.getFeatureStyles());
        }, 100);
      } else if (map.topLayer.item && map.topLayer.item === "MapEO") {
        //const url = process.env.REACT_APP_GEOSERVER_MAPEO_API;
        const url = "/geoserver/wms";
        console.log(map.topLayer);
        console.log(MapEOService.getCookies().cookies.GeoserverHash);
        map.addMapEOLayer(MapEOService.getCookies().cookies.GeoserverHash, url);
      } else if (map.topLayer === "satteliet") {
        map.addSentinellLayer(process.env.REACT_APP_GEOSERVER_SENTINEL_API);
      } else if (map.topLayer === "normal") {
        this.updateMapInfo(map.index, map.topLayer);
      }
    }
  }

  updateMapInfo(index, type, colors) {
    let newLayers = this.state.mapInfos.slice();
    if (type === "normal") {
      newLayers[index] = null;
    } else {
      newLayers[index] = <MapInfo type={type} colors={colors} />;
    }
    this.setState({ mapInfos: newLayers });
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
    this.updateTopLayer(map);
  }

  exportMap() {
    this.Maps[0].exportMap();
  }

  render() {
    //First let the DIV elements be created
    setTimeout(() => {
      this.Maps.forEach((map) => {
        this.resetMapLayers(map);
      });
    }, 100);
    if (this.props.export) {
      this.exportMap();
    }
    return (
      <div className={styles.MapsDiv}>
        <div className={styles.Map} id="map1">
          <div className={styles.Square}>{this.state.mapInfos[0]}</div>
        </div>
        <div className={styles.Map} id="map2">
          <div className={styles.Square}>{this.state.mapInfos[1]}</div>
        </div>
        <div
          className={[
            styles.Map,
            this.props.amountOfPlots < 3 ? styles.invisible : null,
          ].join(" ")}
          id="map3"
        >
          <div className={styles.Square}>{this.state.mapInfos[2]}</div>
        </div>
        <div
          className={[
            styles.Map,
            this.props.amountOfPlots < 4 ? styles.invisible : null,
          ].join(" ")}
          id="map4"
        >
          <div className={styles.Square}>{this.state.mapInfos[3]}</div>
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
