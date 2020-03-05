// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useCallback } from 'react';

const electron = window.require('electron');

export default function useConfig() {
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState(null);
  const [speedtestPath, setSpeedtestPath] = useState(null);
  const [testChartLimit, setTestChartLimit] = useState(null);
  const [lastSave, setLastSave] = useState(null);

  const receiveConfig = useCallback((event, data) => {
    setLanguage(data.language);
    setSpeedtestPath(data.speedtest_path);
    setTestChartLimit(data.tests_chart_limit);
    setLastSave(data.last_save_timestamp);
    setLoading(false);
  }, []);

  const requestingConfig = useCallback(() => {
    setLoading(true);
  }, []);

  useEffect(() => {
    electron.ipcRenderer.send('request-config-data');
    electron.ipcRenderer.on('config-data', receiveConfig);
    electron.ipcRenderer.on('requesting-config-data', requestingConfig);

    return () => {
      electron.ipcRenderer.removeListener('config-data', receiveConfig);
      electron.ipcRenderer.removeListener('requesting-config-data', requestingConfig);
    };
  }, []);

  return {
    loading,
    language,
    speedtestPath,
    testChartLimit,
    lastSave,
  };
}
