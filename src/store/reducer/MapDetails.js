import * as actionTypes from "../actions/ActionTypes";
import { updateObject } from "../Utility";

const initialState = {
  type: "OPENSTREETMAP",
  state: true
};

export const setTileLayer = (state, action) => {
  return updateObject(state, {
    type: action.layer
  });
};

export const setPlotBoundries = (state, action) => {
  return updateObject(state, {
    state: action.state
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_TILELAYER:
      return setTileLayer(state, action);
    case actionTypes.SET_PLOTBOUNDRIES:
      return setPlotBoundries(state, action);
    default:
      return state;
  }
};

export default reducer;
