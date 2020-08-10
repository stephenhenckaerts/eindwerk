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
import { Feature } from "ol";
import { Polygon } from "ol/geom";
import { Fill, Stroke, Style, Icon } from "ol/style";
import PinIcon from "../../assets/Map/pin.png";
import HoveredPinIcon from "../../assets/Map/hoveredpin.png";
import jsPDF from "jspdf";
import ImageLayer from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";
import TileWMS from "ol/source/TileWMS";

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

  exportMap() {
    this.map.once("rendercomplete", () => {
      var viewResolution = this.map.getView().getResolution();
      var mapCanvas = document.createElement("canvas");
      var size = this.map.getSize();
      mapCanvas.width = size[0];
      mapCanvas.height = size[1];
      var mapContext = mapCanvas.getContext("2d");

      this.map.getLayers().forEach((canvas) => {
        if (canvas !== undefined) {
          if (canvas.width > 0) {
            var opacity = canvas.parentNode.style.opacity;
            mapContext.globalAlpha = opacity === "" ? 1 : Number(opacity);
            var transform = canvas.style.transform;
            // Get the transform parameters from the style's transform matrix
            var matrix = transform
              .match(/^matrix\(([^]*)\)$/)[1]
              .split(",")
              .map(Number);
            // Apply the transform to the export map context
            CanvasRenderingContext2D.prototype.setTransform.apply(
              mapContext,
              matrix
            );
            mapContext.drawImage(canvas, 0, 0);
          }
        }
      });

      var pdf = new jsPDF("landscape", undefined, "a4");
      pdf.addImage(mapCanvas.toDataURL("image/jpeg"), "JPEG", 0, 0, 297, 210);
      //pdf.save("map.pdf");
      // Reset original map size
      this.map.setSize(size);
      this.map.getView().setResolution(viewResolution);
      document.body.style.cursor = "auto";
    });
    this.map.renderSync();
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
      if (layer !== undefined) {
        if (
          layer.get("name") === "plotBoundriesLayer" ||
          layer.get("name") === "plotUserBoundriesLayer" ||
          layer.get("name") === "plotUserBoundriesLayerIcons" ||
          layer.get("name") === "plotShapefileLayer"
        ) {
          layer.getSource().clear();
          this.map.removeLayer(layer);
        }
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
      let vectorIcons = new Vector({
        maxZoom: 13,
        source: vectorSource,
        style: iconStyle,
      });
      let vector = new Vector({
        minZoom: 13,
        source: vectorSource,
        style: new Style({
          stroke: new Stroke({
            width: 5,
            color: "#9c1616",
          }),
        }),
      });
      vector.setZIndex(10);
      if (featureHovered !== null) {
        this.setInteractionForPlotBoundriesLayer(vector, featureSelected);
        this.setHoverInteractionForUserPlotBoundries(vector, featureHovered);
      }
      vector.set("name", "plotUserBoundriesLayer");
      vector.set("name", "plotUserBoundriesLayerIcons");
      this.plotsExtent = vectorSource.getExtent();
      this.map.addLayer(vectorIcons);
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
    let source = new TileWMS({
      url: url,
      params: {
        LAYERS: layerName,
        TILED: true,
        TIME: time,
      },
      serverType: "geoserver",
      // Countries have transparency, so do not fade tiles:
      transition: 0,
      crossOrigin: "Anonymous",
    });
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
    this.map.addLayer(tileLayer);
  }

  addSentinellLayer(url) {
    let imageLayer = new ImageLayer({
      source: new ImageWMS({
        url: url,
        strategy: bboxStrategy,
      }),
    });
    console.log(imageLayer);

    imageLayer.set("name", "topLayer");
    this.map.addLayer(imageLayer);
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
