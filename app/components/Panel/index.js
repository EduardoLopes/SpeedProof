import React from 'react';
import styles from './Panel.module.scss';
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

export default function Panel() {
  // const [pingData, setPingData] = useState([]);
  // const [downloadData, setDownloadData] = useState([]);
  // const [uploadData, setUploadData] = useState([]);
  // const [maxDownload, setMaxDownload] = useState(0);
  // const { t } = useTranslation();

  // const {
  //   pingProgress,
  //   downloadProgress,
  //   uploadProgress,
  //   downloadSpeed,
  //   uploadSpeed,
  //   ping,
  //   rawPingData,
  //   rawPingJitterData,
  //   rawDownloadData,
  //   rawUploadData,
  // } = props;

  // useEffect(() => {
  //   if (downloadSpeed !== 0) {
  //     setDownloadData([
  //       ...downloadData,
  //       { download: parseFloat((downloadSpeed / 125000).toFixed(2)) },
  //     ]);

  //     setMaxDownload(
  //       Math.max(maxDownload, parseFloat((downloadSpeed / 125000).toFixed(2))),
  //     );
  //   }

  //   if (downloadSpeed === 0) {
  //     setDownloadData([]);
  //   }
  // }, [downloadSpeed]);

  // useEffect(() => {
  //   if (uploadSpeed !== 0) {
  //     setUploadData([
  //       ...uploadData,
  //       { upload: parseFloat((uploadSpeed / 125000).toFixed(2)) },
  //     ]);
  //   }

  //   if (uploadSpeed === 0) {
  //     setUploadData([]);
  //   }
  // }, [uploadSpeed]);

  // useEffect(() => {
  //   if (!rawPingData) {
  //     if (ping.latency !== 0 || ping.jitter !== 0) {
  //       setPingData([
  //         ...pingData,
  //         { latency: ping.latency, jitter: ping.jitter },
  //       ]);
  //     }

  //     if (ping.latency === 0 && ping.jitter === 0) {
  //       setPingData([]);
  //     }
  //   }
  // }, [ping]);

  // useEffect(() => {
  //   const data = [];
  //   let max = 0;

  //   if (rawDownloadData) {
  //     rawDownloadData.split(',').forEach((bandwidth) => {
  //       data.push({ download: parseFloat((bandwidth / 125000).toFixed(2)) });
  //       max = Math.max(max, parseFloat((bandwidth / 125000).toFixed(2)));
  //     });

  //     setDownloadData(data);
  //     setMaxDownload(max);
  //   }
  // }, [rawDownloadData]);

  // useEffect(() => {
  //   const data = [];

  //   if (rawUploadData) {
  //     rawUploadData.split(',').forEach((bandwidth) => {
  //       data.push({ upload: parseFloat((bandwidth / 125000).toFixed(2)) });
  //     });

  //     setUploadData(data);
  //   }
  // }, [rawUploadData]);

  // useEffect(() => {
  //   const latencyData = [];
  //   const data = [];

  //   if (rawPingData) {
  //     rawPingData.split(',').forEach((latency) => {
  //       latencyData.push(latency);
  //     });
  //   }

  //   if (rawPingJitterData) {
  //     rawPingJitterData.split(',').forEach((jitter, index) => {
  //       data.push({ latency: latencyData[index], jitter });
  //     });
  //   }

  //   setPingData(data);
  // }, [rawPingData, rawPingJitterData]);

  return (
    <div className={styles.panel}>
      <div className={styles.ping}>
        <div>
          <h2>Ping</h2>
        </div>
        <div className={styles.number}>
          <span>39</span>
          <div className={styles['data-type']}>ms</div>
        </div>
      </div>
      <div className={styles.download}>
        <h2>Download</h2>
        <div className={styles.number}>
          <span>9.98</span>
          <div className={styles['data-type']}>mbps</div>
        </div>
      </div>
      <div className={styles.upload}>
        <h2>Upload</h2>
        <div className={styles.number}>
          <span>2.67</span>
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
