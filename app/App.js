import React, { Suspense, useEffect } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import { Dimmer, Loader } from 'semantic-ui-react';

import Home from './pages/home/Home';
import Tests from './pages/tests/Tests';
import Info from './pages/info/Info';
import Config from './pages/config/Config';

const electron = window.require('electron');

function App() {
  useEffect(() => {
    window.addEventListener('beforeunload', () => {
      electron.ipcRenderer.send('before-unload', 'data');
    });
  }, []);

  return (
    <Suspense
      fallback={(
        <Dimmer inverted active>
          <Loader />
        </Dimmer>
      )}
    >
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/tests" component={Tests} />
          <Route exact path="/info/:id" component={Info} />
          <Route exact path="/config" component={Config} />
        </Switch>
      </Router>
    </Suspense>
  );
}

export default App;
