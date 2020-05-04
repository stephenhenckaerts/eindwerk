import React, { Component } from "react";

import styles from "./NotesEditorPopup.module.scss";

class NotesEditorPopup extends Component {
  render() {
    return (
      <div className={styles.MapEditorMenu}>
        <div
          className={[
            styles.MapEditorMenuItem,
            this.props.shapefile == "None" ? styles.DisabledMenuItem : null,
          ].join(" ")}
        >
          <p>SHAPEFILE DOWNLOADEN</p>
        </div>
        <div className={styles.MapEditorMenuItem}>
          <p>SHAPEFILE UPLOADEN</p>
        </div>
      </div>
    );
  }
}

export default NotesEditorPopup;
