import React, { useState, useEffect } from 'react';
import {
  Segment,
  Label,
  Icon,
  Statistic,
  Progress,
  Grid,
} from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Chart from './Chart';

function formatSpeed(speed) {
  return (
    <Statistic size="small">
      <Statistic.Value>{(speed / 125000).toFixed(2)}</Statistic.Value>
      <Statistic.Label>Mbps</Statistic.Label>
    </Statistic>
  );
}

function formatPing(time) {
  return (
    <Statistic size="small">
      <Statistic.Value>{Math.floor(time)}</Statistic.Value>
      <Statistic.Label>ms</Statistic.Label>
    </Statistic>
  );
}

export default function Panel(props) {
  const [pingData, setPingData] = useState([]);
  const [downloadData, setDownloadData] = useState([]);
  const [uploadData, setUploadData] = useState([]);
  const [maxDownload, setMaxDownload] = useState(0);
  const { t } = useTranslation();

  const {
    pingProgress,
    downloadProgress,
    uploadProgress,
    downloadSpeed,
    uploadSpeed,
    ping,
    rawPingData,
    rawPingJitterData,
    rawDownloadData,
    rawUploadData,
  } = props;

  useEffect(() => {
    if (downloadSpeed !== 0) {
      setDownloadData([
        ...downloadData,
        { download: parseFloat((downloadSpeed / 125000).toFixed(2)) },
      ]);

      setMaxDownload(
        Math.max(maxDownload, parseFloat((downloadSpeed / 125000).toFixed(2))),
      );
    }

    if (downloadSpeed === 0) {
      setDownloadData([]);
    }
  }, [downloadSpeed]);

  useEffect(() => {
    if (uploadSpeed !== 0) {
      setUploadData([
        ...uploadData,
        { upload: parseFloat((uploadSpeed / 125000).toFixed(2)) },
      ]);
    }

    if (uploadSpeed === 0) {
      setUploadData([]);
    }
  }, [uploadSpeed]);

  useEffect(() => {
    if (!rawPingData) {
      if (ping.latency !== 0 || ping.jitter !== 0) {
        setPingData([
          ...pingData,
          { latency: ping.latency, jitter: ping.jitter },
        ]);
      }

      if (ping.latency === 0 && ping.jitter === 0) {
        setPingData([]);
      }
    }
  }, [ping]);

  useEffect(() => {
    const data = [];
    let max = 0;

    if (rawDownloadData) {
      rawDownloadData.split(',').forEach((bandwidth) => {
        data.push({ download: parseFloat((bandwidth / 125000).toFixed(2)) });
        max = Math.max(max, parseFloat((bandwidth / 125000).toFixed(2)));
      });

      setDownloadData(data);
      setMaxDownload(max);
    }
  }, [rawDownloadData]);

  useEffect(() => {
    const data = [];

    if (rawUploadData) {
      rawUploadData.split(',').forEach((bandwidth) => {
        data.push({ upload: parseFloat((bandwidth / 125000).toFixed(2)) });
      });

      setUploadData(data);
    }
  }, [rawUploadData]);

  useEffect(() => {
    const latencyData = [];
    const data = [];

    if (rawPingData) {
      rawPingData.split(',').forEach((latency) => {
        latencyData.push(latency);
      });
    }

    if (rawPingJitterData) {
      rawPingJitterData.split(',').forEach((jitter, index) => {
        data.push({ latency: latencyData[index], jitter });
      });
    }

    setPingData(data);
  }, [rawPingData, rawPingJitterData]);

  return (
    <Grid columns={3} padded="vertically">
      <Grid.Column>
        <Segment.Group>
          <Segment size="massive" textAlign="center">
            <Label
              color="blue"
              size="large"
              attached="top"
              style={{ textAlign: 'left' }}
            >
              <Icon name="sync" />
              {' '}
              {t('ping')}
            </Label>
            {formatPing(ping.latency)}
          </Segment>
          <Segment style={{ padding: 0 }}>
            {pingProgress > 0 && (
              <Progress percent={pingProgress} attached="bottom" indicating />
            )}
            {pingData.length > 1 && (
              <Chart
                data={pingData}
                color="#2185d0"
                color2="#fbbd08"
                dataKey="latency"
                dataKey2="jitter"
              />
            )}
          </Segment>
        </Segment.Group>
      </Grid.Column>
      <Grid.Column>
        <Segment.Group>
          <Segment size="massive" textAlign="center">
            <Label
              color="violet"
              size="large"
              attached="top"
              style={{ textAlign: 'left' }}
            >
              <Icon name="download" />
              {' '}
              {t('download')}
            </Label>
            {formatSpeed(downloadSpeed)}
          </Segment>

          <Segment style={{ padding: 0 }}>
            {downloadProgress > 0 && (
              <Progress
                percent={downloadProgress}
                attached="bottom"
                indicating
              />
            )}
            {downloadData.length > 1 && (
              <Chart data={downloadData} color="#6435c9" dataKey="download" />
            )}
          </Segment>
        </Segment.Group>
      </Grid.Column>
      <Grid.Column>
        <Segment.Group>
          <Segment size="massive" textAlign="center">
            <Label
              color="teal"
              size="large"
              attached="top"
              style={{ textAlign: 'left' }}
            >
              <Icon name="upload" />
              {' '}
              {t('upload')}
            </Label>
            {formatSpeed(uploadSpeed)}
          </Segment>
          <Segment style={{ padding: 0 }}>
            {uploadProgress > 0 && (
              <Progress percent={uploadProgress} attached="bottom" indicating />
            )}
            {uploadData.length > 1 && (
              <Chart
                data={uploadData}
                color="#00b5ad"
                dataKey="upload"
                domain={[0, maxDownload]}
              />
            )}
          </Segment>
        </Segment.Group>
      </Grid.Column>
    </Grid>
  );
}

Panel.propTypes = {
  pingProgress: PropTypes.number,
  downloadProgress: PropTypes.number,
  uploadProgress: PropTypes.number,
  downloadSpeed: PropTypes.number.isRequired,
  uploadSpeed: PropTypes.number.isRequired,
  ping: PropTypes.objectOf(PropTypes.number).isRequired,
  rawDownloadData: PropTypes.string,
  rawUploadData: PropTypes.string,
  rawPingData: PropTypes.string,
  rawPingJitterData: PropTypes.string,
};

Panel.defaultProps = {
  pingProgress: 0,
  downloadProgress: 0,
  uploadProgress: 0,
  rawDownloadData: '',
  rawUploadData: '',
  rawPingData: '',
  rawPingJitterData: '',
};
