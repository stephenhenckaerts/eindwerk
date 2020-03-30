import React, { Component } from "react";
import { connect } from "react-redux";

import styles from "./MapEditor.module.scss";
import cogLogo from "../../assets/MapEditor/cog.png";
import MapEditorPopUp from "./MapEditorPopUp/MapEditorPopUp";
import * as actions from "../../store/actions/Index";

class MapEditor extends Component {
  state = {
    menuOpened: true
  };

  switchMenuOpened = () => {
    this.setState({ menuOpened: !this.state.menuOpened });
  };

  switchTileLayer = selectedLayer => {
    this.props.onTileLayerSelected(selectedLayer);
  };

  render() {
    var mapEditorPopUp = null;
    if (this.state.menuOpened) {
      mapEditorPopUp = (
        <MapEditorPopUp
          selectedLayer={this.props.type}
          switchTileLayer={this.switchTileLayer}
        ></MapEditorPopUp>
      );
    }
    return (
      <div>
        <div
          className={[
            styles.Menu,
            mapEditorPopUp ? styles.MenuOpened : null
          ].join(" ")}
          onClick={this.switchMenuOpened}
        >
          <img src={cogLogo} tag="Map Editor Logo" />
        </div>
        {mapEditorPopUp}
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    type: state.type
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTileLayerSelected: selectedLayer =>
      dispatch(actions.setTileLayer(selectedLayer))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MapEditor);
