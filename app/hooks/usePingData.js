import { useEffect, useState } from 'react';

const electron = require('electron');

export default function usePing(initialState) {
  const [ping, setPing] = useState(initialState);
  const [pingProgress, setPingProgress] = useState(0);

  function resetPing() {
    setPing(initialState);
  }

  function receivePing(event, data) {
    setPing({
      latency: data.ping.latency,
      jitter: data.ping.jitter,
    });
    setPingProgress(data.ping.progress * 100);
  }

  useEffect(() => {
    electron.ipcRenderer.on('ping', receivePing);
    return () => {
      electron.ipcRenderer.removeListener('ping', receivePing);
    };
  }, []);

  return { ping, pingProgress, resetPing };
}
