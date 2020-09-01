// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useCallback } from 'react';
import _lang from 'lodash/lang';
import useConfig from './useConfig';

export default function useSpeedtestCheck() {
  const [isValid, setIsValid] = useState(false);
  const { speedtestPath } = useConfig();

  function speedtestCheck(event, check) {
    setIsValid(check.exists === true && check.sha === true);
  }

  useEffect(() => {
    if (!_lang.isNull(speedtestPath)) {
      window.api.send('check-speedtest', speedtestPath);
    } else {
      setIsValid(false);
    }
  }, [speedtestPath]);

  useEffect(() => {
    window.api.receive('speedtest-check-result', speedtestCheck);
    return () => window.api.receiveOff('speedtest-check-result', speedtestCheck);
  }, []);

  return isValid;
}
