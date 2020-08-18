import React from "react";

import styles from "./FeatureEditor.module.scss";
import editLogo from "../../assets/NotesEditor/edit.svg";
import editEnabledLogo from "../../assets/NotesEditor/editEnabled.svg";

const FeatureEditor = (props) => {
  return (
    <div
      className={[styles.Menu, props.enabled ? styles.Enabled : null].join(" ")}
      onClick={props.editButtonClickedHandler}
    >
      <img
        src={props.enabled ? editEnabledLogo : editLogo}
        alt="Map Editor Logo"
        tag="Map Editor Logo"
      />
    </div>
  );
};

export default FeatureEditor;
