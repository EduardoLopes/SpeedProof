import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Form,
  Select,
  Segment,
  Button,
  Icon,
  Label,
  Loader,
  Dimmer,
} from 'semantic-ui-react';
import moment from 'moment';
import _lang from 'lodash/lang';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import useConfig from '../../hooks/useConfig';

const electron = window.require('electron');
const storage = window.localStorage;

const languages = [
  { key: 'en', value: 'en', text: 'English' },
  { key: 'pt-BR', value: 'pt-BR', text: 'Português (Brasil)' },
];

export default function Config() {
  const { t, i18n } = useTranslation();
  const [updateConfig, setUpdateConfig] = useState(true);
  const [language, setLanguage] = useState(undefined);
  const [speedtestPath, setSpeedtestPath] = useState(undefined);
  const [testChartLimit, setTestChartLimit] = useState(200);
  const [lastSave, setLastSave] = useState(null);
  const fileInput = useRef(null);
  const [config, loading] = useConfig();

  function handleLanguageChange(event, { value }) {
    event.persist();
    setLanguage(value);
    i18n.changeLanguage(value);
    storage.setItem('language', value);
    moment.locale(value.toLowerCase());
  }

  function handleFileClick(event) {
    event.persist();
    fileInput.current.click();
  }

  function handleFileChange() {
    setSpeedtestPath(fileInput.current.files[0].path);
  }

  function handleLimitChange(event) {
    setTestChartLimit(event.target.value);
  }

  useEffect(() => {
    if (!_lang.isNull(config)) {
      if (updateConfig === true) {
        setLanguage(config.language);
        setSpeedtestPath(config.speedtestPath);
        setTestChartLimit(config.testChartLimit);
        setLastSave(config.lastSave);
      }
      setLastSave(config.lastSave);
      setUpdateConfig(false);
    }
  }, [config]);

  useEffect(() => {
    if (!_lang.isNull(config) && speedtestPath !== config.speedtestPath) {
      electron.ipcRenderer.send('config-set-speedtest-path', speedtestPath);
    }
  }, [speedtestPath]);

  useEffect(() => {
    if (!_lang.isNull(config) && language !== config.language) {
      electron.ipcRenderer.send('config-set-language', language);
    }
  }, [language]);

  useEffect(() => {
    if (!_lang.isNull(config) && testChartLimit !== config.testChartLimit) {
      electron.ipcRenderer.send('config-set-tests-chart-limit', testChartLimit);
    }
  }, [testChartLimit]);

  useEffect(() => {
    window.addEventListener('beforeunload', () => {
      electron.ipcRenderer.send('before-unload', 'data');
    });
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
    <Container style={{ marginTop: '1rem' }}>
      <Navbar />
      <Segment clearing>
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
        <input
          onChange={handleFileChange}
          ref={fileInput}
          type="file"
          style={{ display: 'none' }}
        />
        <Segment compact floated="right" size="tiny" style={{ padding: 0, color: 'rgba(0,0,0,.4)' }} basic textAlign="right">
          {'Last save: '}
          {loading && (<Dimmer inverted active><Loader size="tiny" active inline /></Dimmer>)}
          {lastSave && moment(lastSave).fromNow()}
        </Segment>
      </Segment>
      <Footer />
    </Container>
  );
}
