import React from "react";

import Map from "../Map/Map";
import "ol/ol.css";
import styles from "./Viewer.module.css";

const Viewer = () => {
  React.useEffect(() => {
    Map.map.setTarget("map");
  }, []);

  return (
    <div>
      <div id="map" className={styles.Map}></div>
    </div>
  );
};

export default Viewer;
