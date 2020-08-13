import React, { Component } from "react";
import { connect } from "react-redux";

import Map from "../Map/Map";
import "ol/ol.css";
import MapInfo from "./MapInfo/MapInfo";
import styles from "./CompareViewer.module.scss";
import MapEOService from "../MapEOService/MapEOService";
import MapDatePicker from "./MapDatePicker/MapDatePicker";
import GradientInfo from "./GradientInfo/GradientInfo";
import Aux from "../../hoc/Aux/Aux";

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
    let layer = null;
    let topLayerChanged = false;
    let slideLayerChanged = false;
    if (this.props.topLayers[map.index] !== map.topLayer) {
      topLayerChanged = true;
      map.topLayer = this.props.topLayers[map.index];
      layer = map.topLayer;
    } else if (map.index === 0) {
      if (this.props.slideView) {
        if (this.props.topLayers[1] !== map.slideLayer) {
          slideLayerChanged = true;
          map.slideLayer = this.props.topLayers[1];
          layer = map.slideLayer;
        }
      } else {
        map.removeTopLayer(true);
        map.slideLayer = "normal";
        this.updateMapInfo(true, "normal");
      }
    }
    if (topLayerChanged || slideLayerChanged) {
      map.removeTopLayer(slideLayerChanged);
      if (layer === "bodemkaart") {
        const url = process.env.REACT_APP_GEOSERVER_BODEMKAART_API;
        map.addTopLayer(url, slideLayerChanged);
        setTimeout(() => {
          this.updateMapInfo(
            slideLayerChanged,
            slideLayerChanged ? 0 : map.index,
            layer,
            map.getFeatureStyles()
          );
        }, 100);
      } else if (layer.item && layer.item === "MapEO") {
        this.setMapEOMap(map, slideLayerChanged);
        this.updateMapInfo(
          slideLayerChanged,
          slideLayerChanged ? 0 : map.index,
          map,
          layer.name
        );
      } else if (layer.item && layer.item === "Sentinel") {
        map.addSentinellLayer(
          process.env.REACT_APP_GEOSERVER_SENTINEL_API,
          layer.name,
          layer.dates[map.topLayer.selectedDate],
          slideLayerChanged
        );
        this.updateMapInfo(
          slideLayerChanged,
          slideLayerChanged ? 0 : map.index,
          map,
          layer.name
        );
      } else if (layer === "normal") {
        this.updateMapInfo(
          slideLayerChanged,
          slideLayerChanged ? 0 : map.index,
          map.topLayer
        );
      }
    }
    if (this.props.slideView) {
      map.changeOpacitySlideLayer(this.props.slideAmount);
    }
  }

  updateMapInfo(slide, index, type, colors) {
    let newLayer = null;
    let newLayers = null;
    let layer = null;
    if (slide) {
      newLayer = this.state.slideInfo;
      if (type) {
        layer = type.slideLayer;
      }
    } else {
      newLayers = this.state.mapInfos.slice();
      if (type) {
        layer = type.topLayer;
      }
    }
    if (type === "bodemkaart") {
      newLayer = (
        <MapInfo type={type} colors={colors} slide={slide ? "slide" : null} />
      );
    } else if (
      layer &&
      layer.item &&
      (layer.item === "MapEO" || layer.item === "Sentinel")
    ) {
      let getGradientInfoAllowed = this.getGradientInfoAllowed(colors);
      newLayer = (
        <Aux>
          <MapDatePicker
            map={type}
            layer={layer}
            changeDateHandler={(amount, map, i) =>
              this.changeDateHandler(amount, map, i)
            }
            slide={slide ? "slide" : null}
          />
          {getGradientInfoAllowed ? (
            <GradientInfo
              values={{
                min: 0,
                max: 1,
                minColor: "#fde725",
                avgColor: "#5ac864",
                maxColor: "#46085c",
                colorType: colors,
              }}
            />
          ) : null}
        </Aux>
      );
    } else {
      if (slide) {
        newLayer = null;
      } else {
        newLayers[index] = null;
      }
    }
    if (slide) {
      if (newLayer !== this.state.slideInfo) {
        this.setState({ slideInfo: newLayer });
      }
    } else {
      newLayers[index] = newLayer;
      this.setState({ mapInfos: newLayers });
    }
  }

  getGradientInfoAllowed(type) {
    switch (type) {
      case "CGS_S2_RADIOMETRY":
        return false;
      case "CGS_S2_NIR":
        return true;
      case "CGS_S2_NDVI":
        return true;
      case "CGS_S2_LAI":
        return true;
      case "CGS_S2_FCOVER":
        return true;
      case "CGS_S2_FAPAR":
        return true;
      case "CGS_S1_GRD_SIGMA0":
        return true;
      case "CGS_S1_COHERENCE":
        return true;
      default:
        return false;
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
      this.updateMapInfo(true, map);
    } else {
      this.updateMapInfo(false, map.index, map);
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
