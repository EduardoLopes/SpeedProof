const {
  contextBridge,
  ipcRenderer
} = require("electron");

contextBridge.exposeInMainWorld(
  "api", {
    send: (channel, data) => {
      ipcRenderer.send(channel, data);
    },
    receive: (channel, callback) => {
      ipcRenderer.on(channel, callback);
    },
    receiveOff: (channel, callback) => {
      ipcRenderer.removeListener('config-data', callback);
    },
    openItem: (item) => {
      electron.shell.openItem(item)
    }
  });