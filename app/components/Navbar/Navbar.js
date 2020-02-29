import React from "react";
import { NavLink } from "react-router-dom";
import { Menu, Icon } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next';

export default function Navbar(props){

  const { t } = useTranslation();

  return (
    <Menu inverted pointing size='huge'>
      <Menu.Item
        as={NavLink}
        exact
        to="/"
        name={t('navbar.speedtest')}
      >
        <Icon name='rocket' />
        {t('navbar.speedtest')}
      </Menu.Item>
      {!props.testsItemDisabled &&
      (<Menu.Item
        as={NavLink}
        exact
        to={"/tests"}
        name={t('navbar.tests')}
      >
        <Icon name='line graph' />
        {t('navbar.tests')}
      </Menu.Item>)}
    </Menu>
  );

};