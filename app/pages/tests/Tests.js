import React, { useState, useEffect, useMemo} from "react";
import { Container, Table } from 'semantic-ui-react'
import styles from "./Tests.scss";
import Navbar from "../../components/Navbar/Navbar.js";
const electron = window.require("electron");
import moment from "moment";

export default function Tests(){

  const [testsData, setTestsData] = useState([]);

  function receiveData(event, data){

    setTestsData(data);

  }

  useEffect(() => {

    electron.ipcRenderer.send('request-tests-data', "data");
    electron.ipcRenderer.on('tests-data', receiveData);

    return () => {

      electron.ipcRenderer.removeListener('tests-data', receiveData);

    }

  }, []);

  const testsRows = testsData.map((test, index) => (
      <Table.Row key={test.id}>
        <Table.Cell>{test.id}</Table.Cell>
        <Table.Cell>{Math.floor(test.ping_latency)} <span className={styles.headerCellSecondaryText}>ms</span></Table.Cell>
        <Table.Cell>{(test.download_bandwidth / 125000).toFixed(2)} <span className={styles.headerCellSecondaryText}>Mbps</span></Table.Cell>
        <Table.Cell>{(test.upload_bandwidth / 125000).toFixed(2)} <span className={styles.headerCellSecondaryText}>Mbps</span></Table.Cell>
        <Table.Cell>{test.isp}</Table.Cell>
        <Table.Cell>{test.server_name}</Table.Cell>
        <Table.Cell>{moment(test.timestamp, moment.ISO_8601).fromNow()}</Table.Cell>
      </Table.Row>
    ));

  return (
    <Container style={{ marginTop: "3em",  marginBottom: "3em" }}>
      <Navbar />

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
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {testsRows}
        </Table.Body>
      </Table>

    </Container>
  );

};