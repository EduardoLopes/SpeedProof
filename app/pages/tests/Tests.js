import React, { useState, useEffect, useMemo} from "react";
import { Container, Table, Grid, Form, Icon, Button, Segment, Transition, Pagination, Divider } from 'semantic-ui-react';
import styles from "./Tests.scss";
import Navbar from "../../components/Navbar/Navbar.js";
const electron = window.require("electron");
import moment from "moment";
import { NavLink } from "react-router-dom";
import collection from 'lodash/collection';
import _lang from 'lodash/lang';
import Search from './Search.js';
import Charts from './Charts.js';
import TableDataPlacehold from './TableDataPlacehold.js';
const storage = window.localStorage;



export default function Tests(){

  const [testsData, setTestsData] = useState([]);
  const [testsDataChart, setTestsDataChart] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [animateChart, setAnimateChart] = useState(false);
  const [maxValueDownloadUpload, setMaxValueDownloadUpload] = useState(10);
  const [maxPing, setMaxPing] = useState(10);
  const [totalPages, setTotalPages] = useState(10);
  const [sorted, setSorted] = useState( JSON.parse(storage.getItem('sorted')) || {
    column: 'id',
    direction: 'DESC'
  });

  const [activePage, setActivePage] = useState( storage.getItem('activePage') || 1);
  const [limit, setLimit] = useState(15);
  const [offset, setOffset] = useState( storage.getItem('offset') || 0);
  const [mode, setMode] = useState(storage.getItem('mode') || 'normal' ); //or search
  const [testsCount, setTestsCount] = useState(null);

  function receiveData(event, data){

    setTestsData(data);
    setMode('normal');

  }

  function receiveSearchData(event, data){

    setTestsData(data);

  }

  function receiveChartData(event, data){

    setTestsDataChart(data);

  }

  function handleSort(clickedColumn){

    setAnimateChart(true);

    if(sorted.column !== clickedColumn){

      setSorted({
        column: clickedColumn,
        direction: 'ASC'
      });

      return;

    }

    setSorted({
      column: clickedColumn,
      direction: sorted.direction === 'ASC' ? 'DESC' : 'ASC'
    });

  }

  function receiveTestsCount(event, data){

    setTestsCount(data[0].count);
    setTotalPages(Math.ceil(data[0].count / limit));

  }

  function getSortDirection(direction){

    return direction === 'ASC' ? 'descending' : 'ascending'

  }

  function handlePageChange(event, data){

    setOffset((data.activePage - 1) * limit);
    setActivePage(data.activePage);
    storage.setItem('activePage', data.activePage);

  }

  useEffect(() => {

    const data = [];
    let maxValue = 10;
    let maxP = 0;

    testsDataChart.forEach((test, index) => {

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

  }, [testsDataChart, sorted]);

  useEffect(() => {

    electron.ipcRenderer.on('tests-data', receiveData);
    electron.ipcRenderer.on('tests-search-data', receiveSearchData);
    electron.ipcRenderer.on('tests-count', receiveTestsCount);
    electron.ipcRenderer.on('tests-search-data-count', receiveTestsCount);
    electron.ipcRenderer.on('tests-data-chart', receiveChartData);
    electron.ipcRenderer.on('tests-search-data-chart', receiveChartData);

    return () => {

      electron.ipcRenderer.removeListener('tests-data', receiveData);
      electron.ipcRenderer.removeListener('tests-search-data', receiveSearchData);
      electron.ipcRenderer.removeListener('tests-count', receiveTestsCount);
      electron.ipcRenderer.removeListener('tests-search-data-count', receiveTestsCount);
      electron.ipcRenderer.removeListener('tests-data-chart', receiveChartData);
      electron.ipcRenderer.removeListener('tests-search-data-chart', receiveChartData);

    }

  }, []);

  useEffect(() => {

    if(mode == 'normal'){
      electron.ipcRenderer.send('request-tests-data', {offset: offset, limit: limit, sortDirection: sorted.direction, sortColumn: sorted.column});
    }

    storage.setItem('offset', offset);
    storage.setItem('sorted', JSON.stringify(sorted));

  }, [limit, offset, sorted]);

  useEffect(() => {

    storage.setItem('mode', mode);

  }, [mode]);

  const tableRows = useMemo(() => {

    if(testsData.length > 0 ){

      return testsData.map((test, index) => (
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
      ));

    }

    return (<TableDataPlacehold />);

  }, [testsData]);

  return (
    <Container style={{ marginTop: "3em",  marginBottom: "3em" }}>

      <Navbar />
      <Search onSubmit={() => { setMode('search'); setActivePage(1); setOffset(0); setSorted({ column: 'id', direction: 'DESC' }) }} sortDirection={sorted.direction} sortColumn={sorted.column} noResult={testsCount === 0} mode={mode} offset={offset} limit={limit} />

      {(testsCount || mode == 'normal') && (
        <Charts animate={animateChart} mode={mode} data={chartData} maxValueDownloadUpload={maxValueDownloadUpload} maxPing={maxPing} />
      )}
      {(testsCount || mode == 'normal') && (
      <Table  color={mode === 'search' ? 'blue' : null} sortable={testsData.length > 0} celled compact striped>

        <Table.Header>
          <Table.Row>
            <Table.HeaderCell sorted={sorted.column === 'id' ? getSortDirection(sorted.direction) : null} onClick={handleSort.bind(this, 'id')}>#</Table.HeaderCell>
            <Table.HeaderCell sorted={sorted.column === 'ping_latency' ? getSortDirection(sorted.direction) : null} onClick={handleSort.bind(this, 'ping_latency')}>Ping</Table.HeaderCell>
            <Table.HeaderCell sorted={sorted.column === 'download_bandwidth' ? getSortDirection(sorted.direction) : null} onClick={handleSort.bind(this, 'download_bandwidth')}>Download</Table.HeaderCell>
            <Table.HeaderCell sorted={sorted.column === 'upload_bandwidth' ? getSortDirection(sorted.direction) : null} onClick={handleSort.bind(this, 'upload_bandwidth')}>Upload</Table.HeaderCell>
            <Table.HeaderCell sorted={sorted.column === 'isp' ? getSortDirection(sorted.direction) : null} onClick={handleSort.bind(this, 'isp')}>ISP</Table.HeaderCell>
            <Table.HeaderCell sorted={sorted.column === 'server_name' ? getSortDirection(sorted.direction) : null} onClick={handleSort.bind(this, 'server_name')}>Server</Table.HeaderCell>
            <Table.HeaderCell sorted={sorted.column === 'timestamp_milliseconds' ? getSortDirection(sorted.direction) : null} onClick={handleSort.bind(this, 'timestamp_milliseconds')}>When</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {tableRows}
        </Table.Body>
      </Table>
      )}


      {chartData.length > 0 && (
        <Segment style={{paddingRight: 0}} basic clearing>
          <Pagination color={mode === 'search' ? 'blue' : null} floated="right" inverted onPageChange={handlePageChange} activePage={activePage} totalPages={totalPages} />
        </Segment>
      )}

    </Container>
  );

};
