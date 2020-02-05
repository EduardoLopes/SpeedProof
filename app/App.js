import React, { Component } from "react";
import {
    HashRouter as Router,
    Switch,
    Route
  } from "react-router-dom";

import Home from "./pages/home/Home.js";
import Tests from "./pages/tests/Tests.js";

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/tests" component={Tests} />
        </Switch>
      </Router>
    );
  }
}
export default App;