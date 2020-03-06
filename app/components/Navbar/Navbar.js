import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Icon } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

export default function Navbar(props) {
  const { t } = useTranslation();
  const { testsItemDisabled } = props;

  return (
    <Menu inverted pointing>
      <Menu.Item
        as={NavLink}
        exact
        to="/"
        name={t('navbar.speedtest')}
      >
        <Icon name="rocket" />
        {t('navbar.speedtest')}
      </Menu.Item>
      {!testsItemDisabled
      && (
      <Menu.Item
        as={NavLink}
        exact
        to="/tests"
        name={t('navbar.tests')}
      >
        <Icon name="line graph" />
        {t('navbar.tests')}
      </Menu.Item>
      )}
      <Menu.Menu position="right">
        <Menu.Item
          as={NavLink}
          exact
          to="/config"
          name={t('navbar.config')}
        >
          <Icon name="cog" />
          {t('navbar.config')}
        </Menu.Item>
        <Menu.Item
          as={NavLink}
          exact
          to="/about"
          name={t('navbar.about')}
        >
          <Icon name="question" />
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
}

Navbar.propTypes = {
  testsItemDisabled: PropTypes.bool,
};

Navbar.defaultProps = {
  testsItemDisabled: false,
};
