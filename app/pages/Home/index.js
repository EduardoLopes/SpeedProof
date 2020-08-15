import React from 'react';
// import { useTranslation } from 'react-i18next';
// import _lang from 'lodash/lang';
import Navbar from '../../components/Navbar';
// import Tags from '../../components/Tags/Tags';
import Panel from '../../components/Panel';
// import Footer from '../../components/Footer/Footer';
// import useConfig from '../../hooks/useConfig';
// import usePingListener from '../../hooks/usePingListener';
// import useDownloadListener from '../../hooks/useDownloadListener';
// import useUploadListener from '../../hooks/useUploadListener';
// import useTestStartListener from '../../hooks/useTestStartListener';
// import useLastIDListener from '../../hooks/useLastIDListener';
// import useErrorMessageListener from '../../hooks/useErrorMessageListener';
import styles from './Home.scss';

// const electron = window.require('electron');
// const storage = window.localStorage;

export default function Home() {
  // const { t, i18n } = useTranslation();

  // const [startButton, setStartButton] = useState({
  //   color: 'green',
  //   disabled: true,
  //   content: t('pleaseWait'),
  // });

  // const { ping, pingProgress, resetPing } = usePingListener({
  //   latency: 0,
  //   jitter: 0,
  // });
  // const { download, downloadProgress, resetDownload } = useDownloadListener(0);
  // const { upload, uploadProgress, resetUpload } = useUploadListener(0);
  // const { testStart, resetTestStart } = useTestStartListener();
  // const { lastID } = useLastIDListener();
  // const { errorMessage, resetErrorMessage } = useErrorMessageListener();
  // const { speedtestPath } = useConfig();

  // function requestData() {
  //   electron.ipcRenderer.send('request-data', speedtestPath);

  //   setStartButton({
  //     disabled: true,
  //     loading: true,
  //     content: t('loading'),
  //   });

  //   resetDownload();
  //   resetUpload();
  //   resetPing();
  //   resetTestStart();
  //   resetErrorMessage();
  // }

  // useEffect(() => {
  //   if (!_lang.isNull(speedtestPath)) {
  //     setStartButton({
  //       disabled: false,
  //       color: 'green',
  //       loading: false,
  //       content: t('startTest'),
  //     });
  //   }
  // }, [speedtestPath]);

  // function receiveData() {
  //   setStartButton({
  //     disabled: false,
  //     color: 'green',
  //     loading: false,
  //     content: t('startTest'),
  //   });
  // }

  // function receiveWait() {
  //   setStartButton({
  //     disabled: true,
  //     content: t('pleaseWait'),
  //   });
  // }

  // useEffect(() => {
  //   if (!_lang.isNull(errorMessage)) {
  //     electron.ipcRenderer.send('kill-speedtest', 'data');

  //     setStartButton({
  //       disabled: false,
  //       color: 'green',
  //       loading: false,
  //       content: t('startTest'),
  //     });
  //   }
  // }, [errorMessage]);

  // useEffect(() => {
  //   i18n.changeLanguage(storage.getItem('language') || i18n.language);

  //   electron.ipcRenderer.on('result', receiveData);
  //   electron.ipcRenderer.on('last-request-running', receiveWait);

  //   window.scroll({
  //     top: 0,
  //     behavior: 'auto',
  //   });

  //   storage.setItem('scrollY', 0);

  //   return () => {
  //     electron.ipcRenderer.removeListener('result', receiveData);
  //     electron.ipcRenderer.removeListener('last-request-running', receiveWait);

  //     // kill speedtest process if it is running and the page is changed
  //     electron.ipcRenderer.send('kill-speedtest', 'data');
  //   };
  // }, []);

  return (
    <div className="layout">
      <Navbar />
      <div className="content">
        <div className={styles.top}>
          <div className="metter" />
          <Panel />
        </div>
      </div>
    </div>
  );
}
