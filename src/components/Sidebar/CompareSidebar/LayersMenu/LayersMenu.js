import React from "react";

import bodemkaart from "../../../../assets/CompareSidebar/bodemkaart.png";
import dronebeelden from "../../../../assets/CompareSidebar/dronebeelden.png";
import satelliet from "../../../../assets/CompareSidebar/satelliet.svg";
import tractor from "../../../../assets/CompareSidebar/tractor.svg";

import styles from "./LayersMenu.module.scss";

const LayersMenu = () => {
  return (
    <div className={styles.Menu}>
      <div className={styles.Layer}>
        <img src={bodemkaart} />
        <p>Bodemkaarten</p>
      </div>
      <div className={styles.Layer}>
        <img src={tractor} />
        <p>Bodemscans</p>
      </div>
      <div className={styles.Layer}>
        <img src={dronebeelden} />
        <p>Dronebeelden</p>
      </div>
      <div className={styles.Layer}>
        <img src={satelliet} />
        <p>Sattelietbeelden</p>
      </div>
    </div>
  );
};

export default LayersMenu;
