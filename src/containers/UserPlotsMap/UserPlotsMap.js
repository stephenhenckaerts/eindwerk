import React, { Component } from "react";
import { connect } from "react-redux";

import Aux from "../../hoc/Aux/Aux";
import UserPlotViewer from "../../components/UserPlotViewer/UserPlotViewer";
import Sidebar from "../../components/Sidebar/Sidebar";
import MapEditor from "../../components/MapEditor/MapEditor";
import HomeSideBar from "../../components/Sidebar/UserPlotsSideBar/UserPlotsSideBar";
import * as actions from "../../store/actions/Index";
import MapSpinner from "../../components/UI/MapSpinner/MapSpinner";

class UserPlotsMap extends Component {
  constructor(props) {
    super(props);
    this.props.getUserFeaturesInit();
  }

  componentDidMount() {}

  onLoadedPlots = (input) => {
    this.props.getUserFeatures(input);
  };

  featureSelectedHandler = (featureId) => {
    console.log(featureId);
  };

  render() {
    let viewer = <MapSpinner />;
    if (this.props.added === true) {
      viewer = (
        <UserPlotViewer
          userFeatures={this.props.userFeatures}
          featureSelected={this.featureSelectedHandler}
          loading={this.props.loading}
        ></UserPlotViewer>
      );
    }
    return (
      <Aux>
        <Sidebar>
          <HomeSideBar
            onLoadedPlots={this.onLoadedPlots}
            userFeatures={this.props.userFeatures}
            loading={this.props.loading}
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
