import { useEffect, useState } from 'react';

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
    window.api.receive('state', receiveState);
    return () => window.api.receiveOff('state', receiveState);
  }, []);

  return { state, resetRequestState, setResuestState};
}
