import React from "react";

import styles from "./CompareSidebar.module.scss";
import backLogo from "../../../assets/Sidebar/back.png";
import compareLogo from "../../../assets/CompareSidebar/compare.png";
import compareSelectedLogo from "../../../assets/CompareSidebar/compareSelected.png";
import { NavLink } from "react-router-dom";
import undoLogo from "../../../assets/CompareSidebar/undo.png";
import LayersMenu from "./LayersMenu/LayersMenu";

const CompareSideBar = (props) => {
  let plotPicker = (
    <div className={styles.SidebarItem}>
      <div className={styles.SidebarPlotAmount}>
        {props.amountOfPlots > 1 ? (
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
  );
  if (props.slideView) {
    plotPicker = null;
  }
  return (
    <div className={styles.Sidebar}>
      <NavLink
        to={"/perceel/" + props.plotId}
        style={{ textDecoration: "none" }}
      >
        <div className={styles.SidebarItem}>
          <img src={backLogo} alt="Percelen Logo" />
          <div className={styles.SidebarTitle}>
            <p>Overzicht</p>
          </div>
        </div>
      </NavLink>
      {plotPicker}
      <div className={styles.SidebarItem}>
        <div className={styles.ActivatedPlot}>
          <div
            className={[
              styles.PlotSquare,
              props.selectedPlotIndex === 1 ? styles.PlotSquareActive : null,
            ].join(" ")}
            onClick={() => props.setSelectedPlot(1)}
          ></div>
          {props.amountOfPlots >= 2 ? (
            <div
              className={[
                styles.PlotSquare,
                props.selectedPlotIndex === 2 ? styles.PlotSquareActive : null,
              ].join(" ")}
              onClick={() => props.setSelectedPlot(2)}
            ></div>
          ) : null}
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
      <div className={styles.SidebarItem}>
        <div
          className={[
            styles.ExportButton,
            props.slideView ? styles.ExportButtonSelected : null,
          ].join(" ")}
          onClick={() => props.slideViewClicked()}
        >
          <img
            src={props.slideView ? compareSelectedLogo : compareLogo}
            alt="Percelen Logo"
          />
          <p>
            <strong>SLIDE</strong>
          </p>
        </div>
      </div>
      <div className={styles.SidebarItem}>
        <div
          className={styles.ExportButton}
          onClick={() => props.menuItemClicked("normal")}
        >
          <img src={undoLogo} alt="Percelen Logo" />
          <p>
            <strong>RESET</strong>
          </p>
        </div>
      </div>
      <LayersMenu
        className={styles.LayersMenu}
        menuItemClicked={(item, layerinfo) =>
          props.menuItemClicked(item, layerinfo)
        }
        feature={props.feature}
      />
    </div>
  );
};

export default CompareSideBar;
