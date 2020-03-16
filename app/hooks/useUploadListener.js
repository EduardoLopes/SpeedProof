import { useEffect, useState } from 'react';

const electron = window.require('electron');

export default function useUploadData(initialState) {
  const [upload, setUpload] = useState(initialState);
  const [uploadProgress, setUploadProgress] = useState(0);

  function resetUpload() {
    setUpload(initialState);
    setUploadProgress(0);
  }

  function receiveUpload(event, data) {
    setUpload(data.upload.bandwidth);
    setUploadProgress(data.upload.progress * 100);
  }

  useEffect(() => {
    electron.ipcRenderer.on('upload', receiveUpload);
    return () => electron.ipcRenderer.removeListener('upload', receiveUpload);
  }, []);

  return { upload, uploadProgress, resetUpload };
}
