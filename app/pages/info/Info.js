import React, { useState, useEffect } from 'react';
import {
  Container,
  Segment,
  Label,
  Icon,
  Button,
  List,
  Grid,
} from 'semantic-ui-react';
import moment from 'moment';
import { useParams, NavLink } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import Tags from '../../components/Tags/Tags';
import Panel from '../../components/Panel';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer/Footer';

const storage = window.localStorage;

export default function Info() {
  const { id } = useParams();

  const [testData, setTestData] = useState(null);
  const { t } = useTranslation();

  function receiveData(event, data) {
    setTestData(data);
  }

  useEffect(() => {
    window.api.send('request-test-data', id);
    window.api.receive('test-data', receiveData);

    window.scroll({
      top: 0,
      behavior: 'auto',
    });

    return () => {
      window.api.receiveOff('test-data', receiveData);

      window.scroll({
        top: parseInt(storage.getItem('scrollY'), 10),
        behavior: 'auto',
      });
    };
  }, []);

  return (
    <Container style={{ marginTop: '1rem' }}>
      <Navbar />
      {testData && (
        <div>
          <Grid verticalAlign="middle">
            <Grid.Column width="4">
              <Button
                as={NavLink}
                exact
                to="/tests"
                content={t('Back')}
                icon="arrow left"
                floated="left"
                size="mini"
              />
            </Grid.Column>
            <Grid.Column width="12" textAlign="right">
              <Label size="large">
                <Icon name="time" />{' '}
                {moment(testData.timestamp, moment.ISO_8601).format(
                  'dddd, MMMM Do YYYY, h:mm:ss a',
                )}
              </Label>
            </Grid.Column>
          </Grid>
          <Panel
            rawPingData={testData ? testData.ping_variation : null}
            rawPingJitterData={testData ? testData.ping_jitter_variation : null}
            rawDownloadData={testData ? testData.download_variation : null}
            rawUploadData={testData ? testData.upload_variation : null}
            downloadSpeed={testData.download_bandwidth}
            uploadSpeed={testData.upload_bandwidth}
            ping={{ latency: testData.ping_latency }}
          />

          <Grid columns="equal" padded="vertically">
            <Grid.Row stretched>
              <Grid.Column>
                <Segment padded>
                  <Label
                    color="orange"
                    size="large"
                    attached="top"
                    style={{ textAlign: 'left' }}
                  >
                    <Icon name="computer" /> {t('client')}
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
                        <List.Description>
                          {testData.interface_internal_ip}
                        </List.Description>
                      </List.Content>
                    </List.Item>
                    <List.Item>
                      <List.Content>
                        <List.Header>{t('Name')}</List.Header>
                        <List.Description>
                          {testData.interface_name !== ''
                            ? testData.interface_name
                            : t('No Name')}
                        </List.Description>
                      </List.Content>
                    </List.Item>
                    <List.Item>
                      <List.Content>
                        <List.Header>{t('MAC Adress')}</List.Header>
                        <List.Description>
                          {testData.interface_mac_addr}
                        </List.Description>
                      </List.Content>
                    </List.Item>
                    <List.Item>
                      <List.Content>
                        <List.Header>{t('VPN')}</List.Header>
                        <List.Description>
                          {testData.interface_is_vpn !== 0 ? t('Yes') : t('No')}
                        </List.Description>
                      </List.Content>
                    </List.Item>
                    <List.Item>
                      <List.Content>
                        <List.Header>{t('External IP')}</List.Header>
                        <List.Description>
                          {testData.interface_external_ip}
                        </List.Description>
                      </List.Content>
                    </List.Item>
                  </List>
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment padded>
                  <Label
                    color="orange"
                    size="large"
                    attached="top"
                    style={{ textAlign: 'left' }}
                  >
                    <Icon name="server" /> {t('server')}
                  </Label>
                  <List divided relaxed="very">
                    <List.Item>
                      <List.Content>
                        <List.Header>{t('Name')}</List.Header>
                        <List.Description>
                          {testData.server_name}
                        </List.Description>
                      </List.Content>
                    </List.Item>
                    <List.Item>
                      <List.Content>
                        <List.Header>{t('ID')}</List.Header>
                        <List.Description>
                          {testData.server_id}
                        </List.Description>
                      </List.Content>
                    </List.Item>
                    <List.Item>
                      <List.Content>
                        <List.Header>{t('Location')}</List.Header>
                        <List.Description>
                          {testData.server_location} / {testData.server_country}{' '}
                        </List.Description>
                      </List.Content>
                    </List.Item>
                    <List.Item>
                      <List.Content>
                        <List.Header>{t('Host')}</List.Header>
                        <List.Description>
                          {testData.server_host}:{testData.server_port}
                        </List.Description>
                      </List.Content>
                    </List.Item>
                    <List.Item>
                      <List.Content>
                        <List.Header>{t('IP')}</List.Header>
                        <List.Description>
                          {testData.server_ip}
                        </List.Description>
                      </List.Content>
                    </List.Item>
                  </List>
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      )}

      {testData && <Tags id={testData.id} />}

      {testData && (
        <Segment>
          <Button
            style={{ width: '100%' }}
            onClick={() => electron.shell.openItem(testData.speedtest_url)}
            secondary
          >
            {testData.speedtest_url}
          </Button>
        </Segment>
      )}

      <Footer />
    </Container>
  );
}
