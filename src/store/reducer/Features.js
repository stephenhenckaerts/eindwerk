import * as actionTypes from "../actions/ActionTypes";
import { updateObject } from "../Utility";

const initialState = {
  feature: null,
  loading: false,
  added: false
};

export const setSelectedFeature = (state, action) => {
  return updateObject(state, {
    feature: action.feature
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
    default:
      return state;
  }
};

export default reducer;
