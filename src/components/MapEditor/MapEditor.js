import React, { useState } from "react";

import styles from "./MapEditor.module.scss";
import cogLogo from "../../assets/MapEditor/cog.png";
import MapEditorPopUp from "./MapEditorPopUp/MapEditorPopUp";

const MapEditor = () => {
  const [menuOpened, setMenuOpened] = useState(false);

  const switchMenuOpened = () => {
    setMenuOpened(!menuOpened);
  };

  var mapEditorPopUp = null;
  if (menuOpened) {
    mapEditorPopUp = <MapEditorPopUp></MapEditorPopUp>;
  }
  return (
    <div>
      <div
        className={[
          styles.Menu,
          mapEditorPopUp ? styles.MenuOpened : null
        ].join(" ")}
        onClick={switchMenuOpened}
      >
        <img src={cogLogo} alt="Map Editor Logo" tag="Map Editor Logo" />
      </div>
      {mapEditorPopUp}
    </div>
  );
};

export default MapEditor;
