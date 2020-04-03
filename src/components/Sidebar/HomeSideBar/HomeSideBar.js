import React from "react";

import { NavLink } from "react-router-dom";
import styles from "./HomeSideBar.module.scss";
import percelenLogo from "../../../assets/Sidebar/polygon.png";
import lagenLogo from "../../../assets/Sidebar/project.png";
import zoekenLogo from "../../../assets/Sidebar/search.png";
import locatieLogo from "../../../assets/Sidebar/pin.png";

const HomeSideBar = () => {
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
      <div className={styles.SidebarItem}>
        <img src={lagenLogo} alt="Percelen Logo" />
        <div className={styles.SidebarTitle}>
          <p>PERCELEN</p>
        </div>
      </div>
      <div className={styles.SidebarBottom}>
        <div className={styles.SidebarItem}>
          <img src={zoekenLogo} alt="Percelen Logo" />
          <div className={styles.SidebarTitle}>
            <p>ZOEKEN</p>
          </div>
        </div>
        <div className={styles.SidebarItem}>
          <img src={locatieLogo} alt="Percelen Logo" />
          <div className={styles.SidebarTitle}>
            <p>LOCATIE</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSideBar;
