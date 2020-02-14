import React, { useState, useEffect } from 'react';
import { Segment, Label, Icon, Statistic, Progress, Grid} from 'semantic-ui-react'
import Chart from './Chart.js';
import styles from "./Panel.scss";

export default function Panel(props){

  const [pingData, setPingData] = useState([]);
  const [downloadData, setDownloadData] = useState([]);
  const [uploadData, setUploadData] = useState([]);
  const [maxDownload, setMaxDownload] = useState(0);

  function formatSpeed(speed){

    return (
      <Statistic size='small'>
        <Statistic.Value>{(speed / 125000).toFixed(2)}</Statistic.Value>
        <Statistic.Label>Mbps</Statistic.Label>
      </Statistic>
    );

  }

  function formatPing(time){

    return (
      <Statistic size='small'>
        <Statistic.Value>{Math.floor(time)}</Statistic.Value>
        <Statistic.Label>ms</Statistic.Label>
      </Statistic>
    );

  }

  const {
    pingProgress,
    downloadProgress,
    uploadProgress,
    downloadSpeed,
    uploadSpeed,
    ping } = props;

    useEffect(() => {

      if(downloadSpeed !== 0){
        setDownloadData(downloadData => [...downloadData, {download: parseFloat((downloadSpeed / 125000).toFixed(2))}]);
        setMaxDownload(Math.max(maxDownload, parseFloat((downloadSpeed / 125000).toFixed(2))));
      }

      if(downloadSpeed === 0){
        setDownloadData([]);
      }

    }, [downloadSpeed]);

    useEffect(() => {

      if(uploadSpeed !== 0){
        setUploadData(uploadData => [...uploadData, {upload: parseFloat((uploadSpeed / 125000).toFixed(2))}]);
      }

      if(uploadSpeed === 0){
        setUploadData([]);
      }

    }, [uploadSpeed]);

    useEffect(() => {

      if(ping !== 0){
        setPingData(pingData => [...pingData, {ping: ping}]);
      }

      if(ping === 0){
        setPingData([]);
      }

    }, [ping]);

    useEffect(() => {

      const data = [];
      let max = 0;

      if(props.downloadData){

        props.downloadData.split(",").forEach((bandwidth, index) => {
          data.push({download: parseFloat((bandwidth / 125000).toFixed(2))});

          max = Math.max(max, parseFloat((bandwidth / 125000).toFixed(2)));
        });

        setDownloadData(data);

        setMaxDownload(max);

      }

    }, [props.downloadData]);

    useEffect(() => {

      const data = [];

      if(props.uploadData){

        props.uploadData.split(",").forEach((bandwidth, index) => {
          data.push({upload: parseFloat((bandwidth / 125000).toFixed(2))});
        });

        setUploadData(data);

      }

    }, [props.uploadData]);

    useEffect(() => {

      const data = [];

      if(props.pingData){

        props.pingData.split(",").forEach((latency, index) => {
          data.push({ping: latency});
        });

        setPingData(data);

      }

    }, [props.pingData]);

  return (
    <Grid columns='equal' padded="vertically">
      <Grid.Row>
        <Grid.Column>
          <Segment.Group>
            <Segment size="massive" textAlign="center">

              <Label color='blue' size="large" attached='top' style={{textAlign: "left"}}>
              <Icon name='sync'/> Ping
              </Label>
              {formatPing(ping)}
            </Segment>
            <Segment style={{padding: 0}}>
              {pingProgress > 0 && (<Progress percent={pingProgress} attached='bottom' indicating />)}
              {pingData.length > 1 && (<Chart data={pingData} color="#2185d0" dataKey="ping"/>)}
            </Segment>
          </Segment.Group>
        </Grid.Column>
        <Grid.Column>
          <Segment.Group>

            <Segment size="massive" textAlign="center">
              <Label color='violet' size="large" attached='top' style={{textAlign: "left"}}>
              <Icon name='download'/> Download
              </Label>
              {formatSpeed(downloadSpeed)}
            </Segment>

            <Segment style={{padding: 0}}>
              {downloadProgress > 0 && (<Progress percent={downloadProgress} attached='bottom' indicating />)}
              {downloadData.length > 1 && (<Chart data={downloadData} color="#6435c9" dataKey="download"/>)}
            </Segment>

          </Segment.Group>
        </Grid.Column>
        <Grid.Column>
          <Segment.Group>
            <Segment size="massive" textAlign="center">
              <Label color='teal' size="large" attached='top' style={{textAlign: "left"}}>
              <Icon name='upload'/> Upload
              </Label>
              {formatSpeed(uploadSpeed)}
            </Segment>
            <Segment style={{padding: 0}}>
              {uploadProgress > 0 && (<Progress percent={uploadProgress} attached='bottom' indicating />)}
              {uploadData.length > 1 && (<Chart data={uploadData} color="#00b5ad" dataKey="upload" domain={[0, maxDownload]}/>)}
            </Segment>
          </Segment.Group>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );

}