const {ipcMain} = require('electron');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./tests.db');

db.serialize(function() {

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

  // db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
  //     console.log(row.id + ": " + row.info);
  // });

});

function insertTest(mainWindow, values){

  db.serialize(function() {

    var stmt = db.run(`
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
    )`, values, function(error, result){

      mainWindow.webContents.send('last-id', `${this.lastID}`);

    });

  });

}

function getTests(mainWindow){

  db.serialize(function() {

    db.all("SELECT * FROM tests ORDER BY id DESC", function(err, row) {

      mainWindow.webContents.send('tests-data', row);

    });

  });

}

function getTestsSearch(mainWindow, keyword, dates, byTag, byISP, byServerName){

  const queries = [];
  let byDate = '';

  if(dates.length > 0){
    byDate = ` AND timestamp_milliseconds BETWEEN ${dates[0]} AND ${dates[1]}`;
  }

  if(byTag === true){
    queries.push(`SELECT * FROM tests WHERE tags LIKE '%${keyword}%'${byDate}`);
  }

  if(byISP === true){
    queries.push(`SELECT * FROM tests WHERE isp LIKE '%${keyword}%'${byDate}`);
  }

  if(byServerName === true){
    queries.push(`SELECT * FROM tests WHERE server_name LIKE '%${keyword}%'${byDate}`);
  }

  if(queries.length === 0 && dates.length > 0){
    queries.push(`SELECT * FROM tests WHERE timestamp_milliseconds BETWEEN ${dates[0]} AND ${dates[1]}`);
  }

  if(queries.length !== 0){

    const query = queries.reduce((query, currentQuery, index) => {
      return query +` UNION ${currentQuery}`
    });

    db.serialize(function() {

      db.all(`${query} ORDER BY id DESC`, function(err, row) {

        mainWindow.webContents.send('tests-search-data', row);

      });

    });

  }

}

function getTest(mainWindow, id){

  db.serialize(function() {

    db.each(`SELECT * FROM tests WHERE id = ${id}`, function(err, row) {

      mainWindow.webContents.send('test-data', row);

    });

  });

}

function getTags(mainWindow, id){

  db.serialize(function() {

    db.each(`SELECT tags FROM tests WHERE id = ${id}`, function(err, row) {

      mainWindow.webContents.send('tags-data', row);

    });

  });

}

function updateTags(id, tags){

  db.serialize(function() {

    var stmt = db.run(`
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

exports.close = function (){ db.close() };
