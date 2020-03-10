/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Container, Segment, Header } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const electron = window.require('electron');

export default function About() {
  const { t } = useTranslation();

  return (
    <Container style={{ marginTop: '1rem' }}>
      <Navbar />
      <Segment>
        <Header>
          {t('About')}
        </Header>
        <Container text>
          <p>
            {t('about p1')}
          </p>
          <p>
            {t('about p2 1')}
            <a href="#" onClick={() => electron.shell.openItem('https://www.ookla.com/')}>{' Ookla® '}</a>
            {t('about p2 2')}
            <a href="#" onClick={() => electron.shell.openItem('https://www.speedtest.net/')}>{' Speedtest® '}</a>
            {t('about p2 3')}
          </p>
          <p>
            {t('about p3')}
          </p>
          <p>
            {t('about p4')}
          </p>
        </Container>
      </Segment>
      <Footer />
    </Container>
  );
}
