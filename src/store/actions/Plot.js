import * as actionTypes from "../actions/ActionTypes";
import axios from "../../axios";

export const getPlotShapefileInit = () => {
  return {
    type: actionTypes.GET_PLOT_SHAPEFILE_INIT,
  };
};

export const getPlotShapefileStart = () => {
  return {
    type: actionTypes.GET_PLOT_SHAPEFILE_START,
  };
};

export const getPlotShapefileSucces = (shapefile) => {
  return {
    type: actionTypes.GET_PLOT_SHAPEFILE_SUCCESS,
    shapefile: shapefile,
  };
};

export const getPlotShapefileFail = (error) => {
  return {
    type: actionTypes.GET_PLOT_SHAPEFILE_FAIL,
    error: error,
  };
};

export const getPlotShapefile = (featureId) => {
  console.log(featureId);
  return (dispatch) => {
    dispatch(getPlotShapefileStart());
    axios
      .get("/api/getShapefile/" + featureId)
      .then((response) => {
        const shapefile = response.data;
        dispatch(getPlotShapefileSucces(shapefile));
      })
      .catch((error) => {
        dispatch(getPlotShapefileFail(error));
      });
  };
};

export const postPlotShapefileStart = () => {
  return {
    type: actionTypes.POST_PLOT_SHAPEFILE_START,
  };
};

export const postPlotShapefileSucces = () => {
  return {
    type: actionTypes.POST_PLOT_SHAPEFILE_SUCCESS,
  };
};

export const postPlotShapefileFail = (error) => {
  return {
    type: actionTypes.POST_PLOT_SHAPEFILE_FAIL,
    error: error,
  };
};

export const postPlotShapefile = (featureId, shapefile) => {
  return (dispatch) => {
    dispatch(postPlotShapefileStart());
    axios
      .post("/api/uploadShapefile/" + featureId, shapefile)
      .then((response) => {
        dispatch(postPlotShapefileSucces());
      })
      .catch((error) => {
        dispatch(postPlotShapefileFail(error));
      });
  };
};
