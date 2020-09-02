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

  // const { t } = useTranslation();

  useEffect(() => {
    if (download !== 0) {
      setDownloadData([
        ...downloadData,
        { "data": (download / 125000) },
      ]);
    }

    if (download === 0) {
      setDownloadData([]);
    }
  }, [download]);

  useEffect(() => {
    if (upload !== 0) {
      setUploadData([
        ...uploadData,
        { "data": (upload / 125000) },
      ]);
    }

    if (upload === 0) {
      setUploadData([]);
    }
  }, [upload]);

  useEffect(() => {
    if (ping.latency !== 0) {
      setPingData([
        ...pingData,
        { "data2": ping.jitter, "data": ping.latency },
      ]);

    }

    if (ping.latency === 0) {
      setPingData([]);
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
        <Chart data={downloadData} progress={downloadProgress} color="#27ae60" dataKey="download" />
        <h2>Download</h2>
        <div className={styles.number}>
          <span>{parseFloat((download / 125000).toFixed(2))}</span>
          <div className={styles['data-type']}>mbps</div>
        </div>
      </div>
      <div className={styles.upload}>
      <Chart data={uploadData} progress={uploadProgress} color="#2f80ed" dataKey="upload" />
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
