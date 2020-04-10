import * as actionTypes from "../actions/ActionTypes";
import { updateObject } from "../Utility";

const initialState = {
  feature: null,
  loading: false,
  added: false,
  userFeatures: [],
};

export const setSelectedFeature = (state, action) => {
  return updateObject(state, {
    feature: action.feature,
  });
};

const addFeatureInit = (state, action) => {
  return updateObject(state, { loading: false, added: false });
};

const addFeatureStart = (state, action) => {
  return updateObject(state, { loading: false });
};

const addFeatureSuccess = (state, action) => {
  return updateObject(state, { loading: false, added: true });
};

const addFeatureFail = (state, action) => {
  return updateObject(state, { loading: false });
};

const getUserFeaturesInit = (state, action) => {
  return updateObject(state, { loading: true, added: false });
};

const getUserFeaturesStart = (state, action) => {
  return updateObject(state, { loading: true, added: false });
};

const getUserFeaturesSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    added: true,
    userFeatures: action.features,
  });
};

const getUserFeaturesFail = (state, action) => {
  return updateObject(state, { loading: false });
};

const getFeatureInit = (state, action) => {
  return updateObject(state, { loading: true, added: false });
};

const getFeatureStart = (state, action) => {
  return updateObject(state, { loading: true, added: false });
};

const getFeatureSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    added: true,
    feature: action.feature,
  });
};

const getFeatureFail = (state, action) => {
  return updateObject(state, { loading: false });
};

const deleteFeatureInit = (state, action) => {
  return updateObject(state, { loading: true });
};

const deleteFeatureStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const deleteFeatureSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    feature: null,
  });
};

const deleteFeatureFail = (state, action) => {
  return updateObject(state, { loading: false });
};

const updateFeatureInit = (state, action) => {
  return updateObject(state, { loading: true });
};

const updateFeatureStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const updateFeatureSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    feature: action.feature,
  });
};

const updateFeatureFail = (state, action) => {
  return updateObject(state, { loading: false });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_SELECTEDFEATURE:
      return setSelectedFeature(state, action);
    case actionTypes.ADD_FEATURE_INIT:
      return addFeatureInit(state, action);
    case actionTypes.ADD_FEATURE_START:
      return addFeatureStart(state, action);
    case actionTypes.ADD_FEATURE_SUCCESS:
      return addFeatureSuccess(state, action);
    case actionTypes.ADD_FEATURE_FAIL:
      return addFeatureFail(state, action);
    case actionTypes.GET_USER_FEATURES_INIT:
      return getUserFeaturesInit(state, action);
    case actionTypes.GET_USER_FEATURES_START:
      return getUserFeaturesStart(state, action);
    case actionTypes.GET_USER_FEATURES_SUCCESS:
      return getUserFeaturesSuccess(state, action);
    case actionTypes.GET_USER_FEATURES_FAIL:
      return getUserFeaturesFail(state, action);
    case actionTypes.GET_FEATURE_INIT:
      return getFeatureInit(state, action);
    case actionTypes.GET_FEATURE_START:
      return getFeatureStart(state, action);
    case actionTypes.GET_FEATURE_SUCCESS:
      return getFeatureSuccess(state, action);
    case actionTypes.GET_FEATURE_FAIL:
      return getFeatureFail(state, action);
    case actionTypes.DELETE_FEATURE_INIT:
      return deleteFeatureInit(state, action);
    case actionTypes.DELETE_FEATURE_START:
      return deleteFeatureStart(state, action);
    case actionTypes.DELETE_FEATURE_SUCCESS:
      return deleteFeatureSuccess(state, action);
    case actionTypes.DELETE_FEATURE_FAIL:
      return deleteFeatureFail(state, action);
    case actionTypes.UPDATE_FEATURE_INIT:
      return updateFeatureInit(state, action);
    case actionTypes.UPDATE_FEATURE_START:
      return updateFeatureStart(state, action);
    case actionTypes.UPDATE_FEATURE_SUCCESS:
      return updateFeatureSuccess(state, action);
    case actionTypes.UPDATE_FEATURE_FAIL:
      return updateFeatureFail(state, action);
    default:
      return state;
  }
};

export default reducer;
