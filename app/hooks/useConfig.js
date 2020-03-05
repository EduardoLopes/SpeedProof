// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useCallback } from 'react';

const electron = window.require('electron');

export default function useConfig() {
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState(null);

  function receiveConfig(event, data) {
    setConfig({
      language: data.language,
      speedtestPath: data.speedtest_path,
      testChartLimit: data.tests_chart_limit,
      lastSave: data.last_save_timestamp,
    });
    setLoading(false);
  }

  function requestingConfig() {
    setLoading(true);
  }

  useEffect(() => {
    electron.ipcRenderer.send('request-config-data');
    electron.ipcRenderer.on('config-data', receiveConfig);
    electron.ipcRenderer.on('requesting-config-data', requestingConfig);
    return () => {
      electron.ipcRenderer.removeListener('config-data', receiveConfig);
      electron.ipcRenderer.removeListener('requesting-config-data', requestingConfig);
    };
  }, []);

  return [config, loading];
}
