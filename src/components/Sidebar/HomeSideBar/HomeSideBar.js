import React from "react";

import { NavLink } from "react-router-dom";
import styles from "./HomeSideBar.module.scss";
import percelenLogo from "../../../assets/Sidebar/polygon.png";
import locationLogo from "../../../assets/Sidebar/search.png";
import pinLogo from "../../../assets/Sidebar/pin.png";

const HomeSideBar = (props) => {
  return (
    <div className={styles.Sidebar}>
      <NavLink to="/percelen" style={{ textDecoration: "none" }}>
        <div className={styles.SidebarItem}>
          <img src={percelenLogo} alt="Percelen Logo" />
          <div className={styles.SidebarTitle}>
            <p>MIJN</p>
            <p>PERCELEN</p>
          </div>
        </div>
      </NavLink>
      <div className={styles.SidebarBottom}>
        <div
          className={styles.SidebarItem}
          onClick={props.geoLocationClickedHandler}
        >
          <img src={pinLogo} alt="Percelen Logo" />
          <div className={styles.SidebarTitle}>
            <p>LOCATIE</p>
          </div>
        </div>
        <div
          className={styles.SidebarItem}
          onClick={props.locationClickedHandler}
        >
          <img src={locationLogo} alt="Percelen Logo" />
          <div className={styles.SidebarTitle}>
            <p>ZOEKEN</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSideBar;
