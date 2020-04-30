import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import Viewer from "../../components/PlotViewer/PlotViewer";
import Sidebar from "../../components/Sidebar/Sidebar";
import MapEditor from "../../components/MapEditor/MapEditor";
import Aux from "../../hoc/Aux/Aux";
import Modal from "../../components/UI/Modal/Modal";
import FeatureForm from "../../components/FeatureForm/FeatureForm";
import * as actions from "../../store/actions/Index";
import PlotSidebar from "../../components/Sidebar/PlotSideBar/PlotSideBar";

class PlotMap extends Component {
  state = {
    updatingFeature: false,
    featureDeleted: false,
  };

  constructor(props) {
    super(props);
    this.plotId = this.props.match.params.plotId;
    this.props.onLoadFeature(this.plotId);
  }

  featureAddedHandler = (feature) => {
    this.setState({ Feature: true, selectedFeature: feature });
  };

  updateFeatureHandler = (feature) => {
    this.props.onUpdateFeatureInit();
    this.props.onUpdateFeature(feature);
    this.setState({ updatingFeature: false, selectedFeature: null });
  };

  plotNotedHandler(plotId) {
    console.log(plotId);
  }

  plotUpdateHandler() {
    this.setState({ updatingFeature: true });
  }

  updatingFeatureCancelHandler = () => {
    this.setState({ updatingFeature: false });
  };

  plotDeletedHandler(plotId) {
    this.props.onDeleteFeature(plotId);
    this.setState({ featureDeleted: true });
  }

  render() {
    if (this.state.featureDeleted) {
      return <Redirect to={"/percelen"} />;
    }
    let featureSummary = null;
    if (this.state.updatingFeature) {
      featureSummary = (
        <FeatureForm
          selectedFeature={this.props.feature}
          formClosed={this.updatingFeatureCancelHandler}
          onAddPlot={this.updateFeatureHandler}
        ></FeatureForm>
      );
    }
    return (
      <Aux>
        <Modal
          show={this.state.updatingFeature}
          modalClosed={this.addingFeatureCancelHandler}
        >
          {featureSummary}
        </Modal>
        <Sidebar>
          <PlotSidebar
            feature={this.props.feature}
            loading={this.props.loading}
            plotNoted={this.plotNotedHandler}
            plotUpdate={() => this.plotUpdateHandler()}
            plotDeleted={(plotId) => this.plotDeletedHandler(plotId)}
          />
        </Sidebar>
        <Viewer feature={this.props.feature}></Viewer>
        <MapEditor></MapEditor>
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    feature: state.features.feature,
    loading: state.features.loading,
    added: state.features.added,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLoadFeature: (featureId) => dispatch(actions.getFeature(featureId)),
    onDeleteFeature: (featureId) => dispatch(actions.deleteFeature(featureId)),
    onUpdateFeature: (feature) => dispatch(actions.updateFeature(feature)),
    onUpdateFeatureInit: () => dispatch(actions.updateFeatureInit()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlotMap);
