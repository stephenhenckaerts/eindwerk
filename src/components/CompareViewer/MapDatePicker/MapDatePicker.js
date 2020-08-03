import React from "react";

import styles from "./MapDatePicker.module.scss";

const MapDatePicker = (props) => {
  return (
    <div className={styles.InfoDiv}>
      <p
        className={styles.Arrow}
        onClick={() => props.changeDateHandler(-1, props.map)}
      >
        &lt;
      </p>
      <p>
        {props.map.topLayer.layerinfo.layerTimes[
          props.map.topLayer.selectedDate
        ].date.substring(
          0,
          props.map.topLayer.layerinfo.layerTimes[
            props.map.topLayer.selectedDate
          ].date.length - 10
        )}
      </p>
      <p
        className={styles.Arrow}
        onClick={() => props.changeDateHandler(1, props.map)}
      >
        >
      </p>
    </div>
  );
};

export default MapDatePicker;
