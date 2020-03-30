import * as actionTypes from "../actions/ActionTypes";

export const setTileLayer = layer => {
  return {
    type: actionTypes.SET_TILELAYER,
    layer: layer
  };
};
