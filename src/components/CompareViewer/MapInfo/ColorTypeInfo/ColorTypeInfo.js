import React from "react";

import Aux from "../../../../hoc/Aux/Aux";

import styles from "./ColorTypeInfo.module.scss";

const ColorTypesInfo = (props) => {
  return (
    <Aux>
      {props.colors
        ? props.colors.map((color) => {
            return (
              <div
                key={color[0]}
                className={[
                  styles.ColorType,
                  props.slide ? styles.Slide : null,
                ].join(" ")}
                onClick={() => props.colorTypeClicked(color[0])}
              >
                <div
                  className={styles.ColorTypeSquare}
                  style={{ backgroundColor: color[1] }}
                ></div>
                <p>{color[0]}</p>
              </div>
            );
          })
        : null}
    </Aux>
  );
};

export default ColorTypesInfo;
