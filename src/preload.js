const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electronAPI', {
  showBanner: () => ipcRenderer.send('show-banner'),
  timerStart: () => ipcRenderer.send('timer-start'),
  timerStop: () => ipcRenderer.send('timer-stop'),
  getTheme: () => ipcRenderer.invoke('get-theme'),
  onThemeChange: (cb) => ipcRenderer.on('theme-changed', (_, t) => cb(t)),
  quit: () => ipcRenderer.send('quit'),
});
