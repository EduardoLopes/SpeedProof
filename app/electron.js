// Modules to control application life and create native browser window
const  {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const isDev = require("electron-is-dev");
const DB = require("./DB.js");
const rootPath = require('electron-root-path').rootPath;

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

  speedtest.stdout.setEncoding('utf8');
  speedtest.stdout.on('data', (chunk) => {

    if(chunk.length > 10){
      const json = JSON.parse(chunk);
      mainWindow.webContents.send(`${json.type}`, json);

      if(json.type == "result"){
        requestRunning = false;

        DB.insertTest({
          $id: null,
          $timestamp: json.timestamp,
          $ping_jitter: json.ping.jitter,
          $ping_latency: json.ping.latency,
          $download_bandwidth: json.download.bandwidth,
          $download_bytes: json.download.bytes,
          $download_elapsed: json.download.elapsed,
          $upload_bandwidth: json.upload.bandwidth,
          $upload_bytes: json.upload.bytes,
          $upload_elapsed: json.upload.elapsed,
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
          $speedtest_url: json.result.url
        });

      }

    }

  });

  speedtest.on('close', (code) => {

    //console.log(`child process exited with code ${code}`);
    requestRunning = false;

  });

});

ipcMain.on('request-tests-data', (event, arg) => {

  DB.getTests(mainWindow);

});

ipcMain.on('request-test-data', (event, arg) => {

  DB.getTest(mainWindow, arg);

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

  if (process.platform !== 'darwin') app.quit()
});

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
