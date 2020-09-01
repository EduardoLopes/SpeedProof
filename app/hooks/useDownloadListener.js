import { useEffect, useState } from 'react';

export default function useDownloadData(initialState) {
  const [download, setDownload] = useState(initialState);
  const [downloadProgress, setDownloadProgress] = useState(0);

  function resetDownload() {
    setDownload(initialState);
    setDownloadProgress(0);
  }

  function receiveDownload(event, data) {
    setDownload(data.download.bandwidth);
    setDownloadProgress(data.download.progress * 100);
  }

  useEffect(() => {
    window.api.receive('download', receiveDownload);
    return () => window.api.receiveOff('download', receiveDownload);
  }, []);

  return { download, downloadProgress, resetDownload };
}
