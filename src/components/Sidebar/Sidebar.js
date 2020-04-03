import React from "react";

import styles from "./Sidebar.module.scss";

const Sidebar = props => {
  return <div className={styles.Sidebar}>{props.children}</div>;
};

export default Sidebar;
