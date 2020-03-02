/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Segment } from 'semantic-ui-react';

const electron = window.require('electron');

export default function Footer() {
  return (
    <div>
      <Segment textAlign="center" basic style={{ color: 'rgba(0,0,0,.4)' }}>
        Developed by Eduardo Lopes using tecnologie from
        <a href="#" onClick={() => electron.shell.openItem('https://www.speedtest.net/')}>Speedtest®</a>
        by
        <a href="#" onClick={() => electron.shell.openItem('https://www.ookla.com/')}>Ookla®</a>
      </Segment>
    </div>
  );
}
