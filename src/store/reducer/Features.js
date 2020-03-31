import * as actionTypes from "../actions/ActionTypes";
import { updateObject } from "../Utility";

const initialState = {
  feature: null
};

export const setSelectedFeature = (state, action) => {
  return updateObject(state, {
    feature: action.feature
  });
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
