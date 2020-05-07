import React, { Component } from "react";
import { connect } from "react-redux";

import Viewer from "../../components/Viewer/Viewer";
import Sidebar from "../../components/Sidebar/Sidebar";
import MapEditor from "../../components/MapEditor/MapEditor";
import Aux from "../../hoc/Aux/Aux";
import Modal from "../../components/UI/Modal/Modal";
import FeatureForm from "../../components/FeatureForm/FeatureForm";
import * as actions from "../../store/actions/Index";
import HomeSideBar from "../../components/Sidebar/HomeSideBar/HomeSideBar";
import Snackbar from "../../components/UI/Snackbar/Snackbar";

class HomeMap extends Component {
  state = {
    addingFeature: false,
    selectedFeature: null,
  };

  constructor(props) {
    super(props);
    this.snackbarRef = React.createRef();
  }

  featureAddedHandler = (feature) => {
    this.setState({ addingFeature: true, selectedFeature: feature });
  };

  addingFeatureCancelHandler = () => {
    this.setState({ addingFeature: false, selectedFeature: null });
  };

  addFeatureToUserHandler = (feature) => {
    this.setState({ addingFeature: false, selectedFeature: null });
    this.props.onAddFeatureInit();
    this.props.onAddFeature(feature);
    this.snackbarHandler(feature.name + " toegevoegd!");
  };

  snackbarHandler = (message) => {
    this.snackbarRef.current.openSnackBar(message);
  };

  render() {
    let featureSummary = null;
    if (this.state.addingFeature) {
      featureSummary = (
        <FeatureForm
          selectedFeature={this.state.selectedFeature}
          formClosed={this.addingFeatureCancelHandler}
          onAddPlot={this.addFeatureToUserHandler}
        ></FeatureForm>
      );
    }
    return (
      <Aux>
        <Modal
          show={this.state.addingFeature}
          modalClosed={this.addingFeatureCancelHandler}
        >
          {featureSummary}
        </Modal>
        <Sidebar>
          <HomeSideBar />
        </Sidebar>
        <Viewer featureAddedHandler={this.featureAddedHandler}></Viewer>
        <MapEditor></MapEditor>
        <Snackbar ref={this.snackbarRef} btnType="sucess" />
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAddFeature: (feature) => dispatch(actions.addFeature(feature)),
    onAddFeatureInit: () => dispatch(actions.addFeatureInit()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeMap);
