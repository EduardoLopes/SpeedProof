import React, {useState, useEffect} from 'react';
import styles from './Panel.module.scss';
import Chart from './Chart';
// import {
//   Segment,
//   Label,
//   Icon,
//   Statistic,
//   Progress,
//   Grid,
// } from 'semantic-ui-react';
// import { useTranslation } from 'react-i18next';
// import PropTypes from 'prop-types';
// import Chart from './Chart';

// function formatSpeed(speed) {
//   return (
//     <Statistic size="small">
//       <Statistic.Value>{(speed / 125000).toFixed(2)}</Statistic.Value>
//       <Statistic.Label>Mbps</Statistic.Label>
//     </Statistic>
//   );
// }

// function formatPing(time) {
//   return (
//     <Statistic size="small">
//       <Statistic.Value>{Math.floor(time)}</Statistic.Value>
//       <Statistic.Label>ms</Statistic.Label>
//     </Statistic>
//   );
// }

export default function Panel(props) {

  const {ping, pingProgress, download, downloadProgress, upload, uploadProgress} = props;

  const [pingData, setPingData] = useState([]);
  const [downloadData, setDownloadData] = useState([]);
  const [uploadData, setUploadData] = useState([]);
  const [maxDownload, setMaxDownload] = useState(0);
  const [maxUpload, setMaxUpload] = useState(0);

  // const { t } = useTranslation();

  useEffect(() => {
    if (download === 0) {
      setDownloadData([]);
      setMaxDownload(0);
    }

    if (download !== 0) {
      setDownloadData(prev => {
        prev[prev.length] = { "date": Date.now(), "data": (download / 125000) }
        return prev;
      });

      setMaxDownload(Math.max(download / 125000, maxDownload / 125000));
    }
  }, [download]);

  useEffect(() => {
    if (upload === 0) {
      setUploadData([]);
      setMaxUpload(0);
    }

    if (upload !== 0) {
      setUploadData(prev => {
        prev[prev.length] = { "date": Date.now(), "data": (upload / 125000) };
        return prev;
      });

      setMaxUpload(Math.max(upload / 125000, maxUpload / 125000));
    }
  }, [upload]);

  useEffect(() => {
    if (ping.latency === 0) {
      setPingData([]);
    }

    if (ping.latency !== 0) {
      setPingData(prev => {
        prev[prev.length] = { "date": Date.now(), "data": ping.latency, "data2": ping.jitter };
        return prev;
      });

    }
  }, [ping]);

  return (
    <div className={styles.panel}>
      <div className={styles.ping}>
        <Chart data={pingData} progress={pingProgress} color="#e6b31e" dataKey="ping" />
        <h2>Ping</h2>
        <div className={styles.number}>
          <span>{Math.floor(ping.latency)}</span>
          <div className={styles['data-type']}>ms</div>
        </div>
      </div>
      <div className={styles.download}>
        <Chart data={downloadData} progress={uploadProgress === 0 ? downloadProgress : 100} color="#27ae60" dataKey="download" maxYDomain={maxUpload} />
        <h2>Download</h2>
        <div className={styles.number}>
          <span>{parseFloat((download / 125000).toFixed(2))}</span>
          <div className={styles['data-type']}>mbps</div>
        </div>
      </div>
      <div className={styles.upload}>
      <Chart data={uploadData} progress={uploadProgress} color="#2f80ed" dataKey="upload" maxYDomain={maxDownload} />
        <h2>Upload</h2>
        <div className={styles.number}>
          <span>{parseFloat((upload / 125000).toFixed(2))}</span>
          <div className={styles['data-type']}>mbps</div>
        </div>
      </div>
    </div>
  );
}

// Panel.propTypes = {
//   pingProgress: PropTypes.number,
//   downloadProgress: PropTypes.number,
//   uploadProgress: PropTypes.number,
//   downloadSpeed: PropTypes.number.isRequired,
//   uploadSpeed: PropTypes.number.isRequired,
//   ping: PropTypes.objectOf(PropTypes.number).isRequired,
//   rawDownloadData: PropTypes.string,
//   rawUploadData: PropTypes.string,
//   rawPingData: PropTypes.string,
//   rawPingJitterData: PropTypes.string,
// };

// Panel.defaultProps = {
//   pingProgress: 0,
//   downloadProgress: 0,
//   uploadProgress: 0,
//   rawDownloadData: '',
//   rawUploadData: '',
//   rawPingData: '',
//   rawPingJitterData: '',
// };
