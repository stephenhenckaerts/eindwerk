import React from "react";

import styles from "./Sidebar.module.scss";
import percelenLogo from "../../assets/Sidebar/polygon.png";
import lagenLogo from "../../assets/Sidebar/project.png";
import zoekenLogo from "../../assets/Sidebar/search.png";
import locatieLogo from "../../assets/Sidebar/pin.png";

const Sidebar = () => {
  return (
    <div className={styles.Sidebar}>
      <div className={styles.SidebarItem}>
        <img src={percelenLogo} alt="Percelen Logo" />
        <div className={styles.SidebarTitle}>
          <p>MIJN</p>
          <p>PERCELEN</p>
        </div>
      </div>
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

export default Sidebar;
