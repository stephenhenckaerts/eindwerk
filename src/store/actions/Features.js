import * as actionTypes from "../actions/ActionTypes";
import axios from "../../axios";

export const setSelectedFeature = (feature) => {
  return {
    type: actionTypes.SET_SELECTEDFEATURE,
    feature: feature,
  };
};

export const addFeatureInit = () => {
  return {
    type: actionTypes.ADD_FEATURE_INIT,
  };
};

export const addFeatureStart = () => {
  return {
    type: actionTypes.ADD_FEATURE_START,
  };
};

export const addFeatureSucces = (error) => {
  return {
    type: actionTypes.ADD_FEATURE_SUCCESS,
  };
};

export const addFeatureFail = (error) => {
  return {
    type: actionTypes.ADD_FEATURE_FAIL,
    error: error,
  };
};

export const addFeature = (feature) => {
  return (dispatch) => {
    dispatch(addFeatureStart());
    axios
      .post("/percelen", feature)
      .then((response) => {
        dispatch(addFeatureSucces());
      })
      .catch((error) => {
        dispatch(addFeatureFail(error));
      });
  };
};

export const getUserFeaturesInit = () => {
  return {
    type: actionTypes.GET_USER_FEATURES_INIT,
  };
};

export const getUserFeaturesStart = () => {
  return {
    type: actionTypes.GET_USER_FEATURES_START,
  };
};

export const getUserFeaturesSucces = (features) => {
  return {
    type: actionTypes.GET_USER_FEATURES_SUCCESS,
    features: features,
  };
};

export const getUserFeaturesFail = (error) => {
  return {
    type: actionTypes.GET_USER_FEATURES_FAIL,
    error: error,
  };
};

export const getUserFeatures = (query) => {
  return (dispatch) => {
    dispatch(getUserFeaturesStart());
    axios
      .get("/percelen" + query)
      .then((response) => {
        const loadedPlots = [];
        for (const key in response.data) {
          loadedPlots.push({
            plotId: response.data[key].plotId,
            name: response.data[key].name,
            cropName: response.data[key].cropName,
            cropGroupName: response.data[key].cropGroupName,
            area: response.data[key].area,
            comments: response.data[key].comments,
            coords: response.data[key].coords,
            geometry: response.data[key].geometry,
          });
        }
        dispatch(getUserFeaturesSucces(loadedPlots));
      })
      .catch((error) => {
        dispatch(getUserFeaturesFail(error));
      });
  };
};
