import Map from "ol/Map";
import TileWMS from "ol/source/TileWMS";
import TileLayer from "ol/layer/Tile";
import View from "ol/View";
import OSM from "ol/source/OSM";
import BingMaps from "ol/source/BingMaps";

class OlMap {
  constructor() {
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
    }
    this.map.setLayerGroup(raster);
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
