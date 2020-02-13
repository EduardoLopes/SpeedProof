import React, { useState, useEffect } from "react";
import { Container, Segment, Label,  Icon, Button, List } from 'semantic-ui-react'
import Tags from "../../components/Tags/Tags.js";
import Panel from "../../components/Panel/Panel.js";
const electron = window.require("electron");
import moment from "moment";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";

export default function Info(){

  let { id } = useParams();

  const [testData, setTestData] = useState(null);

  function receiveData(event, data){

    setTestData(data);

  }


  useEffect(() => {

    electron.ipcRenderer.send('request-test-data', id);
    electron.ipcRenderer.on('test-data', receiveData);

    return () => {

      electron.ipcRenderer.removeListener('test-data', receiveData);

    }

  }, []);

  return (
    <div>
      { testData && (
      <Container style={{ marginTop: "3em",  marginBottom: "3em" }}>
        <Button
          as={NavLink}
          exact
          to='/tests'
          content='Back'
          icon='arrow left'
        />
        <Label size="large">
          <Icon name='time' /> {moment(testData.timestamp, moment.ISO_8601).format("dddd, MMMM Do YYYY, h:mm:ss a")}
        </Label>
        <Panel
          downloadSpeed={testData.download_bandwidth}
          uploadSpeed={testData.upload_bandwidth}
          ping={testData.ping_latency}
        />

        <Segment.Group compact={false} horizontal>
          <Segment padded>
            <Label color='orange' size="large" attached='top' style={{textAlign: "left"}}>
              <Icon name='computer'/> Client
            </Label>
            <List divided relaxed="very">
              <List.Item>
                <List.Content>
                  <List.Header>ISP Name</List.Header>
                  <List.Description>{testData.isp}</List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Content>
                  <List.Header>Internal IP</List.Header>
                  <List.Description>{testData.interface_internal_ip}</List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Content>
                  <List.Header>Name</List.Header>
                  <List.Description>{testData.interface_name !== ""? testData.interface_name : "There's no name"}</List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Content>
                  <List.Header>MAC Adress</List.Header>
                  <List.Description>{testData.interface_mac_addr}</List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Content>
                  <List.Header>VPN</List.Header>
                  <List.Description>{testData.interface_is_vpn !== 0 ? "Yes" : "No"}</List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Content>
                  <List.Header>External IP</List.Header>
                  <List.Description>{testData.interface_external_ip}</List.Description>
                </List.Content>
              </List.Item>
            </List>
          </Segment>

          <Segment padded>
            <Label color='orange' size="large" attached='top' style={{textAlign: "left"}}>
              <Icon name='server'/> Server
            </Label>
            <List divided relaxed="very">
              <List.Item>
                <List.Content>
                  <List.Header>Name</List.Header>
                  <List.Description>{testData.server_name}</List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Content>
                  <List.Header>ID</List.Header>
                  <List.Description>{testData.server_id}</List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Content>
                  <List.Header>Location</List.Header>
                  <List.Description>{testData.server_location} / {testData.server_country} </List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Content>
                  <List.Header>Host</List.Header>
                  <List.Description>{testData.server_host}:{testData.server_port}</List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Content>
                  <List.Header>IP</List.Header>
                  <List.Description>{testData.server_ip}</List.Description>
                </List.Content>
              </List.Item>
            </List>
          </Segment>
        </Segment.Group>

        <Tags id={testData.id}/>
        <Segment>
          <Button style={{width: '100%'}} onClick={(event) => electron.shell.openItem(testData.speedtest_url)} secondary>{testData.speedtest_url}</Button>
        </Segment>
      </Container>
    )}
    </div>
  );

}
