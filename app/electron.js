// Modules to control application life and create native browser window
const  {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const isDev = require("electron-is-dev");
const DB = require("./DB.js");
const rootPath = require('electron-root-path').rootPath;
const moment = require('moment');

let mainWindow;
let speedtest;
let requestRunning = false;

const { spawn } = require('child_process');

ipcMain.on('request-data', (event, arg) => {

  if(requestRunning === true){

    mainWindow.webContents.send('last-request-running', "wait");

    return null;
  }

  requestRunning = true;

  const speedtest_path = isDev ? path.join(__dirname, "/ookla-speedtest-1.0.0-win64/speedtest.exe") : path.join(rootPath, "/resources/bin/speedtest.exe");

  speedtest = spawn(speedtest_path, ['--format', 'jsonl']);

  const pingVariation = [];
  const pingJitterVariation = [];
  const downloadVariation = [];
  const uploadVariation = [];
  const countResults = {
    ping: 0,
    download: 0,
    upload: 0,
    result: 1,
    testStart: 1
  };

  speedtest.stdout.setEncoding('utf8');
  speedtest.stdout.on('data', (chunk) => {

    // check if is a empty string
    if(!(/^\s*$/.test(chunk))){

      const lines = chunk.split("\n");

      for (let i = 0; i < lines.length - 1; i++) {

        const line = lines[i];

        const json = JSON.parse(line);

        if(json.error){
          mainWindow.webContents.send(`speedtest-error`, json.error);

          return;
        }

        if(countResults[json.type] > 0){

          mainWindow.webContents.send(`${json.type}`, json);

          if(json.type === 'ping'){

            pingVariation.push(json.ping.latency);
            pingJitterVariation.push(json.ping.jitter);

          }

          if(json.type === 'download'){

            downloadVariation.push(json.download.bandwidth);

          }

          if(json.type === 'upload'){

            uploadVariation.push(json.upload.bandwidth);

          }

        }

        countResults[json.type] =+ 1;

        if(json.type == "result"){

          requestRunning = false;

          DB.insertTest(mainWindow, {
            $id: null,
            $timestamp: json.timestamp,
            $timestamp_milliseconds: parseInt(moment(json.timestamp, moment.ISO_8601).format("x")),
            $ping_jitter: json.ping.jitter,
            $ping_jitter_variation: pingJitterVariation.toString(),
            $ping_latency: json.ping.latency,
            $ping_variation: pingVariation.toString(),
            $download_bandwidth: json.download.bandwidth,
            $download_bytes: json.download.bytes,
            $download_elapsed: json.download.elapsed,
            $download_variation: downloadVariation.toString(),
            $upload_bandwidth: json.upload.bandwidth,
            $upload_bytes: json.upload.bytes,
            $upload_elapsed: json.upload.elapsed,
            $upload_variation: uploadVariation.toString(),
            $isp: json.isp,
            $interface_internal_ip: json.interface.internalIp,
            $interface_name: json.interface.name,
            $interface_mac_addr: json.interface.macAddr,
            $interface_is_vpn: json.interface.isVpn ? 1 : 0,
            $interface_external_ip: json.interface.externalIp,
            $server_id: json.server.id,
            $server_name: json.server.name,
            $server_location: json.server.location,
            $server_country: json.server.country,
            $server_host: json.server.host,
            $server_port: json.server.port,
            $server_ip: json.server.ip,
            $speedtest_id: json.result.id,
            $speedtest_url: json.result.url,
            $tags: ""
          });

        }

      }

    }

  });

  speedtest.on('close', (code) => {

    //console.log(`child process exited with code ${code}`);
    requestRunning = false;

  });

});

ipcMain.on('request-tests-data', (event, arg) => {

  DB.getTests(mainWindow, arg.offset, arg.limit, arg.sortDirection, arg.sortColumn);

});

ipcMain.on('request-test-data', (event, arg) => {

  DB.getTest(mainWindow, arg);

});

ipcMain.on('request-test-search-data', (event, arg) => {

  DB.getTestsSearch(mainWindow, arg.keyword, arg.dates, arg.byTag, arg.byISP, arg.byServerName, arg.offset, arg.limit, arg.sortDirection, arg.sortColumn);

});

ipcMain.on('request-tags-data', (event, arg) => {

  DB.getTags(mainWindow, arg);

});

ipcMain.on('update-tags', (event, arg) => {

  DB.updateTags(arg.id, arg.tags);

});

ipcMain.on('before-unload', (event, arg) => {

  if(speedtest){
    speedtest.stdin.pause();
    speedtest.kill();
  }

});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null

    if(speedtest){
      speedtest.stdin.pause();
      speedtest.kill();
    }

  });

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q

  DB.close();

  if(speedtest){
    speedtest.stdin.pause();
    speedtest.kill();
  }

  if (process.platform !== 'darwin') app.quit()
});

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
