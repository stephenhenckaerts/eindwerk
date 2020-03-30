import React, { Component } from "react";

import styles from "./HomeMap.module.css";
import Viewer from "../../components/Viewer/Viewer";
import Sidebar from "../../components/Sidebar/Sidebar";
import MapEditor from "../../components/MapEditor/MapEditor";

class HomeMap extends Component {
  render() {
    return (
      <div>
        <Sidebar></Sidebar>
        <Viewer></Viewer>
        <MapEditor></MapEditor>
      </div>
    );
  }
}

export default HomeMap;
