import React, { Component } from "react";
import { connect } from "react-redux";

import Map from "../Map/Map";
import "ol/ol.css";
import MapInfo from "./MapInfo/MapInfo";
import styles from "./CompareViewer.module.scss";
import MapEOService from "../MapEOService/MapEOService";
import MapDatePicker from "./MapDatePicker/MapDatePicker";

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
        this.setMapEOMap(map);
        this.updateMapInfo(map.index, map);
      } else if (map.topLayer === "satteliet") {
        map.addSentinellLayer(process.env.REACT_APP_GEOSERVER_SENTINEL_API);
      } else if (map.topLayer === "normal") {
        this.updateMapInfo(map.index, map.topLayer);
      }
    }
  }

  updateMapInfo(index, type, colors) {
    let newLayers = this.state.mapInfos.slice();
    if (type === "bodemkaart") {
      newLayers[index] = <MapInfo type={type} colors={colors} />;
    } else if (
      type.topLayer &&
      type.topLayer.item &&
      type.topLayer.item === "MapEO"
    ) {
      newLayers[index] = (
        <MapDatePicker
          map={type}
          changeDateHandler={(amount, map) =>
            this.changeDateHandler(amount, map)
          }
        />
      );
    } else {
      newLayers[index] = null;
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

  setMapEOMap(map) {
    const url = map.topLayer.layerinfo.layerData[0].url;
    const title = map.topLayer.layerinfo.layerData[0].title;
    const time =
      map.topLayer.layerinfo.layerTimes[
        map.topLayer.selectedDate
      ].date.substring(
        0,
        map.topLayer.layerinfo.layerTimes[map.topLayer.selectedDate].date
          .length - 1
      ) + ".000Z";
    map.addMapEOLayer(
      MapEOService.getCookies().cookies.GeoserverHash,
      url,
      title,
      time
    );
  }

  changeDateHandler = (amount, map) => {
    map.topLayer.selectedDate += amount;
    if (
      map.topLayer.selectedDate >
      map.topLayer.layerinfo.layerTimes.length - 1
    )
      map.topLayer.selectedDate = 0;
    if (map.topLayer.selectedDate < 0)
      map.topLayer.selectedDate = map.topLayer.layerinfo.layerTimes.length - 1;
    map.removeTopLayer();
    this.setMapEOMap(map);
    this.updateMapInfo(map.index, map);
  };

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
        <div
          className={[
            styles.Map,
            this.props.amountOfPlots < 2 ? styles.invisible : null,
          ].join(" ")}
          id="map2"
        >
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
