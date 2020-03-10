const sqlite3 = require('sqlite3').verbose();
const { app } = require('electron');
const path = require('path');
const lang = require('lodash/lang');

const db = new sqlite3.Database(path.join(app.getPath('userData'), '/tests.db'));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS tests (
    id INTEGER PRIMARY KEY,
    timestamp TEXT NOT NULL,
    timestamp_milliseconds INTEGER NOT NULL,
    ping_jitter REAL NOT NULL,
    ping_jitter_variation TEXT NOT NULL,
    ping_latency REAL NOT NULL,
    ping_variation TEXT NOT NULL,
    download_bandwidth INTEGER NOT NULL,
    download_bytes INTEGER NOT NULL,
    download_elapsed INTEGER NOT NULL,
    download_variation TEXT NOT NULL,
    upload_bandwidth INTEGER NOT NULL,
    upload_bytes INTEGER NOT NULL,
    upload_elapsed INTEGER NOT NULL,
    upload_variation TEXT NOT NULL,
    isp TEXT NOT NULL,
    interface_internal_ip TEXT NOT NULL,
    interface_name TEXT,
    interface_mac_addr TEXT NOT NULL,
    interface_is_vpn INTEGER NOT NULL,
    interface_external_ip TEXT NOT NULL,
    server_id INTEGER NOT NULL,
    server_name TEXT NOT NULL,
    server_location TEXT NOT NULL,
    server_country TEXT NOT NULL,
    server_host TEXT NOT NULL,
    server_port INTEGER NOT NULL,
    server_ip TEXT NOT NULL,
    speedtest_id TEXT NOT NULL,
    speedtest_url TEXT NOT NULL,
    tags TEXT
  )`);
});

function insertTest(mainWindow, values) {
  db.serialize(() => {
    db.run(
      `
    INSERT INTO
      tests
    VALUES (
      $id,
      $timestamp,
      $timestamp_milliseconds,
      $ping_jitter,
      $ping_jitter_variation,
      $ping_latency,
      $ping_variation,
      $download_bandwidth,
      $download_bytes,
      $download_elapsed,
      $download_variation,
      $upload_bandwidth,
      $upload_bytes,
      $upload_elapsed,
      $upload_variation,
      $isp,
      $interface_internal_ip,
      $interface_name,
      $interface_mac_addr,
      $interface_is_vpn,
      $interface_external_ip,
      $server_id,
      $server_name,
      $server_location,
      $server_country,
      $server_host,
      $server_port,
      $server_ip,
      $speedtest_id,
      $speedtest_url,
      $tags
    )`,
      values,
      // TODO: handle error
      () => {
        mainWindow.webContents.send('last-id', `${this.lastID}`);
      },
    );
  });
}

function getTests(mainWindow, offset, limit, sortDirection, sortColumn) {
  db.serialize(() => {
    db.all(
      `SELECT * FROM tests ORDER BY ${sortColumn} ${sortDirection} LIMIT ${offset}, ${limit}`,
      (err, row) => {
        mainWindow.webContents.send('tests-data', row);
      },
    );

    db.get('SELECT tests_chart_limit FROM config WHERE id = 1', (configError, config) => {
      if (!lang.isUndefined(config)) {
        db.all(
          `SELECT * FROM tests ORDER BY ${sortColumn} ${sortDirection} LIMIT 0, ${config.tests_chart_limit}`,
          (err, row) => {
            mainWindow.webContents.send('tests-data-chart', row);
          },
        );
      }
    });


    db.all('SELECT COUNT(*) as count FROM tests', (err, row) => {
      mainWindow.webContents.send('tests-count', row);
    });
  });
}

function getTestsSearch(
  mainWindow,
  keyword,
  dates,
  byTag,
  byISP,
  byServerName,
  offset,
  limit,
  sortDirection,
  sortColumn,
) {
  const queries = [];
  let byDate = '';

  if (dates.length > 0) {
    byDate = ` AND timestamp_milliseconds BETWEEN ${dates[0]} AND ${dates[1]}`;
  }

  if (byTag === true) {
    queries.push(`SELECT * FROM tests WHERE tags LIKE '%${keyword}%'${byDate}`);
  }

  if (byISP === true) {
    queries.push(`SELECT * FROM tests WHERE isp LIKE '%${keyword}%'${byDate}`);
  }

  if (byServerName === true) {
    queries.push(
      `SELECT * FROM tests WHERE server_name LIKE '%${keyword}%'${byDate}`,
    );
  }

  if (queries.length === 0 && dates.length > 0) {
    queries.push(
      `SELECT * FROM tests WHERE timestamp_milliseconds BETWEEN ${dates[0]} AND ${dates[1]}`,
    );
  }

  if (queries.length !== 0) {
    let query = '';

    queries.forEach((item, index) => {
      const union = index === queries.length - 1 ? '' : ' UNION ';
      query += `SELECT * FROM (${item})${union}`;
    });

    db.serialize(() => {
      db.all(
        `${query} ORDER BY ${sortColumn} ${sortDirection} LIMIT ${offset}, ${limit}`,
        (err, row) => {
          mainWindow.webContents.send('tests-search-data', row);
        },
      );

      db.all(
        `SELECT COUNT(*) as count FROM (${query} ORDER BY ${sortColumn} ${sortDirection})`,
        (err, row) => {
          mainWindow.webContents.send('tests-search-data-count', row);
        },
      );

      db.get('SELECT tests_chart_limit FROM config WHERE id = 1', (err, config) => {
        if (!lang.isUndefined(config)) {
          db.all(
            `${query} ORDER BY ${sortColumn} ${sortDirection} LIMIT 0, ${config.tests_chart_limit}`,
            (_err, row) => {
              mainWindow.webContents.send('tests-search-data-chart', row);
            },
          );
        }
      });
    });
  }
}

function getTest(mainWindow, id) {
  db.serialize(() => {
    db.each(`SELECT * FROM tests WHERE id = ${id}`, (err, row) => {
      mainWindow.webContents.send('test-data', row);
    });
  });
}

function getTags(mainWindow, id) {
  db.serialize(() => {
    db.each(`SELECT tags FROM tests WHERE id = ${id}`, (err, row) => {
      mainWindow.webContents.send('tags-data', row);
    });
  });
}

function updateTags(id, tags) {
  db.serialize(() => {
    db.run(`
    UPDATE
      tests
    SET tags = '${tags}'
    WHERE id = ${id}`);
  });
}

exports.insertTest = insertTest;
exports.getTests = getTests;
exports.getTestsSearch = getTestsSearch;
exports.getTest = getTest;
exports.getTags = getTags;
exports.updateTags = updateTags;
exports.db = db;
exports.close = () => {
  db.close();
};
