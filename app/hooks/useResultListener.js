import { use } from 'matter-js';
import { useEffect, useState } from 'react';

export default function useResultListener(initialState) {
  const [result, setResult] = useState(initialState);
  const [upload, setUpload] = useState(null);
  const [ping, setPing] = useState(null);
  const [download, setDownload] = useState(null);
  const [dataInterface, setDataInterface] = useState(null);
  const [isp, setIsp] = useState(null);
  const [server, setServer] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [type, setType] = useState(null);

  function resetResult() {
    setResult(null);
    setDownload(null);
    setUpload(null);
    setPing(null);
    setDataInterface(null);
    setIsp(null);
    setServer(null);
    setTimestamp(null);
    setType(null);
  }

  function receiveResult(event, data) {
    setResult(data);
    setDownload(data.download);
    setUpload(data.upload);
    setPing(data.isp);
    setDataInterface(data.interface);
    setIsp(data.isp);
    setServer(data.server);
    setTimestamp(data.timestamp);
    setType(data.type);
  }

  useEffect(() => {
    window.api.receive('result', receiveResult);
    return () => window.api.receiveOff('result', receiveResult);
  }, []);

  return { result, upload, ping, download, dataInterface, isp, result, server, timestamp, type, resetResult };
}
