import React, { useEffect } from "react";
import { Container } from 'semantic-ui-react'
import Navbar from "../../components/Navbar/Navbar.js";
const electron = window.require("electron");

export default function Tests(){

  function receiveData(event, data){

    // console.log(data);

  }

  useEffect(() => {

    electron.ipcRenderer.send('request-tests-data', "data");
    electron.ipcRenderer.on('tests-data', receiveData);

    return () => {

      electron.ipcRenderer.removeListener('tests-data', receiveData);

    }

  }, []);

  return (
    <Container style={{ marginTop: "3em",  marginBottom: "3em" }}>
      <Navbar />
    </Container>
  );

};