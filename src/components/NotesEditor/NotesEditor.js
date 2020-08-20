import React, { useState } from "react";

import styles from "./NotesEditor.module.scss";
import exportLogo from "../../assets/NotesEditor/export.png";
import NotesEditorPopup from "./NotesEditorPopup/NotesEditorPopup";
import Aux from "../../hoc/Aux/Aux";

const NotesEditor = (props) => {
  const [menuOpened, setMenuOpened] = useState(false);

  const switchMenuOpened = () => {
    setMenuOpened(!menuOpened);
  };
  let shapefileColors = [
    ["#D62246"],
    ["#17BEBB"],
    ["#D4F4DD"],
    ["#3F4B3B"],
    ["#8377D1"],
    ["#000000"],
  ];

  let shapefile = null;
  let shapeFileLegend = null;
  if (
    props.shapefile === "None" ||
    props.shapefile === undefined ||
    props.shapefile.length === 0
  ) {
    shapefile = (
      <div className={styles.ShapefileNote}>
        <p>Geen Shapefile beschikbaar voor dit perceel</p>
        <p>Upload een Shapefile</p>
      </div>
    );
  } else {
    shapeFileLegend = (
      <div
        className={[
          styles.ShapeFileLegend,
          props.disableUpload ? styles.CompareView : null,
        ].join(" ")}
      >
        {props.shapefile.map((shapefile, index) => {
          return (
            <div key={index} className={styles.ShapefileDiv}>
              <div
                className={styles.ColorSquare}
                style={{ backgroundColor: shapefileColors[index] }}
              />
              <p>{shapefile.type}</p>
            </div>
          );
        })}
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

  let menu = (
    <div
      className={[styles.Menu, mapEditorPopUp ? styles.MenuOpened : null].join(
        " "
      )}
      onClick={switchMenuOpened}
    >
      <img src={exportLogo} alt="Notes Editor Logo" tag="Notes Editor Logo" />
    </div>
  );
  if (props.disableUpload) {
    menu = null;
  }
  return (
    <Aux>
      {menu}
      {mapEditorPopUp}
      {shapefile}
      {shapeFileLegend}
    </Aux>
  );
};

export default NotesEditor;
