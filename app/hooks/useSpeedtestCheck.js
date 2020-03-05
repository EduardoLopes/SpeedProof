// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useCallback } from 'react';
import _lang from 'lodash/lang';
import useConfig from './useConfig';

const electron = window.require('electron');

export default function useSpeedtestCheck() {
  const [isValid, setIsValid] = useState(true);
  const { speedtestPath } = useConfig();

  function speedtestCheck(event, check) {
    setIsValid(check.exists === true && check.sha === true);
  }

  useEffect(() => {
    if (!_lang.isNull(speedtestPath)) {
      electron.ipcRenderer.send('check-speedtest', speedtestPath);
    }
  }, [speedtestPath]);

  useEffect(() => {
    electron.ipcRenderer.on('speedtest-check-result', speedtestCheck);
    return () => {
      electron.ipcRenderer.removeListener('speedtest-check-result', speedtestCheck);
    };
  }, []);

  return [isValid];
}
