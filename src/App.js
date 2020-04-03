import React from "react";
import { Route, Switch } from "react-router-dom";

import HomeMap from "./containers/HomeMap/HomeMap";
import UserPlotsMap from "./containers/UserPlotsMap/UserPlotsMap";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/percelen" exact component={UserPlotsMap} />
        <Route path="/" exact component={HomeMap} />
      </Switch>
    </div>
  );
}

export default App;
