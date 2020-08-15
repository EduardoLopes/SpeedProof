import React from 'react';
// import { NavLink } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import PropTypes from 'prop-types';
import styles from './navbar.scss';

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <a className={`${styles.item} ${styles.logo}`} href="/">
        Logo
      </a>
      <a className={`${styles.item} ${styles.settings}`} href="/settings">
        <span className="sr-only">settings</span>
      </a>
    </nav>
  );
}
