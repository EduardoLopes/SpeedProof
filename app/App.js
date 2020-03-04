import React, { Suspense, useEffect, useState } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import _lang from 'lodash/lang';
import { Dimmer, Loader } from 'semantic-ui-react';
import Home from './pages/home/Home';
import Tests from './pages/tests/Tests';
import Info from './pages/info/Info';
import Config from './pages/config/Config';
import Check from './pages/check/Check';

const electron = window.require('electron');
const storage = window.localStorage;

function App() {
  const [speedtestBinExists, setSpeedtestBinExists] = useState(!!JSON.parse(storage.getItem('speedtest-exists-last-result')));

  function speedtestDownload() {
    electron.ipcRenderer.send('request-config-data');
  }

  function speedtestCheck(event, check) {
    setSpeedtestBinExists(check.exists === true && check.sha === true);
  }

  function receiveConfigData(event, data) {
    if (!_lang.isNull(data) && !_lang.isNull(data.speedtest_path)) {
      electron.ipcRenderer.send('check-speedtest', data.speedtest_path);
    } else {
      setSpeedtestBinExists(false);
    }
  }

  useEffect(() => {
    storage.setItem('speedtest-exists-last-result', speedtestBinExists);
  }, [speedtestBinExists]);

  useEffect(() => {
    window.addEventListener('beforeunload', () => {
      electron.ipcRenderer.send('before-unload', 'data');
    });

    electron.ipcRenderer.send('request-config-data');

    electron.ipcRenderer.on('speedtest-downloaded', speedtestDownload);
    electron.ipcRenderer.on('speedtest-ok', speedtestCheck);
    electron.ipcRenderer.on('config-data', receiveConfigData);

    return () => {
      electron.ipcRenderer.removeListener('speedtest-downloaded', speedtestDownload);
      electron.ipcRenderer.removeListener('speedtest-ok', speedtestCheck);
      electron.ipcRenderer.removeListener('config-data', receiveConfigData);
    };
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
