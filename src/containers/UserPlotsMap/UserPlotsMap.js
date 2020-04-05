import React, { useState, useCallback, useMemo } from "react";

import Aux from "../../hoc/Aux/Aux";
import Viewer from "../../components/Viewer/Viewer";
import Sidebar from "../../components/Sidebar/Sidebar";
import MapEditor from "../../components/MapEditor/MapEditor";
import HomeSideBar from "../../components/Sidebar/UserPlotsSideBar/UserPlotsSideBar";

const UserPlotsMap = () => {
  const [loadedPlots, setLoadedPlots] = useState([]);

  const onLoadedPlots = useCallback(newLoadedPlots => {
    setLoadedPlots(newLoadedPlots);
  }, []);

  const viewer = useMemo(() => {
    return <Viewer loadedPlots={loadedPlots}></Viewer>;
  }, [loadedPlots]);

  return (
    <Aux>
      <Sidebar>
        <HomeSideBar onLoadedPlots={onLoadedPlots} />
      </Sidebar>
      {viewer}
      <MapEditor></MapEditor>
    </Aux>
  );
};

export default UserPlotsMap;
