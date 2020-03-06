/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Container, Segment, Header } from 'semantic-ui-react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const electron = window.require('electron');

export default function About() {
  return (
    <Container style={{ marginTop: '1rem' }}>
      <Navbar />
      <Segment>
        <Header>
          About
        </Header>
        <Container text>
          <p>
            SpeedCheck was made thinking about internet service providers,
            but it is usefull for anyone who needs to keep track of the velocity
            of your internet service.
          </p>
          <p>
            This app uses the command line tool mabe by
            <a href="#" onClick={() => electron.shell.openItem('https://www.ookla.com/')}>{' Ookla® '}</a>
            , check out the
            <a href="#" onClick={() => electron.shell.openItem('https://www.speedtest.net/')}>{' Speedtest® '}</a>
            website to know more.
          </p>
          <p>
            All this app do is collect the data returned by the command line tool
            and put in a database. Then it can be searched, soreted and organized by tags.
          </p>
          <p>
            It is still in development (alpha), theres a lot of room for improvement and
            new features. To checkout the roadmap, go to the github page!
          </p>
        </Container>
      </Segment>
      <Footer />
    </Container>
  );
}
