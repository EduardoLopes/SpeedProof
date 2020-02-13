import React, { useState, useEffect, useMemo } from "react";
import styles from "./Home.scss";
import { Container, Button, Segment, Label, Icon, Message, Divider} from 'semantic-ui-react'
import Navbar from "../../components/Navbar/Navbar.js";
import Tags from "../../components/Tags/Tags.js";
import Panel from "../../components/Panel/Panel.js";
const electron = window.require("electron");

export default function Home(){

  const [startButton, setStartButton] = useState({
    disabled: false,
    color: "green",
    content: "Start Test"
  });

  const [pingProgress, setPingProgress] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [testServer, setTestServer] = useState(null);
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [ping, setPing] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [lastID, setLastID] = useState(null);


  function requestData(){

    electron.ipcRenderer.send('request-data', "date");

    setStartButton({
      disabled: true,
      loading: true,
      content: "Loading..."
    });

    setPingProgress(0);
    setDownloadProgress(0);
    setUploadProgress(0);
    setTestServer(null);
    setDownloadSpeed(0);
    setUploadSpeed(0);
    setPing(0);
    setErrorMessage(null);
    setLastID(null);

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

     }, 1000);


  };

  function receivePing(event, data){

    setPing(data.ping.latency);
    setPingProgress(data.ping.progress * 100);

  }

  function receiveDownload(event, data){

    setDownloadSpeed(data.download.bandwidth);
    setDownloadProgress(data.download.progress * 100);

  }

  function receiveUpload(event, data){

    setUploadSpeed(data.upload.bandwidth);
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

  function handleSpeedtestError(event, data){

    electron.ipcRenderer.send('before-unload', "data");

    setErrorMessage(data);

    setTimeout(() => {

      setStartButton({
        disabled: false,
        color: "green",
        loading: false,
        content: "Start Test"
      });

     }, 1000);

  }


  function receiveLastID(event, data){

    setLastID(data);

  }

  useEffect(() => {

    electron.ipcRenderer.on('ping', receivePing);
    electron.ipcRenderer.on('download', receiveDownload);
    electron.ipcRenderer.on('upload', receiveUpload);
    electron.ipcRenderer.on('testStart', receiveTestStart);
    electron.ipcRenderer.on('result', receiveData);
    electron.ipcRenderer.on('last-request-running', receiveWait);
    electron.ipcRenderer.on('speedtest-error', handleSpeedtestError);
    electron.ipcRenderer.on('last-id', receiveLastID);

    return () => {

      electron.ipcRenderer.removeListener('ping', receivePing);
      electron.ipcRenderer.removeListener('download', receiveDownload);
      electron.ipcRenderer.removeListener('upload', receiveUpload);
      electron.ipcRenderer.removeListener('testStart', receiveTestStart);
      electron.ipcRenderer.removeListener('result', receiveData);
      electron.ipcRenderer.removeListener('last-request-running', receiveWait);
      electron.ipcRenderer.removeListener('speedtest-error', handleSpeedtestError);
      electron.ipcRenderer.removeListener('last-id', receiveLastID);

      //kill speedtest process if it is running and the page is changed
      electron.ipcRenderer.send('before-unload', "data");

    }

  }, []);

  return (
    <Container style={{ marginTop: "3em",  marginBottom: "3em" }}>
      <Navbar testsItemDisabled={startButton.disabled}/>
      <Button {...startButton} icon size="huge" fluid={true} onClick={requestData} />
      {errorMessage && (<Message negative>
        <Message.Header>Error</Message.Header>
        <p>{errorMessage}</p>
      </Message>)}

      <Panel
        pingProgress={pingProgress}
        downloadProgress={downloadProgress}
        uploadProgress={uploadProgress}
        downloadSpeed={downloadSpeed}
        uploadSpeed={uploadSpeed}
        ping={ping}
      />

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

      <Tags id={lastID} />

    </Container>
  );

};