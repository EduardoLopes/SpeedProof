import React, { Suspense, useEffect } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { Dimmer, Loader } from 'semantic-ui-react';
import Home from './pages/home/Home';
import Tests from './pages/tests/Tests';
import Info from './pages/info/Info';
import Config from './pages/config/Config';
import Check from './pages/check/Check';
import About from './pages/about/About';
import useSpeedtestCheck from './hooks/useSpeedtestCheck';
import useConfig from './hooks/useConfig';

const electron = window.require('electron');

function App() {
  const speedtestIsValid = useSpeedtestCheck();
  const { speedtestLicense } = useConfig();

  useEffect(() => {
    window.addEventListener('beforeunload', () => {
      electron.ipcRenderer.send('before-unload', 'data');
    });
  }, []);

  const Overlay = () => (
    <Dimmer page inverted active>
      <Loader />
    </Dimmer>
  );

  return (
    <Suspense fallback={<Overlay />}>
      <Router>
        <Switch>
          <Route exact path="/">
            {speedtestIsValid && speedtestLicense ? <Home /> : <Check />}
          </Route>
          <Route exact path="/tests" component={Tests} />
          <Route exact path="/info/:id" component={Info} />
          <Route exact path="/config">
            {speedtestIsValid && speedtestLicense ? <Config /> : <Check />}
          </Route>
          <Route exact path="/about" component={About} />
        </Switch>
      </Router>
    </Suspense>
  );
}

export default App;
