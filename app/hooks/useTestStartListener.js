import { useEffect, useState } from 'react';

export default function useTestStart() {
  const [testStart, setTestStart] = useState(null);

  function resetTestStart() {
    setTestStart(null);
  }

  function receiver(event, data) {
    setTestStart(data);
  }

  useEffect(() => {
    window.api.receive('testStart', receiver);
    return () => window.api.receiveOff('testStart', receiver);
  }, []);

  return { testStart, resetTestStart };
}
