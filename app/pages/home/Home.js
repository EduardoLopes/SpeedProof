import React, { useState, useEffect, useMemo } from "react";
import styles from "./Home.scss";
import { Container, Button, Icon} from 'semantic-ui-react'
const electron = window.require("electron");



export default function Home(){

  const [startButton, setStartButton] = useState({
    disabled: false,
    color: "green",
    content: "Start Test"
  });

  const [downloadProgress, setDownloadProgress] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [config, setConfig] = useState({});
  const [servers, setServers] = useState([{}]);
  const [bestServers, setBestServers] = useState([{}]);
  const [testServer, setTestServer] = useState({});
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [downloadSpeedProgress, setDownloadSpeedProgress] = useState(0);
  const [uploadSpeedProgress, setUploadSpeedProgress] = useState(0);


  function requestData(){

    electron.ipcRenderer.send('request-data', "date");

    setStartButton({
      disabled: true,
      loading: true,
      content: "Loading..."
    });

  }

  function receiveData(event, data){

    console.log(data);

    setStartButton({
      disabled: false,
      color: "green",
      loading: false,
      content: "Start Test"
    });

  };

  function downloadProgressReceiver(event, data){
    setDownloadProgress(data);
  }

  function uploadProgressReceiver(event, data){
    setUploadProgress(data);
  }

  function configReceiver(event, data){
    setConfig(data);
  }

  function serversReceiver(event, data){
    setServers(data);
  }

  function bestServersReceiver(event, data){
    setBestServers(data);
  }

  function testServerReceiver(event, data){
    setTestServer(data);
  }

  function downloadSpeedReceiver(event, data){
    setDownloadSpeed(data);
  }

  function uploadSpeedReceiver(event, data){
    setUploadSpeed(data);
  }

  function downloadSpeedProgressReceiver(event, data){
    setDownloadSpeedProgress(data);
  }

  function uploadProgressSpeedReceiver(event, data){
    setUploadSpeedProgress(data);
  }

   const lists = useMemo(() => {

    return Object.keys(config).map(function(key, index) {

      const lis = Object.keys(config[key]).map(function(key_2, index_2) {

        return (
          <li key={`${key_2}-${index_2}`}>{key_2}: <b>{config[key][key_2]}</b></li>
        );

      });

      return (
        <ul key={`${key}-${index}`}>
          <b style={{textTransform: "uppercase"}}>{key}</b>: {lis}
        </ul>
      );

    });

  }, [config]);

  useEffect(() => {

    electron.ipcRenderer.on('data', receiveData);
    electron.ipcRenderer.on('download-progress', downloadProgressReceiver);
    electron.ipcRenderer.on('upload-progress', uploadProgressReceiver);
    electron.ipcRenderer.on('config', configReceiver);
    electron.ipcRenderer.on('servers', serversReceiver);
    electron.ipcRenderer.on('best-servers', bestServersReceiver);
    electron.ipcRenderer.on('test-server', testServerReceiver);
    electron.ipcRenderer.on('download-speed', downloadSpeedReceiver);
    electron.ipcRenderer.on('upload-speed', uploadSpeedReceiver);
    electron.ipcRenderer.on('download-speed-progress', downloadSpeedProgressReceiver);
    electron.ipcRenderer.on('upload-speed-progress', uploadProgressSpeedReceiver);

    return () => {

      electron.ipcRenderer.removeListener('data', receiveData);
      electron.ipcRenderer.removeListener('download-progress', downloadProgressReceiver);
      electron.ipcRenderer.removeListener('upload-progress', uploadProgressReceiver);
      electron.ipcRenderer.removeListener('config', configReceiver);
      electron.ipcRenderer.removeListener('servers', serversReceiver);
      electron.ipcRenderer.removeListener('best-servers', bestServersReceiver);
      electron.ipcRenderer.removeListener('test-server', bestServersReceiver);
      electron.ipcRenderer.removeListener('download-speed', downloadSpeedReceiver);
      electron.ipcRenderer.removeListener('upload-speed', uploadSpeedReceiver);
      electron.ipcRenderer.removeListener('download-speed-progress', downloadSpeedProgressReceiver);
      electron.ipcRenderer.removeListener('upload-speed-progress', uploadProgressSpeedReceiver);

    }

  }, []);

  return (
    <Container style={{ marginTop: "3em",  marginBottom: "3em" }}>
      <Button {...startButton} icon size="huge" fluid={true} onClick={requestData} />
      <ul>
        <li>Download progress:  {downloadProgress}</li>
        <li>Upload progress: {uploadProgress}</li>
        <li>Download speed: {downloadSpeed}</li>
        <li>Upload speed: {uploadSpeed}</li>
        <li>Download speed progress: {downloadSpeedProgress}</li>
        <li>Upload speed progress: {uploadSpeedProgress}</li>
        <li>Config progress: {lists}</li>
      </ul>
    </Container>
  );

};