import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import Viewer from "../../components/CompareViewer/CompareVIewer";
import Sidebar from "../../components/Sidebar/Sidebar";
import MapEditor from "../../components/MapEditor/MapEditor";
import Aux from "../../hoc/Aux/Aux";
import Modal from "../../components/UI/Modal/Modal";
import FeatureForm from "../../components/FeatureForm/FeatureForm";
import * as actions from "../../store/actions/Index";
import CompareSideBar from "../../components/Sidebar/CompareSidebar/CompareSidebar";

class CompareMap extends Component {
  state = {
    amountOfPlots: 1,
    selectedPlotIndex: 1,
    topLayers: ["normal", "normal", "normal", "normal"],
    slideView: false,
    slideAmount: 50,
    export: false,
  };

  constructor(props) {
    super(props);
    this.plotId = this.props.match.params.plotId;
    this.props.onLoadFeature(this.plotId);
  }

  changeAmountOfPlots = (amount) => {
    const newAmountOfPlots = this.state.amountOfPlots + amount;
    if (newAmountOfPlots > 0 && newAmountOfPlots <= 4) {
      this.setState({ amountOfPlots: newAmountOfPlots });
    }
    if (newAmountOfPlots < this.state.selectedPlotIndex) {
      this.setState({ selectedPlotIndex: 1 });
    }
  };

  setSelectedPlot = (index) => {
    if (index > 0 && index <= this.state.amountOfPlots) {
      this.setState({ selectedPlotIndex: index });
    }
  };

  menuItemClicked = (item, layerinfo) => {
    if (this.state.topLayers[this.state.selectedPlotIndex - 1] !== item) {
      let newLayers = this.state.topLayers.slice();
      if (item === "MapEO") {
        newLayers[this.state.selectedPlotIndex - 1] = {
          item,
          layerinfo,
          selectedDate: 0,
        };
      } else if (item === "Sentinel") {
        let dates = layerinfo.Dimension[0].values.split(",");
        newLayers[this.state.selectedPlotIndex - 1] = {
          item: item,
          name: layerinfo.Name,
          selectedDate: dates.length - 1,
          dates: dates,
        };
      } else {
        newLayers[this.state.selectedPlotIndex - 1] = item;
      }
      this.setState({ topLayers: newLayers });
    }
  };

  slideViewClicked = () => {
    let selectedPlotIndex = this.state.selectedPlotIndex;
    if (selectedPlotIndex > 2) {
      selectedPlotIndex = 2;
    }
    this.setState({
      slideView: !this.state.slideView,
      amountOfPlots: 2,
      selectedPlotIndex: selectedPlotIndex,
    });
  };

  slideAmountChangedHandler = (event) => {
    this.setState({ slideAmount: event.target.value });
  };

  exportButtonHandler = () => {
    this.setState({ export: true });
  };

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
          <CompareSideBar
            plotId={this.plotId}
            feature={this.props.feature}
            amountOfPlots={this.state.amountOfPlots}
            changeAmountOfPlots={this.changeAmountOfPlots}
            selectedPlotIndex={this.state.selectedPlotIndex}
            setSelectedPlot={this.setSelectedPlot}
            menuItemClicked={this.menuItemClicked}
            exportButtonHandler={this.exportButtonHandler}
            slideViewClicked={this.slideViewClicked}
            slideView={this.state.slideView}
            slideAmount={this.state.slideAmount}
            slideAmountChanged={this.slideAmountChangedHandler}
          />
        </Sidebar>
        <Viewer
          feature={this.props.feature}
          amountOfPlots={this.state.amountOfPlots}
          topLayers={this.state.topLayers}
          export={this.state.export}
          changeDateHandler={this.changeDateHandler}
          slideView={this.state.slideView}
          slideAmount={this.state.slideAmount}
        ></Viewer>
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
    shapefile: state.plot.shapefile,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLoadFeature: (featureId) => dispatch(actions.getFeature(featureId)),
    onDeleteFeature: (featureId) => dispatch(actions.deleteFeature(featureId)),
    onUpdateFeature: (feature) => dispatch(actions.updateFeature(feature)),
    onUpdateFeatureInit: () => dispatch(actions.updateFeatureInit()),
    onGetPlotShapefileInit: () => dispatch(actions.getPlotShapefileInit()),
    onGetPlotShapefile: (featureId) =>
      dispatch(actions.getPlotShapefile(featureId)),
    onPostPlotShapfile: (featureId, shapefile) =>
      dispatch(actions.postPlotShapefile(featureId, shapefile)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CompareMap);
