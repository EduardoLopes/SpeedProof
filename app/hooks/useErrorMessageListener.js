import { useEffect, useState } from 'react';

export default function useTestStart() {
  const [errorMessage, setErrorMessage] = useState(null);

  function resetErrorMessage() {
    setErrorMessage(null);
  }

  function receiver(event, data) {
    setErrorMessage(data);
  }

  useEffect(() => {
    window.api.receive('speedtest-error', receiver);
    return () => window.api.receiveOff('speedtest-error', receiver);
  }, []);

  return { errorMessage, resetErrorMessage };
}
