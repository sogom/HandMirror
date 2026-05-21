const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('handMirror', {
  onStartCamera(callback) {
    ipcRenderer.on('mirror:start-camera', callback);
  },
  onStopCamera(callback) {
    ipcRenderer.on('mirror:stop-camera', callback);
  },
  reportCameraError(message) {
    ipcRenderer.send('camera-error', message);
  }
});
