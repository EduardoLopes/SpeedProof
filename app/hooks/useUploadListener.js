import { useEffect, useState } from 'react';

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
    window.api.receive('upload', receiveUpload);
    return () => window.api.receiveOff('upload', receiveUpload);
  }, []);

  return { upload, uploadProgress, resetUpload };
}
