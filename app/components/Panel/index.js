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

  const {ping, download, downloadProgress, upload, uploadProgress} = props;

  // const [pingData, setPingData] = useState([]);
  const [downloadData, setDownloadData] = useState([]);
  const [uploadData, setUploadData] = useState([]);
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

  useEffect(() => {
    if (download !== 0) {
      setDownloadData([
        ...downloadData,
        { "data": Math.floor((download / 125000)) },
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
        { "data": Math.floor((upload / 125000)) },
      ]);
    }

    if (upload === 0) {
      setUploadData([]);
    }
  }, [upload]);

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

  // const downloadData = [
  //   {
  //     "data": 106,
  //   },
  //   {
  //     "data": 178,
  //   },
  //   {
  //     "data": 23,
  //   },
  //   {
  //     "data": 86,
  //   },
  //   {
  //     "data": 149,
  //   },
  //   {
  //     "data": 85,
  //   },
  //   {
  //     "data": 136,
  //   },
  //   {
  //     "data": 178,
  //   },
  //   {
  //     "data": 38,
  //   }
  // ];

  // console.log(downloadData);

  return (
    <div className={styles.panel}>
      <div className={styles.ping}>
        <Chart data={downloadData} color="#e6b31e" dataKey="ping" />
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
