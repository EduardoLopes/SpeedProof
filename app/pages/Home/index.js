import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import _lang from 'lodash/lang';
import Navbar from '../../components/Navbar';
// import Tags from '../../components/Tags/Tags';
import Panel from '../../components/Panel';
import CanvasAnimation from '../../components/CanvasAnimation';
// import Footer from '../../components/Footer/Footer';
import useConfig from '../../hooks/useConfig';
import useRequestState from '../../hooks/useRequestState';
import usePingListener from '../../hooks/usePingListener';
import useDownloadListener from '../../hooks/useDownloadListener';
import useUploadListener from '../../hooks/useUploadListener';
import useTestStartListener from '../../hooks/useTestStartListener';
import useLastIDListener from '../../hooks/useLastIDListener';
import useErrorMessageListener from '../../hooks/useErrorMessageListener';
import styles from './Home.module.scss';

const electron = window.require('electron');
const storage = window.localStorage;

export default function Home() {
  const { t, i18n } = useTranslation();
  const { ping, pingProgress, resetPing } = usePingListener({
    latency: 0,
    jitter: 0,
  });

  const { download, downloadProgress, resetDownload } = useDownloadListener(0);
  const { upload, uploadProgress, resetUpload } = useUploadListener(0);
  const { testStart, resetTestStart } = useTestStartListener();
  const { lastID } = useLastIDListener();
  const { state, resetState } = useRequestState("idle");
  const { errorMessage, resetErrorMessage } = useErrorMessageListener();
  const { speedtestPath } = useConfig();

  function requestData() {
    electron.ipcRenderer.send('request-data', speedtestPath);

    resetDownload();
    resetUpload();
    resetPing();
    resetState();
    resetTestStart();
    resetErrorMessage();
  }

  useEffect(() => {
    if (!_lang.isNull(errorMessage)) {
      electron.ipcRenderer.send('kill-speedtest', 'data');
    }
  }, [errorMessage]);

  useEffect(() => {
    i18n.changeLanguage(storage.getItem('language') || i18n.language);

    window.scroll({
      top: 0,
      behavior: 'auto',
    });

    storage.setItem('scrollY', 0);

    return () => {
      electron.ipcRenderer.removeListener('result', receiveData);
      electron.ipcRenderer.removeListener('last-request-running', receiveWait);

      // kill speedtest process if it is running and the page is changed
      electron.ipcRenderer.send('kill-speedtest', 'data');
    };
  }, []);

  const [animationState, setAnimationState] = useState('idle');

  function handlePlayClick() {

    requestData();

  }


  return (
    <div className="layout">
      <Navbar />
      <div className="content">
        <div className={styles.top}>
          <div className="metter">
            <CanvasAnimation
              state={state}
              onPlayClick={handlePlayClick}
            />
          </div>
          <Panel />
        </div>
      </div>
    </div>
  );
}
