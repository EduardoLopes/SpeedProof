import React, { useState, useEffect } from "react";
import { Container, Segment, Label,  Icon, Button, List, Grid } from 'semantic-ui-react'
import Tags from "../../components/Tags/Tags.js";
import Panel from "../../components/Panel/Panel.js";
const electron = window.require("electron");
import moment from "moment";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export default function Info(){

  let { id } = useParams();

  const [testData, setTestData] = useState(null);
  const { t } = useTranslation();

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

  useEffect(() => {


  }, [testData]);

  return (
    <div>
      { testData && (
      <Container style={{ marginTop: "3em",  marginBottom: "3em" }}>
        <Button
          as={NavLink}
          exact
          to='/tests'
          content={t('Back')}
          icon='arrow left'
        />
        <Label size="large">
          <Icon name='time' /> {moment(testData.timestamp, moment.ISO_8601).format("dddd, MMMM Do YYYY, h:mm:ss a")}
        </Label>
        <Panel
          pingData={testData ? testData.ping_variation : null}
          pingJitterData={testData ? testData.ping_jitter_variation : null}
          downloadData={testData ? testData.download_variation : null}
          uploadData={testData ? testData.upload_variation : null}
          downloadSpeed={testData.download_bandwidth}
          uploadSpeed={testData.upload_bandwidth}
          ping={{latency: testData.ping_latency}}
        />

      <Grid columns='equal' padded="vertically">
        <Grid.Row stretched>
          <Grid.Column>
            <Segment padded>
              <Label color='orange' size="large" attached='top' style={{textAlign: "left"}}>
                <Icon name='computer'/> {t('client')}
              </Label>
              <List divided relaxed="very">
                <List.Item>
                  <List.Content>
                    <List.Header>{t('ISP Name')}</List.Header>
                    <List.Description>{testData.isp}</List.Description>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Content>
                    <List.Header>{t('Internal IP')}</List.Header>
                    <List.Description>{testData.interface_internal_ip}</List.Description>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Content>
                    <List.Header>{t('Name')}</List.Header>
                    <List.Description>{testData.interface_name !== ""? testData.interface_name : t('No Name')}</List.Description>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Content>
                    <List.Header>{t('MAC Adress')}</List.Header>
                    <List.Description>{testData.interface_mac_addr}</List.Description>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Content>
                    <List.Header>{t('VPN')}</List.Header>
                    <List.Description>{testData.interface_is_vpn !== 0 ? t('Yes') : t('No')}</List.Description>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Content>
                    <List.Header>{t('External IP')}</List.Header>
                    <List.Description>{testData.interface_external_ip}</List.Description>
                  </List.Content>
                </List.Item>
              </List>
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment padded>
              <Label color='orange' size="large" attached='top' style={{textAlign: "left"}}>
                <Icon name='server'/> {t('server')}
              </Label>
              <List divided relaxed="very">
                <List.Item>
                  <List.Content>
                    <List.Header>{t('Name')}</List.Header>
                    <List.Description>{testData.server_name}</List.Description>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Content>
                    <List.Header>{t('ID')}</List.Header>
                    <List.Description>{testData.server_id}</List.Description>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Content>
                    <List.Header>{t('Location')}</List.Header>
                    <List.Description>{testData.server_location} / {testData.server_country} </List.Description>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Content>
                    <List.Header>{t('Host')}</List.Header>
                    <List.Description>{testData.server_host}:{testData.server_port}</List.Description>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Content>
                    <List.Header>{t('IP')}</List.Header>
                    <List.Description>{testData.server_ip}</List.Description>
                  </List.Content>
                </List.Item>
              </List>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>

        <Tags id={testData.id}/>
        <Segment>
          <Button style={{width: '100%'}} onClick={(event) => electron.shell.openItem(testData.speedtest_url)} secondary>{testData.speedtest_url}</Button>
        </Segment>
      </Container>
    )}
    </div>
  );

}
