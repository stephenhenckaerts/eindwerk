import React, { useState, useEffect, useRef } from "react";

import styles from "./UserPlotsSideBar.module.scss";
import percelenLogo from "../../../assets/Sidebar/polygon.png";
import backLogo from "../../../assets/Sidebar/back.png";
import { NavLink } from "react-router-dom";
import Spinner from "../../UI/Spinner/Spinner";

const UserPlotsSideBar = (props) => {
  const { onLoadedPlots } = props;
  const [enteredFilter, setEnteredFilter] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        inputRef.current !== undefined &&
        enteredFilter === inputRef.current.value
      ) {
        const query =
          enteredFilter.length === 0 ? "" : `?equalTo=${enteredFilter}`;
        onLoadedPlots(query);
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [enteredFilter, inputRef, onLoadedPlots]);

  let userPlots = null;
  if (props.loading && props.userFeatures.length === 0) {
    userPlots = <Spinner />;
  } else {
    if (props.userFeatures != null && props.userFeatures.length > 0) {
      userPlots = (
        <div className={styles.PlotsDiv}>
          {props.userFeatures.map((plot) => (
            <div key={plot.plotId} className={styles.PlotDiv}>
              <h3>{plot.name}</h3>
              <p>{plot.cropName}</p>
              <p>{(plot.area / 10000).toFixed(2)} ha</p>
            </div>
          ))}
        </div>
      );
    }
  }

  return (
    <div className={styles.Sidebar}>
      <div className={styles.SidebarHeaderItem}>
        <img src={percelenLogo} alt="Percelen Logo" />
        <div className={styles.SidebarTopTitle}>
          <p>MIJN</p>
          <p>PERCELEN</p>
        </div>
      </div>
      <NavLink to="/" style={{ textDecoration: "none" }}>
        <div className={styles.SidebarItem}>
          <img src={backLogo} alt="Percelen Logo" />
          <div className={styles.SidebarTitle}>
            <p>Overzicht</p>
          </div>
        </div>
      </NavLink>
      <div className={styles.SearchBar}>
        <form>
          <input
            ref={inputRef}
            className={styles.InputElementSearchBar}
            placeholder="zoeken..."
            onChange={(event) => setEnteredFilter(event.target.value)}
          />
        </form>
      </div>
      {userPlots}
    </div>
  );
};

export default UserPlotsSideBar;
