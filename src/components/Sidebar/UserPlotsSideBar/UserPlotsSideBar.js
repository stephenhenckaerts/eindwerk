import React, { useState, useEffect, useRef } from "react";

import styles from "./UserPlotsSideBar.module.scss";
import percelenLogo from "../../../assets/Sidebar/polygon.png";
import backLogo from "../../../assets/Sidebar/back.png";
import { NavLink } from "react-router-dom";

const UserPlotsSideBar = () => {
  const [enteredFilter, setEnteredFilter] = useState("");
  const [loadedPlots, setLoadedPlots] = useState(null);
  const inputRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const query =
          enteredFilter.length === 0
            ? ""
            : `?orderBy="name"&equalTo="${enteredFilter}"`;
        fetch("https://percelen-9c13a.firebaseio.com//percelen.json" + query)
          .then(response => response.json())
          .then(responseData => {
            const loadedPlots = [];
            for (const key in responseData) {
              loadedPlots.push({
                plotId: responseData[key].plotId,
                name: responseData[key].name,
                cropName: responseData[key].cropName,
                cropGroupName: responseData[key].cropGroupName,
                area: responseData[key].area,
                comments: responseData[key].comments,
                coords: responseData[key].coords
              });
            }
            setLoadedPlots(loadedPlots);
            console.log(loadedPlots);
          });
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [enteredFilter, inputRef]);

  var userPlots = null;
  if (loadedPlots != null && loadedPlots.length > 0) {
    userPlots = (
      <div className={styles.PlotsDiv}>
        {loadedPlots.map(plot => (
          <div key={plot.plotId} className={styles.PlotDiv}>
            <h3>{plot.name}</h3>
            <h4>Gewas:</h4>
            <p>{plot.cropName}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.Sidebar}>
      <div className={styles.SidebarHeaderItem}>
        <img src={percelenLogo} alt="Percelen Logo" />
        <div className={styles.SidebarTitle}>
          <div className={styles.SidebarTitle}>
            <p>MIJN</p>
            <p>PERCELEN</p>
          </div>
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
            onChange={event => setEnteredFilter(event.target.value)}
          />
        </form>
      </div>
      {userPlots}
    </div>
  );
};

export default UserPlotsSideBar;
