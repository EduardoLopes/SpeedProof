import React, { useState, useEffect, useMemo} from "react";
import { Container, Table, Grid, Form, Icon, Button, Segment, Transition } from 'semantic-ui-react';
import styles from "./Tests.scss";
import Navbar from "../../components/Navbar/Navbar.js";
const electron = window.require("electron");
import moment from "moment";
import { NavLink } from "react-router-dom";
import collection from 'lodash/collection';
import _lang from 'lodash/lang';
import NoResultSearch from './NoResultSearch.js';
import Search from './Search.js';
import Charts from './Charts.js';

export default function Tests(){

  const [testsData, setTestsData] = useState([]);  
  const [chartData, setChartData] = useState([]);
  const [maxValueDownloadUpload, setMaxValueDownloadUpload] = useState(10);
  const [maxPing, setMaxPing] = useState(10);
  const [sorted, setSorted] = useState({
    column: '',
    direction: 'ascending'
  });


  function receiveData(event, data){

    setTestsData(data);

  }

  function receiveSearchData(event, data){

    setTestsData(data);

  }

  function handleSort(clickedColumn){

    if(sorted.column !== clickedColumn){

      setTestsData(collection.sortBy(testsData, [clickedColumn]));
      setSorted({
        column: clickedColumn,
        direction: 'ascending'
      });

      return;

    }

    setTestsData(testsData.reverse());

    setSorted({
      column: clickedColumn,
      direction: sorted.direction === 'ascending' ? 'descending' : 'ascending'
    });

  }

  useEffect(() => {

    const data = [];
    let maxValue = 10;
    let maxP = 0;

    testsData.forEach((test, index) => {

      data.push({
        name: moment(test.timestamp, moment.ISO_8601).format("dddd, MMMM Do YYYY, h:mm:ss a"),
        download: (test.download_bandwidth / 125000).toFixed(2),
        upload: (test.upload_bandwidth / 125000).toFixed(2),
        ping: test.ping_latency,
        milliseconds: test.timestamp_milliseconds
      });

      maxValue = Math.max(maxValue, (test.download_bandwidth / 125000));
      maxValue = Math.max(maxValue, (test.upload_bandwidth / 125000));
      maxP = Math.max(maxP, test.ping_latency);

    });

    setChartData(data);
    setMaxPing(maxP);
    setMaxValueDownloadUpload(maxValue);

  }, [testsData, sorted]);

  useEffect(() => {

    electron.ipcRenderer.send('request-tests-data', "data");
    electron.ipcRenderer.on('tests-data', receiveData);
    electron.ipcRenderer.on('tests-search-data', receiveSearchData);

    return () => {

      electron.ipcRenderer.removeListener('tests-data', receiveData);
      electron.ipcRenderer.removeListener('tests-search-data', receiveSearchData);

    }

  }, []);

  const tableRows = useMemo(() => testsData.map((test, index) => (
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
          <Icon name='arrow right' fitted size="small" />
        </NavLink>
      </Table.Cell>
    </Table.Row>
  )), [testsData]);

  return (
    <Container style={{ marginTop: "3em",  marginBottom: "3em" }}>
      
      <Navbar />      
      <Search />       
      {testsData.length === 0 && (<NoResultSearch />)}

      <Transition.Group animation="fade down" duration={800}>
      {chartData.length > 0 && (<Charts data={chartData} maxValueDownloadUpload={maxValueDownloadUpload} maxPing={maxPing} />)}
      </Transition.Group>

      {testsData.length > 0 && (<Table sortable celled compact striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell sorted={sorted.column === 'id' ? sorted.direction : null} onClick={handleSort.bind(this, 'id')}>#</Table.HeaderCell>
            <Table.HeaderCell sorted={sorted.column === 'ping_latency' ? sorted.direction : null} onClick={handleSort.bind(this, 'ping_latency')}>Ping</Table.HeaderCell>
            <Table.HeaderCell sorted={sorted.column === 'download_bandwidth' ? sorted.direction : null} onClick={handleSort.bind(this, 'download_bandwidth')}>Download</Table.HeaderCell>
            <Table.HeaderCell sorted={sorted.column === 'upload_bandwidth' ? sorted.direction : null} onClick={handleSort.bind(this, 'upload_bandwidth')}>Upload</Table.HeaderCell>
            <Table.HeaderCell sorted={sorted.column === 'isp' ? sorted.direction : null} onClick={handleSort.bind(this, 'isp')}>ISP</Table.HeaderCell>
            <Table.HeaderCell sorted={sorted.column === 'server_name' ? sorted.direction : null} onClick={handleSort.bind(this, 'server_name')}>Server</Table.HeaderCell>
            <Table.HeaderCell sorted={sorted.column === 'timestamp_milliseconds' ? sorted.direction : null} onClick={handleSort.bind(this, 'timestamp_milliseconds')}>When</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {tableRows}
        </Table.Body>
      </Table>)}

    </Container>
  );

};