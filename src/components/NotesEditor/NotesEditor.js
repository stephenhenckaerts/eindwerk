import React, { useState } from "react";

import styles from "./NotesEditor.module.scss";
import exportLogo from "../../assets/NotesEditor/export.png";
import NotesEditorPopup from "./NotesEditorPopup/NotesEditorPopup";

const NotesEditor = (props) => {
  const [menuOpened, setMenuOpened] = useState(false);

  const switchMenuOpened = () => {
    setMenuOpened(!menuOpened);
  };

  let shapefile = null;

  if (props.shapefile === "None") {
    shapefile = (
      <div className={styles.ShapefileNote}>
        <p>Geen Shapefile beschikbaar voor dit perceel</p>
        <p>Upload een Shapefile</p>
      </div>
    );
  }

  let mapEditorPopUp = null;
  if (menuOpened) {
    mapEditorPopUp = (
      <NotesEditorPopup
        shapefile={props.shapefile}
        uploadShapefile={(shapefile) => props.uploadShapefile(shapefile)}
      ></NotesEditorPopup>
    );
  }

  if (menuOpened) {
  }
  return (
    <div>
      <div
        className={[
          styles.Menu,
          mapEditorPopUp ? styles.MenuOpened : null,
        ].join(" ")}
        onClick={switchMenuOpened}
      >
        <img src={exportLogo} alt="Notes Editor Logo" tag="Notes Editor Logo" />
      </div>
      {mapEditorPopUp}
      {shapefile}
    </div>
  );
};

export default NotesEditor;
