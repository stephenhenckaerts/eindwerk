import React, { useState } from "react";

import styles from "./MapEditorPopUp.module.scss";
import Switch from "../../UI/Switch/Switch";
import downArrowLogo from "../../../assets/MapEditor/down-arrow.png";
import upArrowLogo from "../../../assets/MapEditor/up-arrow.png";

const MapEditorPopUp = props => {
  const [switchState, setSwitchState] = useState(true);
  const [mapPickerMenu, setmapPickerMenu] = useState(true);

  const switchStateChangeHandler = () => {
    setSwitchState(!switchState);
  };

  const mapPickerMenuChangeHandler = () => {
    setmapPickerMenu(!mapPickerMenu);
  };

  var mapPicker = null;
  var arrowLogo = downArrowLogo;
  if (mapPickerMenu) {
    arrowLogo = upArrowLogo;
    mapPicker = (
      <div>
        <div
          className={styles.MapPickerMenuItem}
          onClick={() => props.switchTileLayer("OPENSTREETMAP")}
        >
          <p>OPENSTREETMAP</p>
        </div>
        <div
          className={styles.MapPickerMenuItem}
          onClick={() => props.switchTileLayer("BING MAPS")}
        >
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
        <p>{props.selectedLayer}</p>
        <img src={arrowLogo} alt="Down Arrow Icon" />
      </div>
      {mapPicker}
    </div>
  );
};

export default MapEditorPopUp;
