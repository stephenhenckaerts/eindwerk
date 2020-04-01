import React, { Component } from "react";
import { connect } from "react-redux";

import styles from "./HomeMap.module.css";
import Viewer from "../../components/Viewer/Viewer";
import Sidebar from "../../components/Sidebar/Sidebar";
import MapEditor from "../../components/MapEditor/MapEditor";
import Aux from "../../hoc/Aux/Aux";
import Modal from "../../components/UI/Modal/Modal";
import FeatureForm from "../../components/FeatureForm/FeatureForm";
import * as actions from "../../store/actions/Index";

class HomeMap extends Component {
  state = {
    addingFeature: false,
    selectedFeature: null
  };

  featureAddedHandler = feature => {
    this.setState({ addingFeature: true, selectedFeature: feature });
  };

  addingFeatureCancelHandler = () => {
    this.setState({ addingFeature: false, selectedFeature: null });
  };

  addFeatureToUserHadler = feature => {
    this.setState({ addingFeature: false, selectedFeature: null });
    this.props.onAddFeature(feature);
  };

  render() {
    var featureSummary = null;
    if (this.state.addingFeature) {
      featureSummary = (
        <FeatureForm
          selectedFeature={this.state.selectedFeature}
          formClosed={this.addingFeatureCancelHandler}
          onAddPlot={this.addFeatureToUserHadler}
        ></FeatureForm>
      );
    }
    return (
      <div>
        <Aux>
          <Modal
            show={this.state.addingFeature}
            modalClosed={this.addingFeatureCancelHandler}
          >
            {featureSummary}
          </Modal>
          <Sidebar></Sidebar>
          <Viewer featureAddedHandler={this.featureAddedHandler}></Viewer>
          <MapEditor></MapEditor>
        </Aux>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    onAddFeature: feature => dispatch(actions.addFeature(feature))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeMap);
