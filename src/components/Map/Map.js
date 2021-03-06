import Map from "ol/Map";
import TileLayer from "ol/layer/Tile";
import WMTS from "ol/source/WMTS";
import View from "ol/View";
import OSM from "ol/source/OSM";
import BingMaps from "ol/source/BingMaps";
import VectorSource from "ol/source/Vector";
import { bbox as bboxStrategy } from "ol/loadingstrategy";
import GeoJSON from "ol/format/GeoJSON";
import { Vector, Group, Tile } from "ol/layer";
import Select from "ol/interaction/Select";
import Modify from "ol/interaction/Modify";
import { Feature } from "ol";
import { Polygon } from "ol/geom";
import { Fill, Stroke, Style, Icon } from "ol/style";
import PinIcon from "../../assets/Map/pin.png";
import HoveredPinIcon from "../../assets/Map/hoveredpin.png";
import TileWMS from "ol/source/TileWMS";
import * as extent from "ol/extent";

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

  getMap() {
    return this.map;
  }

  createBackgroundLayerGroups() {
    let osmLayer = new Tile({
      source: new OSM(),
    });
    osmLayer.set("name", "osmBackgroundLayer");
    let bingLayer = new Tile({
      source: new BingMaps({
        imagerySet: "Aerial",
        key: process.env.REACT_APP_BING_MAPS,
      }),
      visible: false,
    });
    bingLayer.set("name", "bingBackgroundLayer");
    this.layersOSM = new Group({
      layers: [osmLayer, bingLayer],
    });
  }

  clearAllBoundriesLayers() {
    this.map
      .getLayers()
      .getArray()
      .slice()
      .forEach((layer) => {
        if (layer !== undefined) {
          if (layer.get("name") !== undefined) {
            if (
              layer.get("name") === "plotBoundriesLayer" ||
              layer.get("name") === "plotUserBoundriesLayer" ||
              layer.get("name") === "plotUserBoundriesLayerIcons" ||
              layer.get("name").includes("plotShapefileLayer")
            ) {
              layer.getSource().clear();
              this.map.removeLayer(layer);
            }
          }
        } else {
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

  addUsersPlotBoundriesLayer(
    featureSelected,
    featureHovered,
    newFeatures,
    userPlotViewer
  ) {
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
      let style = new Style({
        stroke: new Stroke({
          width: 5,
          color: "#9c1616",
        }),
      });
      if (userPlotViewer) {
        style = new Style({
          stroke: new Stroke({
            width: 2,
            color: "#9c1616",
          }),
          fill: new Fill({ color: "#c04e4e" }),
        });
      }
      let vector = new Vector({
        minZoom: 13,
        source: vectorSource,
        style: style,
      });
      vector.setZIndex(10);
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

  setExtendOpMapByLocation(input) {
    let ext = extent.boundingExtent([
      this.convertCoordinates(input.northeast.lng, input.northeast.lat),
      this.convertCoordinates(input.southwest.lng, input.southwest.lat),
    ]);
    this.map.getView().fit(ext, this.map.getSize());
  }

  setExtendOpMapByGeoLocation(input) {
    let ext = extent.boundingExtent([
      this.convertCoordinates(input.lng, input.lat),
    ]);
    this.map.getView().fit(ext, this.map.getSize());
  }

  convertCoordinates(lon, lat) {
    var x = (lon * 20037508.34) / 180;
    var y = Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) / (Math.PI / 180);
    y = (y * 20037508.34) / 180;
    return [x, y];
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
        color: "#0c51a7",
      }),
      fill: new Fill({ color: "#1273EB" }),
    });
    this.map.on("pointermove", (e) => {
      layer
        .getSource()
        .getFeatures()
        .forEach((feature) => {
          if (this.map.getView().getZoom() > 13) {
            feature.setStyle(defaultStyle);
          } else {
            let iconStyle = new Style({
              geometry: function (feature) {
                let geometry = feature.getGeometry();
                let geometryType = geometry.getType();
                return geometryType === "Polygon"
                  ? geometry.getInteriorPoint()
                  : geometryType === "MultiPolygon"
                  ? geometry.getInteriorPoints()
                  : geometry;
              },
              image: new Icon({
                anchor: [0.5, 46],
                anchorXUnits: "fraction",
                anchorYUnits: "pixels",
                src: PinIcon,
                scale: 0.12,
              }),
            });
            feature.setStyle(iconStyle);
          }
        });
      let newFeature = null;
      this.map.forEachFeatureAtPixel(e.pixel, (f) => {
        newFeature = f;
        if (this.map.getView().getZoom() > 13) {
          newFeature.setStyle(hoveredStyle);
        } else {
          let iconStyle = new Style({
            geometry: function (newFeature) {
              let geometry = newFeature.getGeometry();
              let geometryType = geometry.getType();
              return geometryType === "Polygon"
                ? geometry.getInteriorPoint()
                : geometryType === "MultiPolygon"
                ? geometry.getInteriorPoints()
                : geometry;
            },
            image: new Icon({
              anchor: [0.5, 46],
              anchorXUnits: "fraction",
              anchorYUnits: "pixels",
              src: HoveredPinIcon,
              scale: 0.12,
            }),
          });
          newFeature.setStyle(iconStyle);
        }
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
        color: "#0c51a7",
      }),
      fill: new Fill({ color: "#1273EB" }),
    });
    if (this.map.getView().getZoom() < 13) {
      defaultStyle = new Style({
        geometry: function (feature) {
          let geometry = feature.getGeometry();
          let geometryType = geometry.getType();
          return geometryType === "Polygon"
            ? geometry.getInteriorPoint()
            : geometryType === "MultiPolygon"
            ? geometry.getInteriorPoints()
            : geometry;
        },
        image: new Icon({
          anchor: [0.5, 46],
          anchorXUnits: "fraction",
          anchorYUnits: "pixels",
          src: PinIcon,
          scale: 0.12,
        }),
      });

      hoveredStyle = new Style({
        geometry: function (feature) {
          let geometry = feature.getGeometry();
          let geometryType = geometry.getType();
          return geometryType === "Polygon"
            ? geometry.getInteriorPoint()
            : geometryType === "MultiPolygon"
            ? geometry.getInteriorPoints()
            : geometry;
        },
        image: new Icon({
          anchor: [0.5, 46],
          anchorXUnits: "fraction",
          anchorYUnits: "pixels",
          src: HoveredPinIcon,
          scale: 0.12,
        }),
      });
    }
    this.map.getLayers().forEach((layer) => {
      if (
        layer.get("name") === "plotUserBoundriesLayer" ||
        layer.get("name") === "plotUserBoundriesLayerIcons"
      ) {
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

  setShapeFile(shapefiles) {
    this.clearAllBoundriesLayers();
    this.resetShapefileColors();
    shapefiles.forEach((shapefile) => {
      let vectorSource = new VectorSource({
        format: new GeoJSON(),
        loader: (extent, resolution, projection) => {
          var url = "http://localhost:3030/api/getShapefile/" + shapefile.file;
          var xhr = new XMLHttpRequest();
          let color = this.getshapefileColor();
          xhr.open("GET", url);
          var onError = function () {
            vectorSource.removeLoadedExtent(extent);
          };
          xhr.onerror = onError;
          xhr.onload = () => {
            if (xhr.status === 200) {
              var features = vectorSource
                .getFormat()
                .readFeatures(xhr.responseText);
              features.forEach((feature) => {
                feature.setId(feature.get("OBJ_ID"));
                feature.setStyle(
                  new Style({
                    fill: new Fill({
                      color: color,
                    }),
                    stroke: new Stroke({
                      color: "#000000",
                      width: 0.5,
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
      vector.set("name", "plotShapefileLayer" + shapefile.type);
      this.map.addLayer(vector);
    });
  }

  getshapefileColor() {
    let color = null;
    if (!this.shapefileColors) {
      this.shapefileColors = [
        ["#D62246", false],
        ["#17BEBB", false],
        ["#D4F4DD", false],
        ["#3F4B3B", false],
        ["#8377D1", false],
        ["#000000", false],
      ];
    }
    for (let i = 0; i < this.shapefileColors.length; i++) {
      if (this.shapefileColors[i][1] === false) {
        color = this.shapefileColors[i][0];
        this.shapefileColors[i][1] = true;
        break;
      }
    }
    return color;
  }

  resetShapefileColors() {
    this.shapefileColors = null;
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

  updateSize() {
    this.map.updateSize();
  }

  getTopLayer() {
    return this.topLayer;
  }

  addTopLayer(layerUrl, isSlideLayer) {
    let vectorSource = new VectorSource({
      format: new GeoJSON(),
      minScale: 15000000,
      loader: (extent, resolution, projection) => {
        let url = layerUrl + extent.join(",") + ",EPSG:3857";
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        let onError = function () {
          vectorSource.removeLoadedExtent(extent);
        };
        xhr.onerror = onError;
        xhr.onload = () => {
          if (xhr.status === 200) {
            let features = vectorSource
              .getFormat()
              .readFeatures(xhr.responseText);
            features.forEach((feature) => {
              feature.setStyle(this.setStyleOfFeature(feature));
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
      source: vectorSource,
    });
    vector.set("name", isSlideLayer ? "slideLayer" : "topLayer");
    if (isSlideLayer) {
      vector.setZIndex(5);
    }
    this.map.addLayer(vector);
  }

  setStyleOfFeature(feature) {
    if (!this.featureStyles) {
      this.featureStyles = [];
    }
    let style = null;
    this.featureStyles.forEach((styleItem) => {
      if (styleItem[0] === feature.get("Bodemtype")) {
        style = styleItem;
      }
    });
    if (style === null) {
      style = [
        feature.get("Bodemtype"),
        this.getRandomColor(feature.get("Bodemtype")),
      ];
      this.featureStyles.push(style);
    }
    return new Style({
      stroke: new Stroke({
        width: 1,
        color: "#000000",
      }),
      fill: new Fill({ color: style[1] }),
    });
  }

  getFeatureStyles() {
    return this.featureStyles;
  }

  getRandomColor(type) {
    if (!this.typeColors) {
      this.typeColors = [
        ["#93B5C6", false],
        ["#00487C", false],
        ["#DDEDAA", false],
        ["#F0CF65", false],
        ["#F55D3E", false],
        ["#D7816A", false],
        ["#BD4F6C", false],
        ["#B57BA6", false],
        ["#636940", false],
        ["#474A2C", false],
      ];
    }
    var color = "#";
    if (type === "OB" || type === "V") {
      color += "000000";
    } else {
      for (let i = 0; i < this.typeColors.length; i++) {
        if (this.typeColors[i][1] === false) {
          color = this.typeColors[i][0];
          this.typeColors[i][1] = true;
          break;
        }
      }
    }
    return color;
  }

  /*
  addMapEOLayer(geoserverHash, url) {
    let vectorSource = new VectorSource({
      format: new GeoJSON(),
      minScale: 15000000,
      loader: async (extent, resolution, projection) => {
        const client = new XMLHttpRequest();
        client.open("GET", url);
        client.setRequestHeader("Authorization", geoserverHash);
        client.responseType = "arraybuffer";

        const promise = new Promise((resolve, reject) => {
          client.onload = () => {
            if (client.status === 200) {
              const uInt8Array = new Uint8Array(client.response);
              let i = uInt8Array.length;
              const binaryString = new Array(i);
              while (i--) {
                binaryString[i] = String.fromCharCode(uInt8Array[i]);
              }
              const data = binaryString.join("");
              const base64 = btoa(data);
              resolve(`data:image/png;base64,${base64}`);
            } else {
              resolve(url);
            }
          };
        });
        client.send();

        return await promise;
      },
      strategy: bboxStrategy,
    });
    let vector = new Vector({
      source: vectorSource,
    });
    vector.set("name", "topLayer");
    this.map.addLayer(vector);
  }*/

  addMapEOLayer(geoserverHash, url, layerName, time, isSlideLayer) {
    let source = null;
    if (layerName.includes("ortho")) {
      source = new TileWMS({
        url: url,
        params: {
          LAYERS: layerName,
          TILED: true,
          TIME: time,
        },
        serverType: "geoserver",
        transition: 0,
        crossOrigin: "Anonymous",
      });
    } else {
      source = new TileWMS({
        url: url,
        params: {
          LAYERS: layerName,
          TILED: true,
          TIME: time,
          SLD_BODY: this.getColorMapForLayer(layerName),
        },
        serverType: "geoserver",
        transition: 0,
        crossOrigin: "Anonymous",
      });
    }
    let tileLayer = new TileLayer({
      source: source,
    });

    source.setTileLoadFunction(function (tile, src) {
      const client = new XMLHttpRequest();
      client.open("GET", src);
      client.setRequestHeader("Authorization", geoserverHash);
      client.responseType = "arraybuffer";

      client.onload = () => {
        if (client.status === 200) {
          const uInt8Array = new Uint8Array(client.response);
          let i = uInt8Array.length;
          const binaryString = new Array(i);
          while (i--) {
            binaryString[i] = String.fromCharCode(uInt8Array[i]);
          }
          const data = binaryString.join("");
          const base64 = btoa(data);
          tile.getImage().src = `data:image/png;base64,${base64}`;
        }
      };
      client.send();
    });
    tileLayer.set("name", isSlideLayer ? "slideLayer" : "topLayer");
    if (isSlideLayer) {
      tileLayer.setZIndex(5);
    }
    this.map.addLayer(tileLayer);
  }

  getColorMapForLayer(layerName) {
    if (layerName.includes("plantheight")) {
      return (
        '<StyledLayerDescriptor version="1.0.0"><NamedLayer><Name>' +
        layerName +
        '</Name><UserStyle><IsDefault>1</IsDefault><FeatureTypeStyle><Rule><RasterSymbolizer><Opacity>1.0</Opacity><ColorMap type="ramp"><ColorMapEntry color="#FFFFFF" quantity="-0.25" label="0" opacity="0"/><ColorMapEntry color="#2c7bb6" quantity="0" label="0" opacity="1"/><ColorMapEntry color="#408abe" quantity="0.3" label="0.3" opacity="1"/><ColorMapEntry color="#5a9dc9" quantity="0.5" label="0.5" opacity="1"/><ColorMapEntry color="#74b0d3" quantity="0.8" label="0.8" opacity="1"/><ColorMapEntry color="#8ec3de" quantity="1" label="1" opacity="1"/><ColorMapEntry color="#a7d6e8" quantity="1.3" label="1.3" opacity="1"/><ColorMapEntry color="#bae0e2" quantity="1.5" label="1.5" opacity="1"/><ColorMapEntry color="#cbe8da" quantity="1.8" label="1.8" opacity="1"/><ColorMapEntry color="#dcefd1" quantity="2" label="2" opacity="1"/><ColorMapEntry color="#edf7c9" quantity="2.3" label="2.3" opacity="1"/><ColorMapEntry color="#feffc0" quantity="2.5" label="2.5" opacity="1"/><ColorMapEntry color="#fff1ae" quantity="2.8" label="2.8" opacity="1"/><ColorMapEntry color="#ffe09b" quantity="3" label="3" opacity="1"/><ColorMapEntry color="#fed088" quantity="3.3" label="3.3" opacity="1"/><ColorMapEntry color="#febf75" quantity="3.5" label="3.5" opacity="1"/><ColorMapEntry color="#feaf62" quantity="3.8" label="3.8" opacity="1"/><ColorMapEntry color="#f69154" quantity="4" label="4" opacity="1"/><ColorMapEntry color="#ee7346" quantity="4.3" label="4.3" opacity="1"/><ColorMapEntry color="#e75538" quantity="4.5" label="4.5" opacity="1"/>      <ColorMapEntry color="#df372a" quantity="4.8" label="4.8" opacity="1"/><ColorMapEntry color="#d7191c" quantity="5" label="5" opacity="1"/></ColorMap></RasterSymbolizer></Rule></FeatureTypeStyle></UserStyle></NamedLayer></StyledLayerDescriptor>'
      );
    } else if (layerName.includes("ndvi")) {
      return (
        '<StyledLayerDescriptor version="1.0.0"><NamedLayer><Name>' +
        layerName +
        '</Name><UserStyle><IsDefault>1</IsDefault><FeatureTypeStyle><Rule><RasterSymbolizer><Opacity>1.0</Opacity><ColorMap type="ramp"><ColorMapEntry color="#FFFFFF" quantity="-0.26" label="-0.23" opacity="0"/>      <ColorMapEntry color="#d73027" quantity="-0.2" label="-0.2" opacity="1"/><ColorMapEntry color="#d73027" quantity="-0.2" label="-0.2" opacity="1"/><ColorMapEntry color="#db392c" quantity="-0.1" label="-0.1" opacity="1"/><ColorMapEntry color="#e55239" quantity="-0.1" label="-0.1" opacity="1"/><ColorMapEntry color="#f88253" quantity="0" label="0" opacity="1"/><ColorMapEntry color="#fd9960" quantity="0.1" label="0.1" opacity="1"/><ColorMapEntry color="#fec47a" quantity="0.1" label="0.1" opacity="1"/><ColorMapEntry color="#feda87" quantity="0.2" label="0.2" opacity="1"/><ColorMapEntry color="#fee795" quantity="0.2" label="0.2" opacity="1"/><ColorMapEntry color="#fff6b0" quantity="0.3" label="0.3" opacity="1"/><ColorMapEntry color="#ffffbe" quantity="0.4" label="0.4" opacity="1"/><ColorMapEntry color="#f7fcb2" quantity="0.4" label="0.4" opacity="1"/><ColorMapEntry color="#e3f398" quantity="0.5" label="0.5" opacity="1"/><ColorMapEntry color="#d8ef8a" quantity="0.5" label="0.5" opacity="1"/><ColorMapEntry color="#c5e67f" quantity="0.6" label="0.6" opacity="1"/><ColorMapEntry color="#a0d668" quantity="0.7" label="0.7" opacity="1"/>      <ColorMapEntry color="#89cc5f" quantity="0.7" label="0.7" opacity="1"/><ColorMapEntry color="#69bd5b" quantity="0.8" label="0.8" opacity="1"/>      <ColorMapEntry color="#2ca152" quantity="0.9" label="0.9" opacity="1"/><ColorMapEntry color="#1a9850" quantity="0.9" label="0.9" opacity="1"/><ColorMapEntry color="#1a9850" quantity="1" label="1" opacity="1"/></ColorMap></RasterSymbolizer></Rule></FeatureTypeStyle></UserStyle></NamedLayer></StyledLayerDescriptor>'
      );
    } else if (layerName.includes("ndre")) {
      return (
        '<StyledLayerDescriptor version="1.0.0"><NamedLayer><Name>' +
        layerName +
        '</Name><UserStyle><IsDefault>1</IsDefault><FeatureTypeStyle><Rule><RasterSymbolizer><Opacity>1.0</Opacity><ColorMap type="ramp">      <ColorMapEntry color="#FFFFFF" quantity="-0.24476190476190476" label="-0.21" opacity="0"/><ColorMapEntry color="#8c5c08" quantity="-0.2" label="-0.2" opacity="1"/>      <ColorMapEntry color="#8c5c08" quantity="-0.2" label="-0.2" opacity="1"/><ColorMapEntry color="#8e5f08" quantity="-0.1" label="-0.1" opacity="1"/><ColorMapEntry color="#8e5f08" quantity="-0.1" label="-0.1" opacity="1"/><ColorMapEntry color="#c5ad13" quantity="0" label="0" opacity="1"/>      <ColorMapEntry color="#c5ad13" quantity="0" label="0" opacity="1"/><ColorMapEntry color="#ffff1e" quantity="0.1" label="0.1" opacity="1"/>      <ColorMapEntry color="#ffff1e" quantity="0.1" label="0.1" opacity="1"/><ColorMapEntry color="#dae819" quantity="0.1" label="0.1" opacity="1"/><ColorMapEntry color="#dae819" quantity="0.2" label="0.2" opacity="1"/><ColorMapEntry color="#b6d215" quantity="0.2" label="0.2" opacity="1"/><ColorMapEntry color="#b6d215" quantity="0.3" label="0.3" opacity="1"/><ColorMapEntry color="#91bc11" quantity="0.3" label="0.3" opacity="1"/><ColorMapEntry color="#91bc11" quantity="0.4" label="0.4" opacity="1"/><ColorMapEntry color="#6da60c" quantity="0.4" label="0.4" opacity="1"/><ColorMapEntry color="#6da60c" quantity="0.5" label="0.5" opacity="1"/><ColorMapEntry color="#489008" quantity="0.5" label="0.5" opacity="1"/><ColorMapEntry color="#489008" quantity="0.6" label="0.6" opacity="1"/><ColorMapEntry color="#247a04" quantity="0.6" label="0.6" opacity="1"/><ColorMapEntry color="#247a04" quantity="0.6" label="0.6" opacity="1"/><ColorMapEntry color="#006400" quantity="0.7" label="0.7" opacity="1"/><ColorMapEntry color="#006400" quantity="0.7" label="0.7" opacity="1"/></ColorMap>      </RasterSymbolizer></Rule></FeatureTypeStyle>      </UserStyle>      </NamedLayer>      </StyledLayerDescriptor>'
      );
    } else {
      return "";
    }
  }

  addSentinellLayer(url, layer, time, isSlideLayer) {
    let imageLayer = new TileLayer({
      source: new TileWMS({
        url: url,
        strategy: bboxStrategy,
        params: {
          layers: layer,
          time: "2020-06-01",
          srs: "EPSG:3857",
        },
        serverType: "geoserver",
        transition: 0,
        crossOrigin: "Anonymous",
      }),
    });
    imageLayer.set("name", isSlideLayer ? "slideLayer" : "topLayer");
    if (isSlideLayer) {
      imageLayer.setZIndex(5);
    }

    this.map.addLayer(imageLayer);
  }

  addBodemLayer(isSlideLayer) {
    this.resetBodemScanTypes();
    let vectorSource = new VectorSource({
      format: new GeoJSON(),
      loader: (extent, resolution, projection) => {
        var url = "http://localhost:3030/api/getBodemscan";
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        var onError = () => {
          vectorSource.removeLoadedExtent(extent);
        };
        xhr.onerror = onError;
        xhr.onload = () => {
          if (xhr.status === 200) {
            var features = vectorSource
              .getFormat()
              .readFeatures(xhr.responseText);
            features.forEach((feature) => {
              feature.getGeometry().transform("EPSG:4326", "EPSG:3857");
              feature.setId(feature.get("ID"));
              this.addBodemscanType(
                feature.get("CLASS_BND"),
                feature.get("COLOR")
              );
              feature.setStyle(
                new Style({
                  fill: new Fill({
                    color: feature.get("COLOR"),
                  }),
                  stroke: new Stroke({
                    color: "#000000",
                    width: 0.5,
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
    vector.set("name", isSlideLayer ? "slideLayer" : "topLayer");
    if (isSlideLayer) {
      vector.setZIndex(5);
    }
    this.map.addLayer(vector);
  }

  resetBodemScanTypes() {
    this.bodemscanTypes = null;
  }

  addBodemscanType(type, color) {
    if (this.bodemscanTypes === null) {
      this.bodemscanTypes = [];
    }
    this.bodemscanTypes.push({ type, color });
  }

  getBodemscanTypes() {
    return this.bodemscanTypes;
  }

  removeTopLayer(isSlideLayer) {
    this.map.getLayers().forEach((layer) => {
      if (layer !== undefined) {
        if (layer.get("name") === (isSlideLayer ? "slideLayer" : "topLayer")) {
          layer.getSource().clear();
          this.map.removeLayer(layer);
        }
      }
    });
  }

  changeOpacitySlideLayer(amount) {
    this.map.getLayers().forEach((layer) => {
      if (layer !== undefined) {
        if (layer.get("name") === "slideLayer") {
          layer.setOpacity(amount / 100);
        }
      }
    });
  }

  setEditInteractionForPlotUserBoundriesLayer(state) {
    this.map.getLayers().forEach((layer) => {
      if (layer.get("name") === "plotUserBoundriesLayer") {
        if (state) {
          var select = new Select({
            wrapX: false,
            layers: [layer],
          });
          this.modify = new Modify({
            features: select.getFeatures(),
          });
          this.map.addInteraction(this.modify);
        } else {
          if (this.modify) {
            this.map.removeInteraction(this.modify);
            this.modify = null;
          }
        }
      }
    });
  }

  addTileLayer(url) {
    const wmsLayer = new TileLayer({
      source: new WMTS({
        url,
        params: {
          TILED: true,
        },
        crossOrigin: "Anonymous",
      }),
    });
    console.log(wmsLayer);
    this.map.addLayer(wmsLayer);
  }
}

export default OlMap;
