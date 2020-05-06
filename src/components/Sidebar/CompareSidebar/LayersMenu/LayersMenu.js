import React from "react";

import bodemkaart from "../../../../assets/CompareSidebar/bodemkaart.png";
import dronebeelden from "../../../../assets/CompareSidebar/dronebeelden.png";
import satelliet from "../../../../assets/CompareSidebar/satelliet.svg";
import tractor from "../../../../assets/CompareSidebar/tractor.svg";

import Snackbar from "../../../UI/Snackbar/Snackbar";

import styles from "./LayersMenu.module.scss";

const LayersMenu = () => {
  let snackbarRef = React.createRef();

  const clickHandler = () => {
    snackbarRef.current.openSnackBar("Button Pressed...");
  };

  return (
    <div className={styles.Menu}>
      <div className={styles.Layer}>
        <img src={bodemkaart} alt="Bodemkaart" />
        <p>Bodemkaarten</p>
      </div>
      <div className={styles.Layer}>
        <img src={tractor} alt="Bodemscans" />
        <p>Bodemscans</p>
      </div>
      <div className={styles.Layer}>
        <img src={dronebeelden} alt="Dronebeelden" />
        <p>Dronebeelden</p>
      </div>
      <div className={styles.Layer} onClick={clickHandler}>
        <img src={satelliet} alt="Sattelietbeelden" />
        <p>Sattelietbeelden</p>
      </div>
      <Snackbar ref={snackbarRef} />
    </div>
  );
};

export default LayersMenu;
