import { useEffect, useState } from 'react';

const electron = window.require('electron');

export default function useTestStart() {
  const [lastID, setLastID] = useState(null);

  function resetLastID() {
    setLastID(null);
  }

  function receiver(event, data) {
    setLastID(parseInt(data, 10));
  }

  useEffect(() => {
    electron.ipcRenderer.on('last-id', receiver);
    return () => electron.ipcRenderer.removeListener('last-id', receiver);
  }, []);

  return { lastID, resetLastID };
}
