import React from "react";

import styles from "./MapDatePicker.module.scss";

const MapDatePicker = (props) => {
  return (
    <div className={styles.InfoDiv}>
      <p className={styles.Arrow} onClick={() => props.changeDateHandler(-1)}>
        &lt;
      </p>
      <p>{props.date}</p>
      <p className={styles.Arrow} onClick={() => props.changeDateHandler(1)}>
        >
      </p>
    </div>
  );
};

export default MapDatePicker;
