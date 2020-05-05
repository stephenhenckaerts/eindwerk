import Map from "ol/Map";
import TileWMS from "ol/source/TileWMS";
import TileLayer from "ol/layer/Tile";
import View from "ol/View";
import OSM from "ol/source/OSM";
import BingMaps from "ol/source/BingMaps";
import VectorSource from "ol/source/Vector";
import { bbox as bboxStrategy } from "ol/loadingstrategy";
import GeoJSON from "ol/format/GeoJSON";
import { Vector, Group, Tile } from "ol/layer";
import Select from "ol/interaction/Select";
import { Feature } from "ol";
import { Polygon } from "ol/geom";
import { Fill, Stroke, Style } from "ol/style";

class OlMap {
  constructor() {
    this.createNewMap();
    this.createBackgroundLayerGroups();
  }

  createNewMap() {
    this.map = this.createMap();
  }

  createMap() {
    return new Map({
      target: null,
      layers: [],
      view: new View({
        center: [594668.0262129545, 6602083.305674396],
        maxZoom: 19,
        zoom: 14,
      }),
    });
  }

  createBackgroundLayerGroups() {
    this.layersOSM = new Group({
      layers: [
        new Tile({
          source: new OSM(),
        }),
        new Tile({
          source: new BingMaps({
            imagerySet: "Aerial",
            key: process.env.REACT_APP_BING_MAPS,
          }),
          visible: false,
        }),
      ],
    });
  }

  clearAllBoundriesLayers() {
    this.map.getLayers().forEach((layer) => {
      if (
        layer.get("name") === "plotBoundriesLayer" ||
        layer.get("name") === "plotUserBoundriesLayer" ||
        layer.get("name") === "plotShapefileLayer"
      ) {
        layer.getSource().clear();
        this.map.removeLayer(layer);
      }
    });
    if (this.select) {
      this.select.getFeatures().clear();
    }
  }

  addBoundriesLayer(featureSelected) {
    this.clearAllBoundriesLayers();
    let vectorSource = new VectorSource({
      format: new GeoJSON(),
      minScale: 15000000,
      loader: function (extent, resolution, projection) {
        /*
          Link for the DLV
          let url =
            process.env.REACT_APP_DLV_API +
            extent.join(",") +
            ",EPSG:3857";
          */ let url =
          process.env.REACT_APP_GEOSERVER_API + extent.join(",") + ",EPSG:3857";
        // */
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        let onError = function () {
          vectorSource.removeLoadedExtent(extent);
        };
        xhr.onerror = onError;
        xhr.onload = function () {
          if (xhr.status === 200) {
            let features = vectorSource
              .getFormat()
              .readFeatures(xhr.responseText);
            features.forEach(function (feature) {
              //ID for the DLV
              //feature.setId(feature.get("OBJ_ID"));
              feature.setId(feature.get("OIDN"));
            });
            vectorSource.addFeatures(features);
          } else {
            onError();
          }
        };
        xhr.send();
      },
      strategy: bboxStrategy,
    });
    let vector = new Vector({
      //minZoom: 13,
      source: vectorSource,
    });
    this.setInteractionForPlotBoundriesLayer(vector, featureSelected);
    vector.set("name", "plotBoundriesLayer");
    this.map.addLayer(vector);
  }

  addUsersPlotBoundriesLayer(featureSelected, featureHovered, newFeatures) {
    this.clearAllBoundriesLayers();
    if (newFeatures.length > 0) {
      let vectorSource = new VectorSource({
        format: new GeoJSON(),
        minScale: 15000000,
        strategy: bboxStrategy,
      });
      newFeatures.forEach((newFeature) => {
        let feature = new Feature({
          geometry: new Polygon([newFeature.geometry]),
        });
        feature.setId(newFeature.plotId);
        vectorSource.addFeature(feature);
      });
      let vector = new Vector({
        //minZoom: 13,
        source: vectorSource,
      });
      if (featureHovered !== null) {
        this.setInteractionForPlotBoundriesLayer(vector, featureSelected);
        this.setHoverInteractionForUserPlotBoundries(vector, featureHovered);
      }
      vector.set("name", "plotUserBoundriesLayer");
      this.plotsExtent = vectorSource.getExtent();
      this.map.addLayer(vector);
    }
  }

  setExtentOfMapByUserFeaters(extent) {
    if (extent === undefined) {
      if (this.plotsExtent !== undefined && this.plotsExtent[0] !== Infinity) {
        this.map.getView().fit(this.plotsExtent);
      }
    } else {
      this.map.getView().fit(extent);
    }
  }

  setInteractionForPlotBoundriesLayer(layer, featureSelected) {
    this.select = new Select({
      layers: [layer],
    });
    this.select.on("select", (event) => featureSelected(event, this.select));
    this.map.addInteraction(this.select);
  }

