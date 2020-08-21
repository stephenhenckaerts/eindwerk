import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import Viewer from "../../components/PlotViewer/PlotViewer";
import Sidebar from "../../components/Sidebar/Sidebar";
import MapEditor from "../../components/MapEditor/MapEditor";
import Aux from "../../hoc/Aux/Aux";
import Modal from "../../components/UI/Modal/Modal";
import FeatureForm from "../../components/FeatureForm/FeatureForm";
import DeleteFeatureForm from "../../components/DeleteFeatureForm/DeleteFeatureForm";
import * as actions from "../../store/actions/Index";
import PlotSidebar from "../../components/Sidebar/PlotSideBar/PlotSideBar";
import axios from "axios";
import Snackbar from "../../components/UI/Snackbar/Snackbar";

class PlotMap extends Component {
  state = {
    updatingFeature: false,
    featureDeleteClicked: false,
    featureDeleted: false,
    featureCompare: false,
    showNotes: false,
  };

  constructor(props) {
    super(props);
    this.plotId = this.props.match.params.plotId;
    this.props.onLoadFeature(this.plotId);

    this.snackbarSucessRef = React.createRef();
    this.snackbarDangerRef = React.createRef();
  }

  featureAddedHandler = (feature) => {
    this.setState({ Feature: true, selectedFeature: feature });
  };

  updateFeatureHandler = (feature) => {
    this.props.onUpdateFeatureInit();
    this.props.onUpdateFeature(feature);
    this.setState({ updatingFeature: false, selectedFeature: null });
    this.snackbarSucessHandler(feature.name + " aangepast!");
  };

  plotNotedHandler = () => {
    this.setState({ showNotes: !this.state.showNotes });
  };

  plotUpdateHandler() {
    this.setState({ updatingFeature: true });
  }

  updatingFeatureCancelHandler = () => {
    this.setState({ updatingFeature: false });
  };

  plotDeletedClickedHandler() {
    this.setState({ featureDeleteClicked: true });
  }

  deletingFeatureCancelHandler = () => {
    this.setState({ featureDeleteClicked: false });
  };

  plotDeletedHandler = () => {
    this.props.onDeleteFeature(this.plotId);
    this.setState({ featureDeleted: true });
  };

  plotCompareHandler = () => {
    this.setState({ featureCompare: true });
  };

  uploadShapefileHandler = (shapefile, type) => {
    axios
      .post(
        "http://localhost:3030/api/uploadShapefile/" + this.plotId + "&" + type,
        shapefile,
        {
          shapefile,
          type,
        }
      )
      .then((res) => {
        // then print response status
        this.props.onLoadFeature(this.plotId);
        this.snackbarSucessHandler("Shapefile toegevoegd!");
      });
  };

  snackbarSucessHandler = (message) => {
    this.snackbarSucessRef.current.openSnackBar(message);
  };

  snackbarDangerHandler = (message) => {
    this.snackbarDangerRef.current.openSnackBar(message);
  };

  render() {
    if (this.state.featureDeleted) {
      return <Redirect to={"/percelen"} />;
    }
    if (this.state.featureCompare) {
      return <Redirect to={"/vergelijk/" + this.plotId} />;
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
    let deleteSummary = null;
    if (this.state.featureDeleteClicked) {
      deleteSummary = (
        <DeleteFeatureForm
          selectedFeature={this.props.feature}
          formClosed={this.deletingFeatureCancelHandler}
          onDeleteFeature={this.plotDeletedHandler}
        ></DeleteFeatureForm>
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
        <Modal
          show={this.state.featureDeleteClicked}
          modalClosed={this.addingFeatureCancelHandler}
        >
          {deleteSummary}
        </Modal>
        <Sidebar>
          <PlotSidebar
            feature={this.props.feature}
            loading={this.props.loading}
            plotNoted={this.plotNotedHandler}
            plotCompare={this.plotCompareHandler}
            plotUpdate={() => this.plotUpdateHandler()}
            plotDeleted={(plotId) => this.plotDeletedClickedHandler(plotId)}
          />
        </Sidebar>
        <Viewer
          feature={this.props.feature}
          showNotes={this.state.showNotes}
          uploadShapefile={this.uploadShapefileHandler}
        ></Viewer>
        <MapEditor></MapEditor>{" "}
        <Snackbar ref={this.snackbarSucessRef} btnType="sucess" />
        <Snackbar ref={this.snackbarDangerRef} btnType="danger" />
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    feature: state.features.feature,
    loading: state.features.loading,
    added: state.features.added,
    shapefile: state.plot.shapefile,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLoadFeature: (featureId) => dispatch(actions.getFeature(featureId)),
    onDeleteFeature: (featureId) => dispatch(actions.deleteFeature(featureId)),
    onUpdateFeature: (feature) => dispatch(actions.updateFeature(feature)),
    onUpdateFeatureInit: () => dispatch(actions.updateFeatureInit()),
    onGetPlotShapefileInit: (featureId) =>
      dispatch(actions.getPlotShapefileInit(featureId)),
    onGetPlotShapefile: (featureId) =>
      dispatch(actions.getPlotShapefile(featureId)),
    onPostPlotShapfile: (featureId, shapefile) =>
      dispatch(actions.postPlotShapefile(featureId, shapefile)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlotMap);
