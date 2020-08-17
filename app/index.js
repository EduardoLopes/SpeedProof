import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'purecss/build/base-min.css';
import 'moment/locale/pt-br';
import './i18n';
import './global.scss';

// if (module.hot) {
//   module.hot.accept();
// }

ReactDOM.render(<App />, document.getElementById('root'));
