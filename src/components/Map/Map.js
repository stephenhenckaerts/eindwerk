import Map from "ol/Map";
import TileWMS from "ol/source/TileWMS";
import TileLayer from "ol/layer/Tile";
import View from "ol/View";
import OSM from "ol/source/OSM";
import BingMaps from "ol/source/BingMaps";
import VectorSource from "ol/source/Vector";
import { bbox as bboxStrategy } from "ol/loadingstrategy";
import GeoJSON from "ol/format/GeoJSON";
import { Vector, Group } from "ol/layer";

class OlMap {
  constructor() {
    this.createNewMap();
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
        zoom: 14
      })
    });
  }

  removeAllLayers() {
    this.map.setLayerGroup(new Group());
  }

  setBackgroundTileLayer(type) {
    var raster = null;
    switch (type) {
      case "OPENSTREETMAP": {
        raster = new TileLayer({
          source: new OSM({})
        });
        break;
      }
      case "BING MAPS": {
        raster = new TileLayer({
          source: new BingMaps({
            imagerySet: "Aerial",
            key:
              "AsVf4lj-tiANM5N4_P56DC_oQQM9fjb0lMosBxFtgovzGEgcMnQuqYpeKpX-1KL2"
          })
        });
        break;
      }
      default: {
        raster = new TileLayer({
          source: new OSM({})
        });
        break;
      }
    }
    this.map.addLayer(raster);
  }

  togglePlotBoundriesLayers(state) {
    var vectorSource = null;
    if (state) {
      vectorSource = new VectorSource({
        format: new GeoJSON(),
        minScale: 15000000,
        loader: function(extent, resolution, projection) {
          /*
          var url =
            "http://localhost:3030/map/https://geoservices.landbouwvlaanderen.be/PUBLIC/wfs?service=WFS&request=GetFeature&version=1.1.0&typename=PUBLIC:LBGEBRPERC2019&srsname=EPSG:3857&outputFormat=application/json&count=1000&bbox=" +
            extent.join(",") +
            ",EPSG:3857";
          */ var url =
            "http://localhost:3030/map/http://localhost:8080/geoserver/lbgbrprc18/wfs?service=WFS&request=GetFeature&version=1.1.0&typename=PUBLIC:Lbgbrprc18&srsname=EPSG:3857&outputFormat=application/json&count=1000&bbox=" +
            extent.join(",") +
            ",EPSG:3857";
          // */
          var xhr = new XMLHttpRequest();
          xhr.open("GET", url);
          var onError = function() {
            vectorSource.removeLoadedExtent(extent);
          };
          xhr.onerror = onError;
          xhr.onload = function() {
            if (xhr.status === 200) {
              var features = vectorSource
                .getFormat()
                .readFeatures(xhr.responseText);
              features.forEach(function(feature) {
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
        strategy: bboxStrategy
      });
      var vector = new Vector({
        minZoom: 13,
        source: vectorSource
      });
      this.map.addLayer(vector);
    }
  }

  addTileLayer(url) {
    const wmsLayer = new TileLayer({
      source: new TileWMS({
        url,
        params: {
          TILED: true
        },
        crossOrigin: "Anonymous"
      })
    });
    this.map.addLayer(wmsLayer);
  }
}

export default new OlMap();
