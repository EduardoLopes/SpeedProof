/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { Segment, Button, Header } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

const electron = window.require('electron');

export default function Terms() {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  function handleYesClick() {
    electron.ipcRenderer.send('config-set-accept-speedtest-license', 1);
    setLoading(true);
  }

  return (
    <div>
      <Segment loading={loading} basic textAlign="left" clearing>
        <Header as="h1" textAlign="center">
          Speedtest-cli Terms
        </Header>
        <p>{t('speedtest-cli Terms text')}</p>
        <a
          href="#"
          onClick={() =>
            electron.shell.openItem('https://www.speedtest.net/about/eula')
          }
        >
          {' https://www.speedtest.net/about/eula '}
        </a>
        <br />
        <a
          href="#"
          onClick={() =>
            electron.shell.openItem('https://www.speedtest.net/about/terms')
          }
        >
          {' https://www.speedtest.net/about/terms '}
        </a>
        <br />
        <a
          href="#"
          onClick={() =>
            electron.shell.openItem('https://www.speedtest.net/about/privacy')
          }
        >
          {' https://www.speedtest.net/about/privacy '}
        </a>
        <Segment
          basic
          style={{ paddingBottom: 0, paddingRight: 0, margin: 0 }}
          textAlign="right"
        >
          <Button onClick={handleYesClick} color="green" type="button">
            {t('accept license')}
          </Button>
        </Segment>
      </Segment>
    </div>
  );
}
