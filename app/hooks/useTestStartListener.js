import { useEffect, useState } from 'react';

const electron = window.require('electron');

export default function useTestStart() {
  const [testStart, setTestStart] = useState(null);

  function resetTestStart() {
    setTestStart(null);
  }

  function receiver(event, data) {
    setTestStart(data);
  }

  useEffect(() => {
    electron.ipcRenderer.on('testStart', receiver);
    return () => electron.ipcRenderer.removeListener('testStart', receiver);
  }, []);

  return { testStart, resetTestStart };
}
