import Map from "ol/Map";
import TileWMS from "ol/source/TileWMS";
import TileLayer from "ol/layer/Tile";
import View from "ol/View";
import OSM from "ol/source/OSM";

class OlMap {
  constructor() {
    this.map = this.createMap();
  }

  createMap() {
    var raster = new TileLayer({
      source: new OSM({})
    });
    return new Map({
      target: null,
      layers: [raster],
      view: new View({
        center: [594668.0262129545, 6602083.305674396],
        maxZoom: 19,
        zoom: 14
      })
    });
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
