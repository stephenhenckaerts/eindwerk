import React from "react";

import styles from "./GradientInfo.module.scss";

const GradientInfo = (props) => {
  let values = [];
  for (let i = props.values.max * 10; i >= props.values.min; i--) {
    values.push(
      <li key={i} className={styles.GradientListValue}>
        {0 + i / 10 === 0 || 0 + i / 10 === 1 ? i / 10 + ".0" : 0 + i / 10}
      </li>
    );
  }
  let colors = null;
  switch (props.values.colorType) {
    case "plantheight":
      colors = {
        minColor: "#DF372B",
        avgColor: "#F5FBC4",
        maxColor: "#3582BA",
      };
      break;
    case "ndre":
      colors = {
        minColor: "#026500",
        avgColor: "#B8D315",
        maxColor: "#8C5D08",
      };
      break;
    case "ndvi":
      colors = {
        minColor: "#219B51",
        avgColor: "#FFFBB7",
        maxColor: "#D73027",
      };
      break;
    case "CGS_S2_NIR":
      colors = {
        minColor: "#fde725",
        avgColor: "#5ac864",
        maxColor: "#46085c",
      };
      break;
    case "CGS_S2_NDVI":
      colors = {
        minColor: "#006400",
        avgColor: "#AECD14",
        maxColor: "#936609",
      };
      break;
    case "CGS_S2_LAI":
      colors = {
        minColor: "#006400",
        avgColor: "#AECD14",
        maxColor: "#936609",
      };
      break;
    case "CGS_S2_FCOVER":
      colors = {
        minColor: "#006400",
        avgColor: "#AECD14",
        maxColor: "#936609",
      };
      break;
    case "CGS_S2_FAPAR":
      colors = {
        minColor: "#006400",
        avgColor: "#AECD14",
        maxColor: "#936609",
      };
      break;
    case "CGS_S1_GRD_SIGMA0":
      colors = {
        minColor: "#fde725",
        avgColor: "#5ac864",
        maxColor: "#46085c",
      };
      break;
    case "CGS_S1_COHERENCE":
      colors = {
        minColor: "#fde725",
        avgColor: "#5ac864",
        maxColor: "#46085c",
      };
      break;
    default:
      colors = {
        minColor: "#fde725",
        avgColor: "#5ac864",
        maxColor: "#46085c",
      };
      break;
  }

  return (
    <div className={styles.GradientDiv}>
      <div
        className={styles.GradientColor}
        style={{
          backgroundImage:
            "linear-gradient(" +
            colors.minColor +
            " 0%, " +
            colors.avgColor +
            " 50%, " +
            colors.maxColor +
            " 100%)",
        }}
      ></div>
      <ul>{values}</ul>
    </div>
  );
};

export default GradientInfo;
