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
import { pointerMove } from "ol/events/condition";

class OlMap {
  constructor() {
    this.createNewMap();
    this.createBackgroundLayerGroups();
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
            key:
              "AsVf4lj-tiANM5N4_P56DC_oQQM9fjb0lMosBxFtgovzGEgcMnQuqYpeKpX-1KL2",
          }),
          visible: false,
        }),
      ],
    });
    this.layersBM = new Group({
      layers: [
        new Tile({
          source: new BingMaps({
            imagerySet: "Aerial",
            key:
              "AsVf4lj-tiANM5N4_P56DC_oQQM9fjb0lMosBxFtgovzGEgcMnQuqYpeKpX-1KL2",
          }),
        }),
      ],
    });
  }

  addBoundriesLayer(featureSelected) {
    let boundriesLayer = null;
    this.map.getLayers().forEach((layer) => {
      if (layer.get("name") === "plotBoundriesLayer") {
        boundriesLayer = layer;
      }
      if (layer.get("name") === "plotUserBoundriesLayer") {
        this.map.removeLayer(layer);
      }
    });
    if (boundriesLayer == null) {
      let vectorSource = new VectorSource({
        format: new GeoJSON(),
        minScale: 15000000,
        loader: function (extent, resolution, projection) {
          /*
          Link for the DLV
          var url =
            "http://localhost:3030/maps/map/https://geoservices.landbouwvlaanderen.be/PUBLIC/wfs?service=WFS&request=GetFeature&version=1.1.0&typename=PUBLIC:LBGEBRPERC2019&srsname=EPSG:3857&outputFormat=application/json&count=1000&bbox=" +
            extent.join(",") +
            ",EPSG:3857";
          */ var url =
            "http://localhost:3030/maps/map/http://localhost:8080/geoserver/lbgbrprc18/wfs?service=WFS&request=GetFeature&version=1.1.0&typename=PUBLIC:Lbgbrprc18&srsname=EPSG:3857&outputFormat=application/json&count=1000&bbox=" +
            extent.join(",") +
            ",EPSG:3857";
          // */
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
      var vector = new Vector({
        //minZoom: 13,
        source: vectorSource,
      });
      this.setInteractionForPlotBoundriesLayer(vector, featureSelected);
      vector.set("name", "plotBoundriesLayer");
      this.map.addLayer(vector);
    } else {
      this.setInteractionForPlotBoundriesLayer(boundriesLayer, featureSelected);
    }
  }

  addUsersPlotBoundriesLayer(featureSelected, featureHovered, newFeatures) {
    let boundriesLayer = null;
    this.map.getLayers().forEach((layer) => {
      if (layer.get("name") === "plotUserBoundriesLayer") {
        this.map.removeLayer(layer);
      }
      if (layer.get("name") === "plotBoundriesLayer") {
        this.map.removeLayer(layer);
      }
    });
    if (boundriesLayer == null && newFeatures.length > 0) {
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
        var selectedStyle = new Style({
          stroke: new Stroke({
            width: 2,
            color: "#9c1616",
          }),
          fill: new Fill({ color: "#c04e4e" }),
        });
        feature.setStyle(selectedStyle);
        vectorSource.addFeature(feature);
      });
      var vector = new Vector({
        //minZoom: 13,
        source: vectorSource,
      });
      this.setInteractionForPlotBoundriesLayer(vector, featureSelected);
      this.setHoverInteractionForUserPlotBoundries(vector, featureHovered);
      vector.set("name", "plotUserBoundriesLayer");
      this.plotsExtent = vectorSource.getExtent();
      this.map.addLayer(vector);
    } else {
      this.setInteractionForPlotBoundriesLayer(boundriesLayer, featureSelected);
      this.setHoverInteractionForUserPlotBoundries(
        boundriesLayer,
        featureHovered
      );
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
    var defaultStyle = new Style({
      stroke: new Stroke({
        width: 2,
        color: "#9c1616",
      }),
      fill: new Fill({ color: "#c04e4e" }),
    });
    var hoveredStyle = new Style({
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
    var defaultStyle = new Style({
      stroke: new Stroke({
        width: 2,
        color: "#9c1616",
      }),
      fill: new Fill({ color: "#c04e4e" }),
    });
    var hoveredStyle = new Style({
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

  removeAllLayers() {
    this.map.getLayers().forEach((layer) => {
      this.map.removeLayer(layer);
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

export default new OlMap();
