import React, { useCallback } from "react";

import styles from "./UserPlotsMap.module.scss";
import Aux from "../../hoc/Aux/Aux";
import Viewer from "../../components/Viewer/Viewer";
import Sidebar from "../../components/Sidebar/Sidebar";
import MapEditor from "../../components/MapEditor/MapEditor";
import HomeSideBar from "../../components/Sidebar/UserPlotsSideBar/UserPlotsSideBar";

const UserPlotsMap = () => {
  return (
    <Aux>
      <Sidebar>
        <HomeSideBar />
      </Sidebar>
      <Viewer></Viewer>
      <MapEditor></MapEditor>
    </Aux>
  );
};

export default UserPlotsMap;
