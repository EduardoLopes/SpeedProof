import React, { useState, useEffect, useMemo } from "react";
import styles from "./Home.scss";
import { Container, Button, Segment, Label, Icon, Progress, Grid, Divider, Statistic, Placeholder} from 'semantic-ui-react'
const electron = window.require("electron");



export default function Home(){

  const [startButton, setStartButton] = useState({
    disabled: false,
    color: "green",
    content: "Start Test"
  });

  const [downloadProgress, setDownloadProgress] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [testServer, setTestServer] = useState(null);
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [ping, setPing] = useState(0);


  function requestData(){

    electron.ipcRenderer.send('request-data', "date");

    setStartButton({
      disabled: true,
      loading: true,
      content: "Loading..."
    });

  }

  function receiveData(event, data){

    setStartButton({
      disabled: true,
      content: "Please wait"
    });

    setTimeout(() => {

      setStartButton({
        disabled: false,
        color: "green",
        loading: false,
        content: "Start Test"
      });

     }, 2000);


  };

  function formatSpeed(speed){

    return (
      <Statistic>
        <Statistic.Value>{speed.toFixed(2)}</Statistic.Value>
        <Statistic.Label>Mbps</Statistic.Label>
      </Statistic>
    );

  }

  function formatPing(time){

    return (
      <Statistic>
        <Statistic.Value>{Math.floor(time)}</Statistic.Value>
        <Statistic.Label>ms</Statistic.Label>
      </Statistic>
    );

  }

  function receivePing(event, data){

    setPing(data.ping.latency);

  }

  function receiveDownload(event, data){

    setDownloadSpeed(data.download.bandwidth / 125000);
    setDownloadProgress(data.download.progress * 100);

  }

  function receiveUpload(event, data){

    setUploadSpeed(data.upload.bandwidth / 125000);
    setUploadProgress(data.upload.progress * 100);

  }

  function receiveTestStart(event, data){

    setTestServer(data);

  }

  function receiveWait(event, data){

    setStartButton({
      disabled: true,
      content: "Please wait"
    });

  }


  useEffect(() => {

    electron.ipcRenderer.on('ping', receivePing);
    electron.ipcRenderer.on('download', receiveDownload);
    electron.ipcRenderer.on('upload', receiveUpload);
    electron.ipcRenderer.on('testStart', receiveTestStart);
    electron.ipcRenderer.on('result', receiveData);
    electron.ipcRenderer.on('last-request-running', receiveWait);


    return () => {

      electron.ipcRenderer.removeListener('ping', receivePing);
      electron.ipcRenderer.removeListener('download', receiveDownload);
      electron.ipcRenderer.removeListener('upload', receiveUpload);
      electron.ipcRenderer.removeListener('testStart', receiveTestStart);
      electron.ipcRenderer.removeListener('result', receiveData);
      electron.ipcRenderer.removeListener('last-request-running', receiveWait);

    }

  }, []);

  return (
    <Container style={{ marginTop: "3em",  marginBottom: "3em" }}>
      <Button {...startButton} icon size="huge" fluid={true} onClick={requestData} />
      <Segment.Group horizontal>
        <Segment size="massive" textAlign="center">
          <Label color='blue' size="large" attached='top' style={{textAlign: "left"}}>
          <Icon name='angle double right'/> Ping
          </Label>
          {formatPing(ping)}
        </Segment>
        <Segment size="massive" textAlign="center">
          <Progress percent={downloadProgress} attached='bottom' indicating />
          <Label color='violet' size="large" attached='top' style={{textAlign: "left"}}>
          <Icon name='download'/> Download
          </Label>
          {formatSpeed(downloadSpeed)}
        </Segment>
        <Segment size="massive" textAlign="center">
          <Progress percent={uploadProgress} attached='bottom' indicating />
          <Label color='teal' size="large" attached='top' style={{textAlign: "left"}}>
          <Icon name='upload'/> Upload
          </Label>
          {formatSpeed(uploadSpeed)}
        </Segment>
      </Segment.Group>

      <Segment size="big">

        <Label size="large" color="orange" ribbon>
          Client
        </Label>

        {testServer !== null ? testServer.isp : ""  }
        <Divider horizontal><Icon name='angle double down'/></Divider>

        <Label size="large" color="orange" ribbon>
          Server
        </Label>

        {testServer !== null ? `${testServer.server.name} ` : "" }
        {testServer !== null ? (<Label size="large"><Icon name='point' />{testServer.server.location}</Label>) : "" }

      </Segment>

    </Container>
  );

};