/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Segment,
  Grid,
  Button,
  Icon,
  Label,
} from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import _lang from 'lodash/lang';
import Terms from './Terms';
import useSpeedtestCheck from '../../hooks/useSpeedtestCheck';

export default function Check() {
  const [loading, setLoading] = useState(false);
  const [willDownload, setWillDownload] = useState(true);
  const [filePath, setFilePath] = useState(null);
  const fileInput = useRef(null);
  const speedtestIsValid = useSpeedtestCheck();

  const { t } = useTranslation();

  function handleYes() {
    setLoading(true);

    window.api.send('request-speedtest-cli-download');
  }

  function handleNo() {
    setWillDownload(false);
  }

  function handleFileClick() {
    fileInput.current.click();
  }

  function handleFileChange() {
    setFilePath(fileInput.current.files[0].path);
  }

  function speedtestDownload(event, path) {
    setFilePath(path);
    setLoading(false);
  }

  useEffect(() => {
    if (!_lang.isNull(filePath)) {
      window.api.send('config-set-speedtest-path', filePath);
    }
  }, [filePath]);

  useEffect(() => {
    window.api.receive('speedtest-downloaded', speedtestDownload);
    return () =>
    window.api.receiveOff(
        'speedtest-downloaded',
        speedtestDownload,
      );
  }, []);

  const DownloadButtons = () => (
    <div>
      <h3>{t('Would you like to download it?')}</h3>
      <Button.Group size="large">
        <Button onClick={handleYes} positive>
          {t('Yes')}
        </Button>
        <Button onClick={handleNo} negative>
          {t('No')}
        </Button>
      </Button.Group>
    </div>
  );

  const UploadButton = () => (
    <div>
      <h3>
        {t('Please show where speedtest exe version 1 0 0 win64 is placed')}
      </h3>
      {filePath ? (
        <Button
          size="large"
          onClick={handleFileClick}
          as="div"
          labelPosition="right"
        >
          <Button color="blue" icon>
            <Icon name="paperclip" />
            {' Directory'}
          </Button>
          <Label color="blue" as="a" basic pointing="left">
            {filePath}
          </Label>
        </Button>
      ) : (
        <Button.Group>
          <Button
            content="Download"
            icon="arrow left"
            size="mini"
            basic
            color="blue"
            onClick={() => setWillDownload(true)}
          />
          <Button
            size="large"
            color="blue"
            icon="paperclip"
            onClick={handleFileClick}
            content={t('path')}
          />
        </Button.Group>
      )}
      <input
        onChange={handleFileChange}
        ref={fileInput}
        type="file"
        style={{ display: 'none' }}
      />
    </div>
  );

  const NotFound = () => (
    <div>
      <h1>{t('speedtest cli NOT FOUND')}</h1>
      <p>
        {t('SpeedProof app only works with')}
        <a
          href="#"
          onClick={() => window.api.openItem('https://www.speedtest.net/')}
        >
          {' Speedtest® '}
        </a>
        {t('cli tool developed by')}
        <a
          href="#"
          onClick={() => window.api.openItem('https://www.ookla.com/')}
        >
          {' Ookla®'}
        </a>
      </p>
      {willDownload ? <DownloadButtons /> : <UploadButton />}
    </div>
  );

  return (
    <Container>
      <Grid
        textAlign="center"
        verticalAlign="middle"
        style={{ height: '100vh' }}
      >
        <Grid.Column style={{ maxWidth: '90%' }}>
          <Segment color="red" loading={loading}>
            {speedtestIsValid === false ? <NotFound /> : <Terms />}
          </Segment>
        </Grid.Column>
      </Grid>
    </Container>
  );
}
