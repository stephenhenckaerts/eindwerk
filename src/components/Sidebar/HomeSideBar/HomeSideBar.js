import React from "react";

import { NavLink } from "react-router-dom";
import styles from "./HomeSideBar.module.scss";
import percelenLogo from "../../../assets/Sidebar/polygon.png";

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
    </div>
  );
};

export default HomeSideBar;
