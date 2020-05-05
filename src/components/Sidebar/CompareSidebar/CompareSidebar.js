import React from "react";

import styles from "./CompareSidebar.module.scss";
import backLogo from "../../../assets/Sidebar/back.png";
import { NavLink } from "react-router-dom";
import Spinner from "../../UI/Spinner/Spinner";
import Button from "../../UI/Button/Button";

const CompareSideBar = (props) => {
  return (
    <div className={styles.Sidebar}>
      <NavLink to="/percelen" style={{ textDecoration: "none" }}>
        <div className={styles.SidebarItem}>
          <img src={backLogo} alt="Percelen Logo" />
          <div className={styles.SidebarTitle}>
            <p>Overzicht</p>
          </div>
        </div>
      </NavLink>
      <div className={styles.SidebarItem}>
        <div className={styles.SidebarPlotAmount}>
          <p>&lt;</p>
          <p>2</p>
          <p>></p>
        </div>
      </div>

      <div className={styles.ActivatedPlot}>
        <div
          className={[styles.PlotSquare, styles.PlotSquareActive].join(" ")}
        ></div>
        <div className={styles.PlotSquare}></div>
        <div className={styles.PlotSquareBreak}></div>
        <div className={styles.PlotSquare}></div>
        <div className={styles.PlotSquare}></div>
      </div>
    </div>
  );
};

export default CompareSideBar;
