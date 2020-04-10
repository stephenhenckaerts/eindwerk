import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import Aux from "../../hoc/Aux/Aux";
import UserPlotViewer from "../../components/UserPlotViewer/UserPlotViewer";
import Sidebar from "../../components/Sidebar/Sidebar";
import MapEditor from "../../components/MapEditor/MapEditor";
import UserPlotsSideBar from "../../components/Sidebar/UserPlotsSideBar/UserPlotsSideBar";
import * as actions from "../../store/actions/Index";
import MapSpinner from "../../components/UI/MapSpinner/MapSpinner";

class UserPlotsMap extends Component {
  state = {
    hoveredFeature: null,
    hoveredSideBarFeature: null,
    redirect: null,
  };

  constructor(props) {
    super(props);
    this.props.getUserFeaturesInit();
  }

  componentDidMount() {}

  onLoadedPlots = (input) => {
    this.props.getUserFeatures(input);
  };

  featureSelectedHandler = (featureId) => {
    this.setState({ redirect: featureId });
  };

  featureHoveredHandler = (featureId) => {
    this.setState({ hoveredFeature: featureId });
  };

  hoveredSideBarFeatureHandler = (featureId) => {
    this.setState({ hoveredSideBarFeature: featureId });
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to={"/perceel/" + this.state.redirect} />;
    }
    let viewer = <MapSpinner />;
    if (this.props.added === true) {
      viewer = (
        <UserPlotViewer
          userFeatures={this.props.userFeatures}
          featureSelected={this.featureSelectedHandler}
          featureHovered={this.featureHoveredHandler}
          loading={this.props.loading}
          hoveredSideBarFeature={this.state.hoveredSideBarFeature}
        ></UserPlotViewer>
      );
    }
    return (
      <Aux>
        <Sidebar>
          <UserPlotsSideBar
            onLoadedPlots={this.onLoadedPlots}
            userFeatures={this.props.userFeatures}
            loading={this.props.loading}
            hoveredFeature={this.state.hoveredFeature}
            hoveredSideBarFeature={this.hoveredSideBarFeatureHandler}
            featureSelected={this.featureSelectedHandler}
          />
        </Sidebar>
        {viewer}
        <MapEditor></MapEditor>
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userFeatures: state.features.userFeatures,
    loading: state.features.loading,
    added: state.features.added,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserFeatures: (query) => dispatch(actions.getUserFeatures(query)),
    getUserFeaturesInit: () => dispatch(actions.getUserFeaturesInit()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserPlotsMap);
