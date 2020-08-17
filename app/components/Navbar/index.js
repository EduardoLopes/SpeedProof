import React from 'react';
// import { NavLink } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import PropTypes from 'prop-types';
import styles from './navbar.module.scss';

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <a className={`${styles.item} ${styles.logo}`} href="/">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 0 24 24"
          width="24"
        >
          <path d="M20.38 8.57l-1.23 1.85a8 8 0 0 1-.22 7.58H5.07A8 8 0 0 1 15.58 6.85l1.85-1.23A10 10 0 0 0 3.35 19a2 2 0 0 0 1.72 1h13.85a2 2 0 0 0 1.74-1 10 10 0 0 0-.27-10.44zm-9.79 6.84a2 2 0 0 0 2.83 0l5.66-8.49-8.49 5.66a2 2 0 0 0 0 2.83z" />
        </svg>
      </a>
      <a className={`${styles.item} ${styles.settings}`} href="/settings">
        {/* <i className="material-icons">settings</i> */}
        <i className="material-icons">arrow_back_ios</i>
        <span className="sr-only">settings</span>
      </a>
    </nav>
  );
}
