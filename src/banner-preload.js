const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electronAPI', {
  hideBanner: () => ipcRenderer.send('hide-banner'),
});
