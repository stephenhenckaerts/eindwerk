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
    slideInfo: null,
  };

  constructor(props) {
    super(props);

    this.Maps = [new Map(), new Map(), new Map(), new Map()];

    for (let i = 0; i < this.Maps.length; i++) {
      this.Maps[i].createNewMap();
      this.Maps[i].index = i;
      this.Maps[i].topLayer = "normal";
    }
    this.Maps[0].slideLayer = "normal";

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
      } else if (map.topLayer.item && map.topLayer.item === "Sentinel") {
        map.addSentinellLayer(
          process.env.REACT_APP_GEOSERVER_SENTINEL_API,
          map.topLayer.name,
          map.topLayer.dates[map.topLayer.selectedDate]
        );
        this.updateMapInfo(map.index, map);
      } else if (map.topLayer === "normal") {
        this.updateMapInfo(map.index, map.topLayer);
      }
    }
    if (map.index === 0) {
      if (this.props.slideView) {
        if (this.props.topLayers[1] !== map.slideLayer) {
          map.slideLayer = this.props.topLayers[1];
          map.removeTopLayer(true);
          if (map.slideLayer === "bodemkaart") {
            const url = process.env.REACT_APP_GEOSERVER_BODEMKAART_API;
            setTimeout(() => {
              this.updateMapInfoSlide(map.slideLayer, map.getFeatureStyles());
            }, 100);
            map.addTopLayer(url, true);
          } else if (map.slideLayer.item && map.slideLayer.item === "MapEO") {
            this.setMapEOMap(map, true);
            this.updateMapInfoSlide(map);
          } else if (
            map.slideLayer.item &&
            map.slideLayer.item === "Sentinel"
          ) {
            map.addSentinellLayer(
              process.env.REACT_APP_GEOSERVER_SENTINEL_API,
              map.slideLayer.name,
              map.slideLayer.dates[map.topLayer.selectedDate],
              true
            );
            this.updateMapInfoSlide(map);
          } else if (map.slideLayer === "normal") {
            this.updateMapInfoSlide(map.index, map.topLayer);
          }
        }
        map.changeOpacitySlideLayer(this.props.slideAmount);
      } else {
        map.removeTopLayer(true);
        map.slideLayer = "normal";
        this.updateMapInfoSlide("normal");
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
      (type.topLayer.item === "MapEO" || type.topLayer.item === "Sentinel")
    ) {
      newLayers[index] = (
        <MapDatePicker
          map={type}
          layer={type.topLayer}
          changeDateHandler={(amount, map, i) =>
            this.changeDateHandler(amount, map, i)
          }
        />
      );
    } else {
      newLayers[index] = null;
    }
    this.setState({ mapInfos: newLayers });
  }

  updateMapInfoSlide(type, colors) {
    let newLayer = this.state.slideInfo;
    if (type === "bodemkaart") {
      newLayer = <MapInfo type={type} colors={colors} slide="slide" />;
    } else if (
      type.slideLayer &&
      type.slideLayer.item &&
      (type.slideLayer.item === "MapEO" || type.slideLayer.item === "Sentinel")
    ) {
      newLayer = (
        <MapDatePicker
          map={type}
          layer={type.slideLayer}
          changeDateHandler={(amount, map, i, slide) =>
            this.changeDateHandler(amount, map, i, slide)
          }
          slide="slide"
        />
      );
    } else {
      newLayer = null;
    }
    if (newLayer !== this.state.slideInfo) {
      this.setState({ slideInfo: newLayer });
    }
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

  setMapEOMap(map, isSlideLayer) {
    let layer = null;
    if (isSlideLayer) {
      layer = map.slideLayer;
    } else {
      layer = map.topLayer;
    }
    let url = layer.layerinfo.layerData[0].url;
    let title = layer.layerinfo.layerData[0].title;
    let time =
      layer.layerinfo.layerTimes[layer.selectedDate].date.substring(
        0,
        layer.layerinfo.layerTimes[layer.selectedDate].date.length - 1
      ) + ".000Z";
    map.addMapEOLayer(
      MapEOService.getCookies().cookies.GeoserverHash,
      url,
      title,
      time,
      isSlideLayer
    );
  }

  changeDateHandler = (amount, map, indexed, slide) => {
    let layer = null;
    if (slide === "slide") {
      layer = map.slideLayer;
    } else {
      layer = map.topLayer;
    }
    let dates = null;
    if (layer.item === "MapEO") {
      dates = layer.layerinfo.layerTimes;
    } else if (layer.item === "Sentinel") {
      dates = layer.dates;
    }
    if (indexed === undefined) {
      layer.selectedDate += amount;
      if (layer.selectedDate > dates.length - 1) layer.selectedDate = 0;
      if (layer.selectedDate < 0) layer.selectedDate = dates.length - 1;
    } else {
      if (dates.length > indexed && indexed > 0) {
        layer.selectedDate = indexed;
      }
    }
    map.removeTopLayer(slide ? true : undefined);
    if (layer.item === "MapEO") {
      this.setMapEOMap(map, slide ? true : undefined);
    } else if (layer.item === "Sentinel") {
      map.addSentinellLayer(
        process.env.REACT_APP_GEOSERVER_SENTINEL_API,
        layer.name,
        layer.dates[layer.selectedDate],
        slide ? true : undefined
      );
    }
    if (slide === "slide") {
      this.updateMapInfoSlide(map);
    } else {
      this.updateMapInfo(map.index, map);
    }
  };

  render() {
    //First let the DIV elements be created
    setTimeout(() => {
      this.Maps.forEach((map) => {
        this.resetMapLayers(map);
      });
    }, 100);
    return (
      <div className={[styles.MapsDiv, styles.MapGridView].join(" ")}>
        <div className={styles.Map} id="map1">
          <div className={this.props.slideView ? styles.Slide : styles.Square}>
            {this.state.mapInfos[0]}
          </div>
        </div>
        <div
          className={[
            styles.Map,
            this.props.amountOfPlots < 2 || this.props.slideView
              ? styles.invisible
              : null,
          ].join(" ")}
          id="map2"
        >
          <div className={styles.Square}>{this.state.mapInfos[1]}</div>
        </div>
        <div
          className={[
            styles.Map,
            this.props.amountOfPlots < 3 || this.props.slideView
              ? styles.invisible
              : null,
          ].join(" ")}
          id="map3"
        >
          <div className={styles.Square}>{this.state.mapInfos[2]}</div>
        </div>
        <div
          className={[
            styles.Map,
            this.props.amountOfPlots < 4 || this.props.slideView
              ? styles.invisible
              : null,
          ].join(" ")}
          id="map4"
        >
          <div className={styles.Square}>{this.state.mapInfos[3]}</div>
        </div>
        <div className={styles.SlideInfo}>{this.state.slideInfo}</div>
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
