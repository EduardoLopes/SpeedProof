const { ipcMain } = require('electron');
const lang = require('lodash/lang');
const DB = require('./DB.js').db;

DB.serialize(() => {
  DB.run(`CREATE TABLE IF NOT EXISTS config (
    id INTEGER PRIMARY KEY,
    language TEXT NOT NULL,
    speedtest_path TEXT,
    tests_chart_limit INTEGER NOT NULL,
    last_save_timestamp INTEGER
  )`);

  DB.get('SELECT * FROM config WHERE id = 1', (err, row) => {
    if (lang.isUndefined(row)) {
      DB.run(
        `
          INSERT INTO
            config (language, tests_chart_limit)
          VALUES (
            'en',
            200
          )
        `,
      );
    }
  });
});

const setSpeedtestPath = (path) => {
  DB.serialize(() => {
    DB.run(`UPDATE config SET speedtest_path = '${path}', last_save_timestamp = ${Date.now()} WHERE id = '1'`);
  });
};

const setLanguage = (language) => {
  DB.serialize(() => {
    DB.run(`UPDATE config SET language = '${language}', last_save_timestamp = ${Date.now()} WHERE id = '1'`);
  });
};

const setChartLimit = (limit) => {
  DB.serialize(() => {
    DB.run(`UPDATE config SET tests_chart_limit = '${limit}', last_save_timestamp = ${Date.now()} WHERE id = '1'`);
  });
};

const getConfig = (event) => {
  if (!lang.isUndefined(event)) {
    event.reply('requesting-config-data');
  }
  DB.serialize(() => {
    DB.get('SELECT * FROM config WHERE id = 1', (err, row) => {
      if (!lang.isUndefined(event)) {
        event.reply('config-data', row);
      }
    });
  });
};

ipcMain.on('config-set-speedtest-path', (event, path) => {
  setSpeedtestPath(path);
  getConfig(event);
});

ipcMain.on('config-set-language', (event, language) => {
  setLanguage(language);
  getConfig(event);
});

ipcMain.on('config-set-tests-chart-limit', (event, limit) => {
  setChartLimit(limit);
  getConfig(event);
});

ipcMain.on('request-config-data', (event) => {
  getConfig(event);
});

exports.setSpeedtestPath = setSpeedtestPath;
exports.setLanguage = setLanguage;
exports.setChartLimit = setChartLimit;
exports.getConfig = getConfig;
