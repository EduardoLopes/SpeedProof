import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Form,
  Select,
  Segment,
  Button,
  Icon,
  Label,
} from 'semantic-ui-react';
import _lang from 'lodash/lang';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import Navbar from '../../components/Navbar/Navbar';

const electron = window.require('electron');
const storage = window.localStorage;

const languages = [
  { key: 'en', value: 'en', text: 'English' },
  { key: 'pt-BR', value: 'pt-BR', text: 'Português (Brasil)' },
];

export default function Config() {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState(null);
  const [speedtestPath, setSpeedtestPath] = useState(null);
  const [testChartLimit, setTestChartLimit] = useState(200);
  const fileInput = useRef(null);

  function handleLanguageChange(event, { value }) {
    event.persist();
    setLanguage(value);
    i18n.changeLanguage(value);
    storage.setItem('language', value);
    moment.locale(value.toLowerCase());
  }

  function receiveConfigData(event, data) {
    setLanguage(data.language);
    setSpeedtestPath(data.speedtest_path);
    setTestChartLimit(data.tests_chart_limit);
    setLoading(false);
  }

  function handleFileClick(event) {
    event.persist();
    if (event.type === 'click') {
      fileInput.current.click();
    }
  }

  function handleFileChange() {
    setSpeedtestPath(fileInput.current.files[0].path);
  }

  function handleLimitChange(event) {
    setTestChartLimit(event.target.value);
  }

  useEffect(() => {
    if (!_lang.isNull(speedtestPath)) {
      electron.ipcRenderer.send('config-set-speedtest-path', speedtestPath);
      electron.ipcRenderer.send('check-speedtest', speedtestPath);
    }
  }, [speedtestPath]);

  useEffect(() => {
    if (!_lang.isNull(language)) {
      electron.ipcRenderer.send('config-set-language', language);
    }
  }, [language]);

  useEffect(() => {
    if (!_lang.isNull(testChartLimit) && loading === false) {
      electron.ipcRenderer.send('config-set-tests-chart-limit', testChartLimit);
    }
  }, [testChartLimit]);

  useEffect(() => {
    window.addEventListener('beforeunload', () => {
      electron.ipcRenderer.send('before-unload', 'data');
    });

    electron.ipcRenderer.send('request-config-data');
    setLoading(true);
    electron.ipcRenderer.on('config-data', receiveConfigData);

    return () => {
      electron.ipcRenderer.removeListener('config-data', receiveConfigData);
    };
  }, []);

  const pathButton = () => (
    <div>
      <Button
        size="large"
        onClick={handleFileClick}
        as="div"
        labelPosition="right"
      >
        <Button color="blue" icon type="button">
          <Icon name="paperclip" />
          {' Path'}
        </Button>
        <Label color="blue" as="a" basic pointing="left">
          {speedtestPath}
        </Label>
      </Button>
    </div>
  );

  return (
    <Container style={{ marginTop: '3em', marginBottom: '3em' }}>
      <Navbar />
      <Segment loading={loading}>
        {!loading && (
          <Form>
            <Form.Field
              inline
              value={language}
              onChange={handleLanguageChange}
              control={Select}
              label={t('language')}
              options={languages}
              placeholder={t('Select your language')}
            />
            <Form.Input
              inline
              label="Tests Page Chart Limit"
              type="number"
              onChange={handleLimitChange}
              value={testChartLimit}
            />
            <Form.Field
              inline
              label="speedtest-cli path"
              control={pathButton}
            />
          </Form>
        )}
        <input
          onChange={handleFileChange}
          ref={fileInput}
          type="file"
          style={{ display: 'none' }}
        />
      </Segment>
    </Container>
  );
}
