import React from "react";

import styles from "./MapSpinner.module.scss";
import Spinner from "../Spinner/Spinner";

const MapSpinner = () => {
  return (
    <div className={styles.Background}>
      <Spinner className={styles.Spinner} />
    </div>
  );
};

export default MapSpinner;
