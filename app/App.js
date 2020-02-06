import React, { useEffect } from "react";
import {
    HashRouter as Router,
    Switch,
    Route
  } from "react-router-dom";

const electron = window.require("electron");

import Home from "./pages/home/Home.js";
import Tests from "./pages/tests/Tests.js";

function App() {

  useEffect(() => {

    window.addEventListener('beforeunload', evt => {

      electron.ipcRenderer.send('before-unload', "data");

    });

  }, []);

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/tests" component={Tests} />
      </Switch>
    </Router>
  );

}

export default App;