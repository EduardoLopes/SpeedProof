/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Segment } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

const electron = window.require('electron');

export default function Footer() {
  const { t } = useTranslation();

  return (
    <div>
      <Segment textAlign="center" basic style={{ color: 'rgba(0,0,0,.4)' }}>
        {t('Developed by')}
        <a href="#" onClick={() => electron.shell.openItem('https://github.com/EduardoLopes')}>{' Eduardo Lopes '}</a>
      </Segment>
    </div>
  );
}
