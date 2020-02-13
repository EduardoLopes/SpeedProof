import React, { useState, useEffect, useMemo} from "react";
import { Container, Table, Grid, Form, Icon, Button, Segment } from 'semantic-ui-react'
import styles from "./Tests.scss";
import Navbar from "../../components/Navbar/Navbar.js";
const electron = window.require("electron");
import moment from "moment";
import { NavLink } from "react-router-dom";
import { AreaChart, Area, CartesianGrid, XAxis,YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Tests(){

  const [testsData, setTestsData] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchByTag, setSearchByTag] = useState(true);
  const [searchByISP, setSearchByISP] = useState(true);
  const [searchByServerName, setSearchByServerName] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [maxValueDownloadUpload, setMaxValueDownloadUpload] = useState(10);
  const [maxPing, setMaxPing] = useState(10);


  function receiveData(event, data){

    setTestsData(data);

  }

  function handleOnSubmit(event){

    requestSearchData();

    if(searchKeyword.length == 0){
      electron.ipcRenderer.send('request-tests-data', "data");
    }

  }

  function requestSearchData(){

    if(searchKeyword.length > 0 && (searchByTag === true || searchByISP === true || searchByServerName === true)){

      electron.ipcRenderer.send('request-test-search-data', {
        keyword: searchKeyword,
        byTag: searchByTag,
        byISP: searchByISP,
        byServerName: searchByServerName
      });

    }

  }

  function receiveSearchData(event, data){

    setTestsData(data);

  }

  function handleSearchOnChange(event){

    setSearchKeyword(event.target.value);

  }

  useEffect(() => {

    requestSearchData();

    if(searchByTag === false && searchByISP === false && searchByServerName === false){
      electron.ipcRenderer.send('request-tests-data', "data");
    }

  }, [searchByTag, searchByISP, searchByServerName]);

  useEffect(() => {

    const data = [];
    let maxValue = 10;
    let maxP = 0;

    testsData.forEach((test, index) => {

      data.push({
        name: moment(test.timestamp, moment.ISO_8601).format("dddd, MMMM Do YYYY, h:mm:ss a"),
        download: (test.download_bandwidth / 125000).toFixed(2),
        upload: (test.upload_bandwidth / 125000).toFixed(2),
        ping: test.ping_latency
      });

      maxValue = Math.max(maxValue, (test.download_bandwidth / 125000));
      maxValue = Math.max(maxValue, (test.upload_bandwidth / 125000));
      maxP = Math.max(maxP, test.ping_latency);

    });

    data.reverse();

    setChartData(data);
    setMaxPing(maxP);
    setMaxValueDownloadUpload(maxValue);

  }, [testsData]);

  useEffect(() => {

    electron.ipcRenderer.send('request-tests-data', "data");
    electron.ipcRenderer.on('tests-data', receiveData);
    electron.ipcRenderer.on('tests-search-data', receiveSearchData);

    return () => {

      electron.ipcRenderer.removeListener('tests-data', receiveData);
      electron.ipcRenderer.removeListener('tests-search-data', receiveSearchData);

    }

  }, []);

  const testsRows = testsData.map((test, index) => (
      <Table.Row key={test.id}>
        <Table.Cell >{test.id}</Table.Cell>
        <Table.Cell singleLine>{Math.floor(test.ping_latency)} <span className={styles.headerCellSecondaryText}>ms</span></Table.Cell>
        <Table.Cell singleLine>{(test.download_bandwidth / 125000).toFixed(2)} <span className={styles.headerCellSecondaryText}>Mbps</span></Table.Cell>
        <Table.Cell singleLine>{(test.upload_bandwidth / 125000).toFixed(2)} <span className={styles.headerCellSecondaryText}>Mbps</span></Table.Cell>
        <Table.Cell>{test.isp}</Table.Cell>
        <Table.Cell>{test.server_name}</Table.Cell>
        <Table.Cell singleLine>{moment(test.timestamp, moment.ISO_8601).fromNow()}</Table.Cell>
        <Table.Cell selectable>
          <NavLink exact to={`/info/${test.id}`}>
            <Icon name='arrow right' />
          </NavLink>
        </Table.Cell>
      </Table.Row>
    ));

  return (
    <Container style={{ marginTop: "3em",  marginBottom: "3em" }}>
      <Navbar />
      <Segment>
        <Form onSubmit={handleOnSubmit}>
          <Grid>
            <Grid.Column width={12}>
              <Form.Input placeholder='Search' onChange={handleSearchOnChange} name='name' disabled={searchByTag == false && searchByISP == false && searchByServerName == false} />
            </Grid.Column>
            <Grid.Column width={4}>
              <Form.Button style={{width: '100%'}} color="blue" content='Search' disabled={searchByTag == false && searchByISP == false && searchByServerName == false} />
            </Grid.Column>
          </Grid>
          </Form>
          <Grid>
            <Grid.Column width={16} textAlign="right">
              <Button.Group size={'tiny'}>
                <Button color={searchByTag ? 'green' : 'grey'} onClick={()=>{

                  setSearchByTag(!searchByTag);

                  }}>By Tags</Button>
                <Button color={searchByISP ? 'green' : 'grey'} onClick={()=>{

                  setSearchByISP(!searchByISP);

                  }}>By ISP</Button>
                <Button color={searchByServerName ? 'green' : 'grey'} onClick={()=>{

                  setSearchByServerName(!searchByServerName);

                  }}>By Server Name</Button>
              </Button.Group>
            </Grid.Column>
          </Grid>
      </Segment>
      {chartData.length > 0 && (<Segment>
        <ResponsiveContainer width={"100%"} height={200}>
          <AreaChart data={chartData} >
            <defs>
              <linearGradient id="colorDownload" x1="0" y1="0" x2="0" y2="1">
                <stop offset="15%" stopColor="#6435c9" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#6435c9" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorUpload" x1="0" y1="0" x2="0" y2="1">
                <stop offset="15%" stopColor="#00b5ad" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#00b5ad" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <YAxis stroke="#ccc" type='number' width={ Math.floor(maxValueDownloadUpload).toString().length * 12}/>
            <XAxis dataKey="name" hide={true} />
            <Tooltip />
            {/* <CartesianGrid strokeDasharray="3 3" /> */}
            <Legend />
            <Area type="monotone" dataKey="download" stroke="#6435c9" fillOpacity={1} fill="url(#colorDownload)" />
            <Area type="monotone" dataKey="upload" stroke="#00b5ad" fillOpacity={1} fill="url(#colorUpload)" />
          </AreaChart>
        </ResponsiveContainer>
        <ResponsiveContainer width={"100%"} height={100}>
          <AreaChart data={chartData} >
            <defs>
              <linearGradient id="colorPing" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2185d0" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#2185d0" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <YAxis stroke="#ccc" type='number' width={ Math.floor(maxPing).toString().length * 12}/>
            <XAxis dataKey="name" hide={true} />
            <Tooltip />
            {/* <CartesianGrid strokeDasharray="3 3" /> */}
            <Legend />
            <Area type="monotone" dataKey="ping" stroke="#2185d0" fillOpacity={1} fill="url(#colorPing)" />
          </AreaChart>
        </ResponsiveContainer>
      </Segment>)}
      <Table celled padded>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>#</Table.HeaderCell>
            <Table.HeaderCell>Ping</Table.HeaderCell>
            <Table.HeaderCell>Download</Table.HeaderCell>
            <Table.HeaderCell>Upload</Table.HeaderCell>
            <Table.HeaderCell>ISP</Table.HeaderCell>
            <Table.HeaderCell>Server</Table.HeaderCell>
            <Table.HeaderCell>When</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {testsRows}
        </Table.Body>
      </Table>

    </Container>
  );

};