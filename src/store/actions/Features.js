import * as actionTypes from "../actions/ActionTypes";
import axios from "../../axios";

export const setSelectedFeature = feature => {
  return {
    type: actionTypes.SET_SELECTEDFEATURE,
    feature: feature
  };
};

export const addFeatureInit = () => {
  return {
    type: actionTypes.ADD_FEATURE_INIT
  };
};

export const addFeatureStart = () => {
  return {
    type: actionTypes.ADD_FEATURE_START
  };
};

export const addFeatureSucces = error => {
  return {
    type: actionTypes.ADD_FEATURE_SUCCESS
  };
};

export const addFeatureFail = error => {
  return {
    type: actionTypes.ADD_FEATURE_FAIL,
    error: error
  };
};

export const addFeature = feature => {
  return dispatch => {
    dispatch(addFeatureStart());
    axios
      .post("/percelen", feature)
      .then(response => {
        console.log(response.data);
        dispatch(addFeatureSucces());
      })
      .catch(error => {
        dispatch(addFeatureFail(error));
      });
  };
};