  setHoverInteractionForUserPlotBoundries(layer, featureHovered) {
    this.hoveredFeature = null;
    let defaultStyle = new Style({
      stroke: new Stroke({
        width: 2,
        color: "#9c1616",
      }),
      fill: new Fill({ color: "#c04e4e" }),
    });
    let hoveredStyle = new Style({
      stroke: new Stroke({
        width: 2,
        color: "#9c1616",
      }),
      fill: new Fill({ color: "#9c1616" }),
    });
    this.map.on("pointermove", (e) => {
      layer
        .getSource()
        .getFeatures()
        .forEach((feature) => {
          feature.setStyle(defaultStyle);
        });
      let newFeature = null;
      this.map.forEachFeatureAtPixel(e.pixel, (f) => {
        newFeature = f;

        newFeature.setStyle(hoveredStyle);
        return true;
      });

      if (newFeature) {
        if (
          this.hoveredFeature === null ||
          this.hoveredFeature !== newFeature
        ) {
          this.hoveredFeature = newFeature;
          featureHovered(this.hoveredFeature.id_);
        }
      } else {
        if (this.hoveredFeature !== null) {
          this.hoveredFeature = null;
          featureHovered(null);
        }
      }
    });
  }

  hoveredSideBarFeatureHandler(hoveredFeatureId) {
    let defaultStyle = new Style({
      stroke: new Stroke({
        width: 2,
        color: "#9c1616",
      }),
      fill: new Fill({ color: "#c04e4e" }),
    });
    let hoveredStyle = new Style({
      stroke: new Stroke({
        width: 2,
        color: "#9c1616",
      }),
      fill: new Fill({ color: "#9c1616" }),
    });
    this.map.getLayers().forEach((layer) => {
      if (layer.get("name") === "plotUserBoundriesLayer") {
        layer
          .getSource()
          .getFeatures()
          .forEach((feature) => {
            if (feature.id_ === hoveredFeatureId) {
              feature.setStyle(hoveredStyle);
            } else {
              feature.setStyle(defaultStyle);
            }
          });
      }
    });
  }

  clearSelect() {
    this.select.getFeatures().clear();
  }

  setBackgroundTileLayer(type) {
    if (this.backgroundTileType === null) {
      this.backgroundTileType = "OPENSTREETMAP";
    }

    if (this.map.getLayers().getArray().length === 0) {
      this.map.setLayerGroup(this.layersOSM);
    } else {
      if (this.backgroundTileType !== type) {
        this.backgroundTileType = type;
        this.map.getLayers().getArray()[0].setVisible(false);
        this.map.getLayers().getArray()[1].setVisible(false);
        if (type === "OPENSTREETMAP") {
          this.map.getLayers().getArray()[0].setVisible(true);
        } else if (type === "BING MAPS") {
          this.map.getLayers().getArray()[1].setVisible(true);
        }
      }
    }
  }

  togglePlotBoundriesLayers(state) {
    if (this.plotBoundriesState === null) {
      this.plotBoundriesState = true;
    }
    if (this.plotBoundriesState !== state) {
      this.plotBoundriesState = state;
      this.map.getLayers().forEach((layer) => {
        if (layer.get("name") === "plotBoundriesLayer") {
          layer.setVisible(state);
        }
        if (layer.get("name") === "plotUserBoundriesLayer") {
          layer.setVisible(state);
        }
      });
    }
  }

  setShapeFile(shapefile) {
    this.clearAllBoundriesLayers();
    let vectorSource = new VectorSource({
      format: new GeoJSON(),
      loader: function (extent, resolution, projection) {
        var url = "http://localhost:3030/maps/json/";
        //var url = "http://localhost:3030/map/http://localhost:8080/geoserver/database/wfs?service=WFS&request=GetFeature&version=1.1.0&typename=PUBLIC:wimmertingen&srsname=EPSG:3857&outputFormat=application/json&count=1000,EPSG:3857";
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        var onError = function () {
          vectorSource.removeLoadedExtent(extent);
        };
        xhr.onerror = onError;
        xhr.onload = function () {
          if (xhr.status === 200) {
            var features = vectorSource
              .getFormat()
              .readFeatures(xhr.responseText);
            features.forEach(function (feature) {
              feature.setId(feature.get("OBJ_ID"));
              feature.setStyle(
                new Style({
                  fill: new Fill({
                    color: "rgb(252, 51, 20,0.1)",
                  }),
                  stroke: new Stroke({
                    color: "#fc3314",
                  }),
                })
              );
            });
            vectorSource.addFeatures(features);
          } else {
            onError();
          }
        };
        xhr.send();
      },
      strategy: bboxStrategy,
    });
    let vector = new Vector({
      //minZoom: 13,
      source: vectorSource,
    });
    vector.set("name", "plotShapefileLayer");
    this.map.addLayer(vector);
  }

  changeControls(state) {
    //Removes the ability to interract with the map
    this.map.getInteractions().forEach(function (interaction) {
      interaction.setActive(state);
    }, this);

    //Removes all the buttons from the map
    this.map.getControls().forEach((control) => {
      this.map.removeControl(control);
    });
  }

  addTileLayer(url) {
    const wmsLayer = new TileLayer({
      source: new TileWMS({
        url,
        params: {
          TILED: true,
        },
        crossOrigin: "Anonymous",
      }),
    });
    this.map.addLayer(wmsLayer);
  }
}

export default OlMap;
