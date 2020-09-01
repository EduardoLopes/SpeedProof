import { useEffect, useState } from 'react';

export default function usePing(initialState) {
  const [ping, setPing] = useState(initialState);
  const [pingProgress, setPingProgress] = useState(0);

  function resetPing() {
    setPing(initialState);
    setPingProgress(0);
  }

  function receivePing(event, data) {
    setPing({
      latency: data.ping.latency,
      jitter: data.ping.jitter,
    });
    setPingProgress(data.ping.progress * 100);
  }

  useEffect(() => {
    window.api.receive('ping', receivePing);
    return () => {
      window.api.receiveOff('ping', receivePing);
    };
  }, []);

  return { ping, pingProgress, resetPing };
}
