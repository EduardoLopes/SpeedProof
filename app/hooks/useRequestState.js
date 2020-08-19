import { useEffect, useState } from 'react';

const electron = window.require('electron');

export default function useRequestState(initialState) {
  const [state, setState] = useState(initialState);

  function resetRequestState() {
    setState(initialState);
  }

  function setResuestState(state) {
    setState(state);
  }

  function receiveState(event, data) {
    setState(data);
  }

  useEffect(() => {
    electron.ipcRenderer.on('state', receiveState);
    return () => electron.ipcRenderer.removeListener('state', receiveState);
  }, []);

  return { state, resetRequestState, setResuestState};
}
