// Modules to control application life and create native browser window
const  {app, BrowserWindow, session} = require('electron');
const electron = require('electron');
const path = require('path');
const isDev = require("electron-is-dev");
const {ipcMain} = require('electron');
const speedtest = require("speedtest-net");

let mainWindow;

let requestRunning = false;

ipcMain.on('request-data', (event, arg) => {

  if(requestRunning === true){

    mainWindow.webContents.send('last-request-running', "wait");

    return null;
  }

  requestRunning = true;

  const speedTest = require('speedtest-net')({timeout: 5000});

  speedTest.on('data', data => {

    mainWindow.webContents.send('data', data);
    requestRunning = false;

  });

  speedTest.on('downloadprogress', progress => {

    mainWindow.webContents.send('download-progress', progress);

  });

  speedTest.on('uploadprogress', progress => {

    mainWindow.webContents.send('upload-progress', progress);

  });

  speedTest.on('config', config => {

    mainWindow.webContents.send('config', config);

  });

  speedTest.on('servers', servers => {

    mainWindow.webContents.send('servers', servers);

  });

  speedTest.on('bestservers', servers => {

    mainWindow.webContents.send('best-servers', servers);

  });

  speedTest.on('testserver', server => {

    mainWindow.webContents.send('test-server', server);

  });

  speedTest.on('downloadspeed', speed => {

    mainWindow.webContents.send('download-speed', speed);

  });

  speedTest.on('uploadspeed', speed => {

    mainWindow.webContents.send('upload-speed', speed);

  });

  speedTest.on('downloadspeedprogress', speed => {

    mainWindow.webContents.send('download-speed-progress', speed);

  });

  speedTest.on('uploadspeedprogress', speed => {

    mainWindow.webContents.send('upload-speed-progress', speed);

  });

  speedTest.on('result', url => {

    mainWindow.webContents.send('result', url);

  });

  speedTest.on('error', err => {
    console.error(err);
  });


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
      webSecurity: false
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
  if (process.platform !== 'darwin') app.quit()
});

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
