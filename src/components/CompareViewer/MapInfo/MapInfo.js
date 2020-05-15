import React from "react";

import styles from "./MapInfo.module.scss";

const MapInfos = (props) => {
  return (
    <div className={styles.InfoDiv}>
      {props.colors
        ? props.colors.map((color) => {
            return (
              <div key={color[0]} className={styles.ColorType}>
                <div
                  className={styles.ColorTypeSquare}
                  style={{ backgroundColor: color[1] }}
                ></div>
                <p>{color[0]}</p>
              </div>
            );
          })
        : null}
    </div>
  );
};

export default MapInfos;
