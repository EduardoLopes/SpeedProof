import React, { Suspense, useEffect, useState } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import _lang from 'lodash/lang';
import { Dimmer, Loader } from 'semantic-ui-react';
import Home from './pages/home/Home';
import Tests from './pages/tests/Tests';
import Info from './pages/info/Info';
import Config from './pages/config/Config';
import Check from './pages/check/Check';
import useConfig from './hooks/useConfig';

const electron = window.require('electron');

function App() {
  const [speedtestBinExists, setSpeedtestBinExists] = useState(true);
  const [config] = useConfig();

  function speedtestDownload() {
    electron.ipcRenderer.send('request-config-data');
  }

  function speedtestCheck(event, check) {
    setSpeedtestBinExists(check.exists === true && check.sha === true);
  }

  useEffect(() => {
    if (!_lang.isNull(config)) {
      electron.ipcRenderer.send('check-speedtest', config.speedtestPath);
    }
  }, [config]);

  useEffect(() => {
    window.addEventListener('beforeunload', () => {
      electron.ipcRenderer.send('before-unload', 'data');
    });

    electron.ipcRenderer.on('speedtest-downloaded', speedtestDownload);
    electron.ipcRenderer.on('speedtest-ok', speedtestCheck);

    return () => {
      electron.ipcRenderer.removeListener('speedtest-downloaded', speedtestDownload);
      electron.ipcRenderer.removeListener('speedtest-ok', speedtestCheck);
    };
  }, []);

  const Overlay = () => <Dimmer page inverted active><Loader /></Dimmer>;

  return (
    <Suspense
      fallback={(
        <Overlay />
      )}
    >
      <Router>
        <Switch>
          <Route exact path="/">
            {speedtestBinExists ? <Home /> : <Check />}
          </Route>
          <Route exact path="/tests" component={Tests} />
          <Route exact path="/info/:id" component={Info} />
          <Route exact path="/config">
            {speedtestBinExists ? <Config /> : <Check />}
          </Route>
        </Switch>
      </Router>
    </Suspense>
  );
}

export default App;
