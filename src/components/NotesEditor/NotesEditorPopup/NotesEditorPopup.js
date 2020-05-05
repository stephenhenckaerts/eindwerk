import React, { Component } from "react";

import styles from "./NotesEditorPopup.module.scss";
import Button from "../../UI/Button/Button";

import axios from "axios";

class NotesEditorPopup extends Component {
  state = {
    mapPickerMenu: false,
    selectedFile: null,
  };

  openShapefilePickerMenu = () => {
    this.setState({ mapPickerMenu: !this.state.mapPickerMenu });
  };

  onChangeHandler = (event) => {
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0,
    });
  };

  onClickHandler = () => {
    const data = new FormData();
    data.append("file", this.state.selectedFile);
    this.props.uploadShapefile(data);
  };

  render() {
    let uploadShapefile = null;
    if (this.state.mapPickerMenu) {
      uploadShapefile = (
        <div>
          <div className={styles.MapPickerMenuItem}>
            <input
              className={styles.FilePickerInput}
              type="file"
              name="file"
              id="file"
              onChange={this.onChangeHandler}
            />
            <label htmlFor="file">
              <strong>Kies een bestand...</strong>
            </label>

            <Button
              disabled={!this.state.selectedFile}
              btnType="Success"
              clicked={this.onClickHandler}
            >
              <p>UPLOAD</p>
            </Button>
          </div>
        </div>
      );
    }
    return (
      <div className={styles.MapEditorMenu}>
        <div
          className={[
            styles.MapEditorMenuItem,
            this.props.shapefile == "None" ? styles.DisabledMenuItem : null,
          ].join(" ")}
        >
          <a
            href="localhost:3030/api/getShapefile/123"
            target="_blank"
            download
          >
            <p>SHAPEFILE DOWNLOADEN</p>
          </a>
        </div>
        <div
          className={styles.MapEditorMenuItem}
          onClick={this.openShapefilePickerMenu}
        >
          <p>SHAPEFILE UPLOADEN</p>
        </div>
        {uploadShapefile}
      </div>
    );
  }
}

export default NotesEditorPopup;
