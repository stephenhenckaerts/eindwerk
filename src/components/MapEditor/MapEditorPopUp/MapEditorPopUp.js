import React, { useState } from "react";

import styles from "./MapEditorPopUp.module.scss";
import Switch from "../../UI/Switch/Switch";
import downArrowLogo from "../../../assets/MapEditor/down-arrow.png";

const MapEditorPopUp = () => {
  const [switchState, setSwitchState] = useState(true);
  const [mapPickerMenu, setmapPickerMenu] = useState(true);

  const switchStateChangeHandler = () => {
    setSwitchState(!switchState);
  };

  const mapPickerMenuChangeHandler = () => {
    setmapPickerMenu(!mapPickerMenu);
  };

  var mapPicker = null;
  if (mapPickerMenu) {
    mapPicker = (
      <div>
        <div className={styles.MapPickerMenuItem}>
          <p>OPENSTREETMAP</p>
        </div>
        <div className={styles.MapPickerMenuItem}>
          <p>BING MAPS</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.MapEditorMenu}>
      <div className={styles.MapEditorMenuItem}>
        <Switch isOn={switchState} handleToggle={switchStateChangeHandler} />
        <p>PERCEELSRANDEN</p>
      </div>
      <div
        className={[styles.MapEditorMenuItem, styles.MapPickerTitle].join(" ")}
        onClick={mapPickerMenuChangeHandler}
      >
        <p>OPENSTREETMAP</p>
        <img src={downArrowLogo} alt="Down Arrow Icon" />
      </div>
      {mapPicker}
    </div>
  );
};

export default MapEditorPopUp;
