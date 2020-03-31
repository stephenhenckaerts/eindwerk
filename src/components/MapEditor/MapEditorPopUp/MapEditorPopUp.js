import React, { Component } from "react";
import { connect } from "react-redux";

import * as actions from "../../../store/actions/Index";
import styles from "./MapEditorPopUp.module.scss";
import Switch from "../../UI/Switch/Switch";
import downArrowLogo from "../../../assets/MapEditor/down-arrow.png";
import upArrowLogo from "../../../assets/MapEditor/up-arrow.png";

class MapEditorPopUp extends Component {
  state = {
    mapPickerMenu: true
  };

  mapPickerMenuChangeHandler = () => {
    this.setState({ mapPickerMenu: !this.state.mapPickerMenu });
  };

  render() {
    var mapPicker = null;
    var arrowLogo = downArrowLogo;
    if (this.state.mapPickerMenu) {
      arrowLogo = upArrowLogo;
      mapPicker = (
        <div>
          <div
            className={styles.MapPickerMenuItem}
            onClick={() => this.props.onTileLayerSelected("OPENSTREETMAP")}
          >
            <p>OPENSTREETMAP</p>
          </div>
          <div
            className={styles.MapPickerMenuItem}
            onClick={() => this.props.onTileLayerSelected("BING MAPS")}
          >
            <p>BING MAPS</p>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.MapEditorMenu}>
        <div className={styles.MapEditorMenuItem}>
          <Switch
            isOn={this.props.plotBoundriesState}
            handleToggle={() =>
              this.props.onPlotBoundriesSelected(!this.props.plotBoundriesState)
            }
          />
          <p>PERCEELSRANDEN</p>
        </div>
        <div
          className={[styles.MapEditorMenuItem, styles.MapPickerTitle].join(
            " "
          )}
          onClick={this.mapPickerMenuChangeHandler}
        >
          <p>{this.props.selectedLayer}</p>
          <img src={arrowLogo} alt="Down Arrow Icon" />
        </div>
        {mapPicker}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedLayer: state.type,
    plotBoundriesState: state.state
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTileLayerSelected: selectedLayer =>
      dispatch(actions.setTileLayer(selectedLayer)),
    onPlotBoundriesSelected: newState =>
      dispatch(actions.setPlotBoundries(newState))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MapEditorPopUp);
