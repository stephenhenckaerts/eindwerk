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
  return updateObject(sate, { loading: false, added: false });
};

const addFeatureStart = (state, action) => {
  return updateObject(sate, { loading: false });
};

const addFeatureSuccess = (state, action) => {
  return updateObject(sate, { loading: false, added: true });
};

const addFeatureFail = (state, action) => {
  return updateObject(sate, { loading: false });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_SELECTEDFEATURE:
      return setSelectedFeature(state, action);
    default:
      return state;
  }
};

export default reducer;
