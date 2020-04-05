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

  setInteractionForPlotBoundriesLayer(layer, featureSelected) {
    this.select = new Select({
      layers: [layer],
    });
    this.select.on("select", (event) => featureSelected(event, this.select));
    this.map.addInteraction(this.select);
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
        console.log("ahhahahah");
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
