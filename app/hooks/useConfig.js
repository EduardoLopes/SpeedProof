// eslint-disable-next-line no-unused-vars
import { useState, useEffect, useCallback } from 'react';

export default function useConfig() {
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState(null);
  const [speedtestPath, setSpeedtestPath] = useState(null);
  const [testChartLimit, setTestChartLimit] = useState(null);
  const [speedtestLicense, setSpeedtestLicense] = useState(true);
  const [lastSave, setLastSave] = useState(null);

  const receiveConfig = useCallback((event, data) => {
    setLanguage(data.language);
    setSpeedtestPath(data.speedtest_path);
    setTestChartLimit(data.tests_chart_limit);
    setLastSave(data.last_save_timestamp);
    setSpeedtestLicense(data.accept_speedtest_license === 1);
    setLoading(false);
  }, []);

  const requestingConfig = useCallback(() => {
    setLoading(true);
  }, []);

  useEffect(() => {
    window.api.send('request-config-data');
    window.api.receive('config-data', receiveConfig);
    window.api.receive('requesting-config-data', requestingConfig);

    return () => {
      window.api.receiveOff('config-data', receiveConfig);
      window.api.receiveOff('requesting-config-data', requestingConfig);
    };
  }, []);

  return {
    loading,
    language,
    speedtestPath,
    testChartLimit,
    lastSave,
    speedtestLicense,
  };
}
