import React from "react";

import classes from "./Viewer.css";
import Map from "../Map/Map";
import "ol/ol.css";

const Viewer = () => {
  React.useEffect(() => {
    Map.map.setTarget("map");
  }, []);

  return (
    <div
      id="map"
      className={classes.Map}
      style={{ width: "100%", height: "800px" }}
    ></div>
  );
};

export default Viewer;
