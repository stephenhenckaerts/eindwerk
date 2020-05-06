import React from "react";

import styles from "./CompareSidebar.module.scss";
import backLogo from "../../../assets/Sidebar/back.png";
import { NavLink } from "react-router-dom";
import Spinner from "../../UI/Spinner/Spinner";
import Button from "../../UI/Button/Button";
import Switch from "../../UI/Switch/Switch";
import Aux from "../../../hoc/Aux/Aux";
import exportLogo from "../../../assets/CompareSidebar/exportYellow.png";

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
          {props.amountOfPlots > 2 ? (
            <p
              className={styles.SidebarPlotAmountArrow}
              onClick={() => props.changeAmountOfPlots(-1)}
            >
              &lt;
            </p>
          ) : (
            <p></p>
          )}
          <p>{props.amountOfPlots}</p>
          {props.amountOfPlots < 4 ? (
            <p
              className={styles.SidebarPlotAmountArrow}
              onClick={() => props.changeAmountOfPlots(1)}
            >
              >
            </p>
          ) : (
            <p></p>
          )}
        </div>
      </div>

      <div className={styles.SidebarItem}>
        <div className={styles.ActivatedPlot}>
          <div
            className={[
              styles.PlotSquare,
              props.selectedPlotIndex === 1 ? styles.PlotSquareActive : null,
            ].join(" ")}
            onClick={() => props.setSelectedPlot(1)}
          ></div>
          <div
            className={[
              styles.PlotSquare,
              props.selectedPlotIndex === 2 ? styles.PlotSquareActive : null,
            ].join(" ")}
            onClick={() => props.setSelectedPlot(2)}
          ></div>
          {props.amountOfPlots === 4 ? (
            <div className={styles.PlotSquareBreak}></div>
          ) : null}
          {props.amountOfPlots >= 3 ? (
            <div
              className={[
                styles.PlotSquare,
                props.selectedPlotIndex === 3 ? styles.PlotSquareActive : null,
              ].join(" ")}
              onClick={() => props.setSelectedPlot(3)}
            ></div>
          ) : null}
          {props.amountOfPlots === 4 ? (
            <div
              className={[
                styles.PlotSquare,
                props.selectedPlotIndex === 4 ? styles.PlotSquareActive : null,
              ].join(" ")}
              onClick={() => props.setSelectedPlot(4)}
            ></div>
          ) : null}
        </div>
      </div>
      {props.amountOfPlots === 2 ? (
        <div className={styles.SidebarItem}>
          <div className={styles.SlideButton}>
            <p>
              <strong>SLIDE</strong>
            </p>
            <Switch switchType="export" />
          </div>
        </div>
      ) : null}
      <div className={styles.SidebarItem}>
        <a className={styles.ExportButton}>
          <img src={exportLogo} alt="Percelen Logo" />
          <p>
            <strong>EXPORT</strong>
          </p>
        </a>
      </div>
    </div>
  );
};

export default CompareSideBar;
