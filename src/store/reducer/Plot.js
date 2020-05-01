import * as actionTypes from "../actions/ActionTypes";
import { updateObject } from "../Utility";

const initialState = {
  shapefile: null,
  loading: false,
  added: false,
};

const getPlotShapefileInit = (state, action) => {
  return updateObject(state, { loading: false, added: false });
};

const getPlotShapefileStart = (state, action) => {
  return updateObject(state, { loading: false });
};

const getPlotShapefileSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    added: true,
    shapefile: action.shapefile,
  });
};

const getPlotShapefileFail = (state, action) => {
  return updateObject(state, { loading: false });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_PLOT_SHAPEFILE_INIT:
      return getPlotShapefileInit(state, action);
    case actionTypes.GET_PLOT_SHAPEFILE_START:
      return getPlotShapefileStart(state, action);
    case actionTypes.GET_PLOT_SHAPEFILE_SUCCESS:
      return getPlotShapefileSuccess(state, action);
    case actionTypes.GET_PLOT_SHAPEFILE_FAIL:
      return getPlotShapefileFail(state, action);
    default:
      return state;
  }
};

export default reducer;
