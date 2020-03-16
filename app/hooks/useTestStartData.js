import { useEffect, useState } from 'react';

const electron = window.require('electron');

export default function useTestStart() {
  const [testStart, setTestStart] = useState(null);

  function resetTestStart() {
    setTestStart(null);
  }

  function receive(event, data) {
    setTestStart(data);
  }

  useEffect(() => {
    electron.ipcRenderer.on('testStart', receive);
    return () => electron.ipcRenderer.removeListener('testStart', receive);
  }, []);

  return { testStart, resetTestStart };
}
