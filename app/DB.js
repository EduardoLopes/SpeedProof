var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./tests.db');

db.serialize(function() {

  db.run(`CREATE TABLE IF NOT EXISTS tests (
    id INTEGER PRIMARY KEY,
    timestamp TEXT NOT NULL,
    ping_jitter REAL NOT NULL,
    ping_latency REAL NOT NULL,
    download_bandwidth INTEGER NOT NULL,
    download_bytes INTEGER NOT NULL,
    download_elapsed INTEGER NOT NULL,
    upload_bandwidth INTEGER NOT NULL,
    upload_bytes INTEGER NOT NULL,
    upload_elapsed INTEGER NOT NULL,
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
    speedtest_url TEXT NOT NULL
  )`);






  // db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
  //     console.log(row.id + ": " + row.info);
  // });

});

  function insertTest(values){

  var stmt = db.run(`
  INSERT INTO
    tests
  VALUES (
    $id,
    $timestamp,
    $ping_jitter,
    $ping_latency,
    $download_bandwidth,
    $download_bytes,
    $download_elapsed,
    $upload_bandwidth,
    $upload_bytes,
    $upload_elapsed,
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
    $speedtest_url
  )`, values);

}

exports.insertTest = insertTest;