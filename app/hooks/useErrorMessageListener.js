import { useEffect, useState } from 'react';

const electron = window.require('electron');

export default function useTestStart() {
  const [errorMessage, setErrorMessage] = useState(null);

  function resetErrorMessage() {
    setErrorMessage(null);
  }

  function receiver(event, data) {
    setErrorMessage(data);
  }

  useEffect(() => {
    electron.ipcRenderer.on('speedtest-error', receiver);
    return () => electron.ipcRenderer.removeListener('speedtest-error', receiver);
  }, []);

  return { errorMessage, resetErrorMessage };
}
