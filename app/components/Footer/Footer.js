/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Segment } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <div>
      <Segment textAlign="center" basic style={{ opacity: '.8' }}>
        {t('Developed by')}
        <a href="#" onClick={() => window.api.openItem('https://github.com/EduardoLopes')}>{' Eduardo Lopes '}</a>
        <br />
        <div style={{ opacity: '.6' }}>
          {t('This app uses the')}
          <a href="#" onClick={() => window.api.openItem('https://www.speedtest.net/')}>{' Speedtest® '}</a>
          {t('cli tool developed by')}
          <a href="#" onClick={() => window.api.openItem('https://www.ookla.com/')}>{' Ookla® '}</a>
        </div>
      </Segment>
    </div>
  );
}
