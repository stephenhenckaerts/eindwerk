import * as actionTypes from "../actions/ActionTypes";
import { updateObject } from "../Utility";

const initialState = {
  type: "OPENSTREETMAP"
};

export const setTileLayer = (state, action) => {
  return updateObject(state, {
    type: action.layer
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_TILELAYER:
      return setTileLayer(state, action);
    default:
      return state;
  }
};

export default reducer;
