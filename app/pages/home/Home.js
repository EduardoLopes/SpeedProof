import React, { useState, useEffect, useMemo } from "react";
import styles from "./Home.scss";
import { Container, Button, Segment, Label, Icon, Progress, Message, Divider, Statistic, Grid, Form} from 'semantic-ui-react'
import Navbar from "../../components/Navbar/Navbar.js";
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
  const [testFinished, setTestFinished] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagsOnDB, setTagsOnDB] = useState([]);
  const [tagsInputValue, setTagsInputValue] = useState([]);
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
    setTestFinished(false);

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

  function formatSpeed(speed){

    return (
      <Statistic size='small'>
        <Statistic.Value>{speed.toFixed(2)}</Statistic.Value>
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

  function receivePing(event, data){

    setPing(data.ping.latency);
    setPingProgress(data.ping.progress * 100);

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

  function tagColor(tag){

    let color = "grey";

    color = tagsOnDB.includes(tag) ? 'green' : 'grey';

    if(tagsOnDB.includes(tag) && tags.includes(tag)){
      color = "green";
    }

    if(tagsOnDB.includes(tag) && tags.includes(tag) == false){
      color = "red";
    }

    return color;

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
      {/* <Progress percent={ (pingProgress + downloadProgress + uploadProgress) / 3} size='tiny' className="general" indicating/> */}
      <Segment.Group horizontal>
        <Segment size="massive" textAlign="center">
          <Progress percent={pingProgress} attached='bottom' indicating />
          <Label color='blue' size="large" attached='top' style={{textAlign: "left"}}>
          <Icon name='sync'/> Ping
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

      { lastID && (<Segment>

        <Form onSubmit={(event) => {

          setTagsOnDB(tags);
          setTagsInputValue(tags.toString());

          electron.ipcRenderer.send('update-tags', {
            id: lastID,
            tags: tags.toString()
          });

        }}>
            <Grid>
            <Grid.Column width={12}>
                <Form.Input
                  placeholder='Tags'
                  name='name'
                  value={tagsInputValue}
                  onChange={(event) => {

                    setTagsInputValue(event.target.value);

                    let splitedTags = event.target.value.split(",");

                    splitedTags = splitedTags.map((tag) => tag.trim());

                    splitedTags = splitedTags.filter((tag) => !(/^\s*$/.test(tag)));

                    splitedTags = [...new Set(splitedTags)];

                    setTags(splitedTags);


                  }}
                />
              </Grid.Column>
              <Grid.Column width={4}>
                <Form.Button style={{width: '100%'}} color="green" content={tagsOnDB.length === 0 ? 'Add tags' : 'Update tags'} />
              </Grid.Column>
            </Grid>
        </Form>
        {tags.length !== 0 || tagsOnDB.length !== 0 ? (<Divider/>) : ""}
        {[...new Set([...tags, ...tagsOnDB])].map((tag, index) => {
          return (<Label color={tagColor(tag)} className={ styles.tagsLable } key={index}>
            {tag}
          </Label>)
        })}

      </Segment>)}

    </Container>
  );

};