import React from "react";
import { Route, Switch } from "react-router-dom";

import HomeMap from "./containers/HomeMap/HomeMap";
import UserPlotsMap from "./containers/UserPlotsMap/UserPlotsMap";
import PlotMap from "./containers/PlotMap/PlotMap";
import CompareMap from "./containers/CompareMap/CompareMap";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/percelen" exact component={UserPlotsMap} />
        <Route path="/perceel/:plotId" exact component={PlotMap} />
        <Route path="/vergelijk/:plotId" exact component={CompareMap} />
        <Route path="/" exact component={HomeMap} />
      </Switch>
    </div>
  );
}

export default App;
