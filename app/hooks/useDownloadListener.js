import { useEffect, useState } from 'react';

const electron = window.require('electron');

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
    electron.ipcRenderer.on('download', receiveDownload);
    return () => electron.ipcRenderer.removeListener('download', receiveDownload);
  }, []);

  return { download, downloadProgress, resetDownload };
}
