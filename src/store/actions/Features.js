import * as actionTypes from "../actions/ActionTypes";

export const setSelectedFeature = feature => {
  return {
    type: actionTypes.SET_SELECTEDFEATURE,
    feature: feature
  };
};
