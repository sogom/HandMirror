const { app, BrowserWindow, Menu, Tray, dialog, globalShortcut, ipcMain, nativeImage, screen, session } = require('electron');
const path = require('node:path');
const zlib = require('node:zlib');

const WINDOW_SIZE = 320;
const WINDOW_MARGIN = 28;

let mirrorWindow;
let tray;
let registeredShortcut = null;
let isQuitting = false;

const shortcutCandidates = process.platform === 'darwin'
  ? ['Alt+Space', 'CommandOrControl+Shift+M']
  : ['CommandOrControl+Alt+M', 'CommandOrControl+Shift+M'];

if (!app.requestSingleInstanceLock()) {
  app.quit();
}

app.whenReady().then(() => {
  configureCameraPermission();
  createTray();
  registerMirrorShortcut();
  createMirrorWindow();

  app.on('activate', () => {
    showMirror();
  });
});

app.on('second-instance', () => {
  showMirror();
});

app.on('before-quit', () => {
  isQuitting = true;
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (isQuitting) {
    return;
  }
});

ipcMain.on('camera-error', (_event, message) => {
  dialog.showMessageBox({
    type: 'warning',
    title: '카메라를 열 수 없습니다',
    message: message || '카메라 권한 또는 장치를 확인해주세요.'
  });
});

function configureCameraPermission() {
  session.defaultSession.setPermissionCheckHandler((_webContents, permission) => {
    return permission === 'media' || permission === 'camera';
  });

  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
    callback(permission === 'media' || permission === 'camera');
  });
}

function createMirrorWindow() {
  if (mirrorWindow) {
    return mirrorWindow;
  }

  mirrorWindow = new BrowserWindow({
    width: WINDOW_SIZE,
    height: WINDOW_SIZE,
    show: false,
    frame: false,
    transparent: true,
    resizable: false,
    movable: true,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    hasShadow: false,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  mirrorWindow.setAlwaysOnTop(true, process.platform === 'darwin' ? 'floating' : 'screen-saver');
  mirrorWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  mirrorWindow.loadFile(path.join(__dirname, 'mirror.html'));

  mirrorWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      hideMirror();
    }
  });

  mirrorWindow.on('blur', () => {
    if (process.platform === 'win32') {
      mirrorWindow.setAlwaysOnTop(true, 'screen-saver');
    }
  });

  return mirrorWindow;
}

function createTray() {
  tray = new Tray(createTrayIcon());
  tray.setToolTip('HandMirror');
  refreshTrayMenu();

  tray.on('click', () => {
    toggleMirror();
  });
}

function refreshTrayMenu() {
  const shortcutLabel = registeredShortcut || '단축키 등록 실패';
  const menu = Menu.buildFromTemplate([
    {
      label: `손거울 열기/닫기 (${shortcutLabel})`,
      click: toggleMirror
    },
    {
      type: 'separator'
    },
    {
      label: '종료',
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(menu);
}

function registerMirrorShortcut() {
  for (const shortcut of shortcutCandidates) {
    if (globalShortcut.register(shortcut, toggleMirror)) {
      registeredShortcut = shortcut;
      break;
    }
  }

  if (!registeredShortcut) {
    dialog.showMessageBox({
      type: 'warning',
      title: '단축키 등록 실패',
      message: '다른 앱이 단축키를 사용 중입니다. 트레이 아이콘으로 손거울을 열고 닫을 수 있습니다.'
    });
  }

  refreshTrayMenu();
}

function toggleMirror() {
  if (!mirrorWindow || mirrorWindow.isDestroyed()) {
    createMirrorWindow();
  }

  if (mirrorWindow.isVisible()) {
    hideMirror();
  } else {
    showMirror();
  }
}

function showMirror() {
  const win = createMirrorWindow();
  positionWindow(win);
  win.showInactive();
  startCameraWhenReady(win);
}

function hideMirror() {
  if (!mirrorWindow || mirrorWindow.isDestroyed()) {
    return;
  }

  mirrorWindow.webContents.send('mirror:stop-camera');
  mirrorWindow.hide();
}

function startCameraWhenReady(win) {
  if (win.webContents.isLoading()) {
    win.webContents.once('did-finish-load', () => {
      if (win.isVisible()) {
        win.webContents.send('mirror:start-camera');
      }
    });
    return;
  }

  win.webContents.send('mirror:start-camera');
}

function positionWindow(win) {
  const cursorPoint = screen.getCursorScreenPoint();
  const display = screen.getDisplayNearestPoint(cursorPoint);
  const { x, y, width, height } = display.workArea;

  win.setBounds({
    x: Math.round(x + width - WINDOW_SIZE - WINDOW_MARGIN),
    y: Math.round(y + height - WINDOW_SIZE - WINDOW_MARGIN),
    width: WINDOW_SIZE,
    height: WINDOW_SIZE
  });
}

function createTrayIcon() {
  const color = process.platform === 'darwin' ? 255 : 34;
  const image = nativeImage.createFromBuffer(createCirclePng(32, color));
  image.setTemplateImage(process.platform === 'darwin');
  return image;
}

function createCirclePng(size, color) {
  const width = size;
  const height = size;
  const bytesPerPixel = 4;
  const stride = width * bytesPerPixel;
  const raw = Buffer.alloc((stride + 1) * height);
  const center = (size - 1) / 2;
  const outerRadius = size * 0.42;
  const innerRadius = size * 0.25;

  for (let y = 0; y < height; y += 1) {
    const rowStart = y * (stride + 1);
    raw[rowStart] = 0;

    for (let x = 0; x < width; x += 1) {
      const dx = x - center;
      const dy = y - center;
      const distance = Math.sqrt((dx * dx) + (dy * dy));
      const index = rowStart + 1 + (x * bytesPerPixel);
      const onRing = distance <= outerRadius && distance >= innerRadius;
      const onGlint = x >= 10 && x <= 17 && y >= 8 && y <= 11;

      raw[index] = color;
      raw[index + 1] = color;
      raw[index + 2] = color;
      raw[index + 3] = onRing || onGlint ? 255 : 0;
    }
  }

  return Buffer.concat([
    pngSignature(),
    pngChunk('IHDR', createIhdr(width, height)),
    pngChunk('IDAT', zlib.deflateSync(raw)),
    pngChunk('IEND', Buffer.alloc(0))
  ]);
}

function pngSignature() {
  return Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
}

function createIhdr(width, height) {
  const data = Buffer.alloc(13);
  data.writeUInt32BE(width, 0);
  data.writeUInt32BE(height, 4);
  data[8] = 8;
  data[9] = 6;
  data[10] = 0;
  data[11] = 0;
  data[12] = 0;
  return data;
}

function pngChunk(type, data) {
  const typeBuffer = Buffer.from(type, 'ascii');
  const chunk = Buffer.alloc(12 + data.length);
  chunk.writeUInt32BE(data.length, 0);
  typeBuffer.copy(chunk, 4);
  data.copy(chunk, 8);
  chunk.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 8 + data.length);
  return chunk;
}

function crc32(buffer) {
  let crc = 0xffffffff;

  for (const byte of buffer) {
    crc ^= byte;

    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }

  return (crc ^ 0xffffffff) >>> 0;
}
