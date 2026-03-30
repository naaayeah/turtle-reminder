const {
  app, BrowserWindow, ipcMain,
  nativeTheme, Tray, Menu, nativeImage, screen
} = require('electron');
const path = require('path');

const isMac = process.platform === 'darwin';
const isWin = process.platform === 'win32';

let tray, popover, banner;
let animTimer = null, frameIdx = 0;
const FRAMES = ['icon-1.png', 'icon-2.png'];

function loadFrame(name) {
  const img = nativeImage.createFromPath(path.join(__dirname, '../assets', name));
  const size = isMac ? 18 : 16;
  const r = img.resize({ width: size, height: size });
  if (isMac) r.setTemplateImage(true);
  return r;
}

function startAnim() {
  if (animTimer) return;
  animTimer = setInterval(() => {
    frameIdx = (frameIdx + 1) % FRAMES.length;
    tray.setImage(loadFrame(FRAMES[frameIdx]));
  }, 300);
}

function stopAnim() {
  clearInterval(animTimer); animTimer = null; frameIdx = 0;
  if (tray) tray.setImage(loadFrame(FRAMES[0]));
}

function createPopover() {
  const winOptions = {
    width: 300, height: 540,
    show: false, frame: false, resizable: false,
    alwaysOnTop: true, skipTaskbar: true,
    backgroundColor: '#00000000', transparent: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, nodeIntegration: false,
    },
  };

  // macOS vibrancy (frosted glass)
  if (isMac) {
    winOptions.vibrancy = 'menu';
    winOptions.visualEffectState = 'active';
    winOptions.movable = false;
  }

  popover = new BrowserWindow(winOptions);
  popover.loadFile(path.join(__dirname, 'index.html'));
  popover.on('blur', () => { if (!popover.webContents.isDevToolsOpened()) popover.hide(); });
}

function showPopover() {
  const tb = tray.getBounds();
  const pb = popover.getBounds();
  const { workArea } = screen.getDisplayNearestPoint({ x: tb.x, y: tb.y });

  let x = Math.round(tb.x + tb.width/2 - pb.width/2);
  x = Math.max(workArea.x+4, Math.min(x, workArea.x+workArea.width-pb.width-4));

  // 윈도우: 트레이가 아래에 있으므로 팝업을 위쪽에 표시
  let y;
  if (isWin) {
    y = workArea.y + workArea.height - pb.height - 8;
  } else {
    y = tb.y + tb.height + 4;
  }

  popover.setPosition(x, y);
  popover.show(); popover.focus();
}

function createBanner() {
  const { width } = screen.getPrimaryDisplay().workAreaSize;
  if (banner && !banner.isDestroyed()) banner.destroy();
  banner = new BrowserWindow({
    width: 380, height: 90,
    x: Math.round(width/2 - 190), y: 0,
    show: false, frame: false, resizable: false, movable: false,
    alwaysOnTop: true, skipTaskbar: true, focusable: false,
    backgroundColor: '#00000000', transparent: true,
    webPreferences: {
      preload: path.join(__dirname, 'banner-preload.js'),
      contextIsolation: true, nodeIntegration: false,
    },
  });
  banner.loadFile(path.join(__dirname, 'banner.html'));
}

function showBanner() {
  createBanner();
  banner.once('ready-to-show', () => {
    banner.showInactive();
  });
}

function createTray() {
  tray = new Tray(loadFrame(FRAMES[0]));
  tray.setToolTip('거북이 알림');

  // 윈도우는 더블클릭으로 열기
  if (isWin) {
    tray.on('double-click', () => popover.isVisible() ? popover.hide() : showPopover());
  } else {
    tray.on('click', () => popover.isVisible() ? popover.hide() : showPopover());
  }

  tray.on('right-click', () => {
    tray.popUpContextMenu(Menu.buildFromTemplate([
      { label: '열기', click: showPopover },
      { type: 'separator' },
      { label: '종료', click: () => app.quit() },
    ]));
  });
}

ipcMain.on('show-banner', () => showBanner());
ipcMain.on('hide-banner', () => { if (banner && !banner.isDestroyed()) banner.destroy(); });
ipcMain.on('timer-start', () => startAnim());
ipcMain.on('timer-stop', () => stopAnim());
ipcMain.on('quit', () => app.quit());
ipcMain.handle('get-theme', () => nativeTheme.shouldUseDarkColors ? 'dark' : 'light');
nativeTheme.on('updated', () => {
  popover?.webContents.send('theme-changed', nativeTheme.shouldUseDarkColors ? 'dark' : 'light');
});

app.whenReady().then(() => {
  if (app.dock) app.dock.hide(); // macOS only
  createPopover();
  createBanner();
  createTray();
});

app.on('window-all-closed', e => e.preventDefault());
