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
      .post("api/percelen", feature)
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
      .get("api/percelen" + query)
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

export const getFeatureInit = () => {
  return {
    type: actionTypes.GET_FEATURE_INIT,
  };
};

export const getFeatureStart = () => {
  return {
    type: actionTypes.GET_FEATURE_START,
  };
};

export const getFeatureSucces = (feature) => {
  return {
    type: actionTypes.GET_FEATURE_SUCCESS,
    feature: feature,
  };
};

export const getFeatureFail = (error) => {
  return {
    type: actionTypes.GET_FEATURE_FAIL,
    error: error,
  };
};

export const getFeature = (featureId) => {
  return (dispatch) => {
    dispatch(getFeatureStart());
    axios
      .get("api/percelen/" + featureId)
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
        if (loadedPlots.length < 1)
          dispatch(getFeatureFail("Feature Not Found!"));
        dispatch(getFeatureSucces(loadedPlots[0]));
      })
      .catch((error) => {
        dispatch(getFeatureFail(error));
      });
  };
};

export const deleteFeatureInit = () => {
  return {
    type: actionTypes.DELETE_FEATURE_INIT,
  };
};

export const deleteFeatureStart = () => {
  return {
    type: actionTypes.DELETE_FEATURE_START,
  };
};

export const deleteFeatureSucces = (feature) => {
  return {
    type: actionTypes.DELETE_FEATURE_SUCCESS,
    feature: feature,
  };
};

export const deleteFeatureFail = (error) => {
  return {
    type: actionTypes.DELETE_FEATURE_FAIL,
    error: error,
  };
};

export const deleteFeature = (featureId) => {
  return (dispatch) => {
    dispatch(deleteFeatureStart());
    axios
      .delete("api/percelen/" + featureId)
      .then((response) => {
        dispatch(deleteFeatureSucces());
      })
      .catch((error) => {
        dispatch(deleteFeatureFail(error));
      });
  };
};

export const updateFeatureInit = () => {
  return {
    type: actionTypes.UPDATE_FEATURE_INIT,
  };
};

export const updateFeatureStart = () => {
  return {
    type: actionTypes.UPDATE_FEATURE_START,
  };
};

export const updateFeatureSucces = (feature) => {
  return {
    type: actionTypes.UPDATE_FEATURE_SUCCESS,
    feature: feature,
  };
};

export const updateFeatureFail = (error) => {
  return {
    type: actionTypes.UPDATE_FEATURE_FAIL,
    error: error,
  };
};

export const updateFeature = (feature) => {
  return (dispatch) => {
    dispatch(updateFeatureStart());
    axios
      .put("api/percelen", feature)
      .then((response) => {
        const loadedPlot = {
          plotId: response.data.plotId,
          name: response.data.name,
          cropName: response.data.cropName,
          cropGroupName: response.data.cropGroupName,
          area: response.data.area,
          comments: response.data.comments,
          coords: response.data.coords,
          geometry: response.data.geometry,
        };
        dispatch(updateFeatureSucces(loadedPlot));
      })
      .catch((error) => {
        dispatch(updateFeatureFail(error));
      });
  };
};
