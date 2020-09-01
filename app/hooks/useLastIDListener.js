import { useEffect, useState } from 'react';

export default function useTestStart() {
  const [lastID, setLastID] = useState(null);

  function resetLastID() {
    setLastID(null);
  }

  function receiver(event, data) {
    setLastID(parseInt(data, 10));
  }

  useEffect(() => {
    window.api.receive('last-id', receiver);
    return () => window.api.receiveOff('last-id', receiver);
  }, []);

  return { lastID, resetLastID };
}
