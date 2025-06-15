const { app, BrowserWindow, ipcMain, BrowserView } = require('electron');
const path = require('path');

let Store;
let mainWindow;
let settingsWindow;
let view; // BrowserView 实例
let originalBounds = null; // 用于标记是否处于"应用内全屏"状态

// 异步初始化，用于动态导入 ES Module
async function initialize() {
    const { default: store } = await import('electron-store');
    Store = store;
}

function createWindow() {
    const store = new Store();
    const lastWindowState = store.get('windowBounds', { width: 1000, height: 750 });

    mainWindow = new BrowserWindow({
        x: lastWindowState.x,
        y: lastWindowState.y,
        width: lastWindowState.width,
        height: lastWindowState.height,
        frame: false,
        icon: path.join(__dirname, 'assets/images/icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    mainWindow.loadFile('index.html');

    // 在主窗口上监听 'resize' 事件
    mainWindow.on('resize', () => {
        // 如果处于"应用内全屏"模式，则始终让 BrowserView 填满窗口
        if (originalBounds) {
            const [width, height] = mainWindow.getContentSize();
            view.setBounds({ x: 0, y: 0, width, height });
        }
    });

    // 保存窗口位置
    mainWindow.on('close', () => {
        if (mainWindow) {
            store.set('windowBounds', mainWindow.getBounds());
        }
    });

    // 创建 BrowserView
    view = new BrowserView({
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        }
    });

    // 诊断结束，移除背景色
    // view.setBackgroundColor('#FF00FF');

    mainWindow.setBrowserView(view);
    view.setAutoResize({ width: true, height: true, horizontal: true, vertical: true });

    // 监听 BrowserView 的全屏事件
    view.webContents.on('enter-html-full-screen', () => {
        originalBounds = view.getBounds();
        view.setAutoResize({ width: false, height: false });
        const [width, height] = mainWindow.getContentSize();
        view.setBounds({ x: 0, y: 0, width, height });
    });

    view.webContents.on('leave-html-full-screen', () => {
        if (originalBounds) {
            view.setAutoResize({ width: true, height: true, horizontal: true, vertical: true });
            view.setBounds(originalBounds);
            originalBounds = null;
        }
    });

    // 从 store 加载 URL 和缩放设置
    const settings = store.get('settings', { url: 'https://www.baidu.com', zoom: 1.0 });
    view.webContents.loadURL(settings.url);
    view.webContents.on('did-finish-load', () => {
        const currentSettings = store.get('settings', { zoom: 1.0 });
        view.webContents.setZoomFactor(currentSettings.zoom);

        // 【重新启用】终极版"播放器净化"脚本 V5 - 野蛮模式
        const isolationScript = `
            (function() {
                setTimeout(() => {
                    try {
                        const selectors = 'video[src], iframe, #player, #player-container, .player-container, #video-player, .video-player, #video, #videoContainer, .txp_player_root';
                        const candidates = Array.from(document.querySelectorAll(selectors));
                        let mainPlayer = null;
                        let maxArea = 0;

                        for (const el of candidates) {
                            const rect = el.getBoundingClientRect();
                            if (rect.width * rect.height > maxArea && rect.width > 200) {
                                maxArea = rect.width * rect.height;
                                mainPlayer = el;
                            }
                        }

                        if (!mainPlayer) return;

                        // 隐藏所有其他元素
                        Array.from(document.body.children).forEach(child => {
                            if(child !== mainPlayer && !child.contains(mainPlayer)) {
                                child.style.setProperty('display', 'none', 'important');
                            }
                        });
                        
                        // 暴力撕扯：直接将播放器附加到body，脱离原始父容器
                        document.body.appendChild(mainPlayer);
                        document.body.style.setProperty('overflow', 'hidden', 'important');
                        document.documentElement.style.setProperty('overflow', 'hidden', 'important');

                        // 强制播放器占据整个视口
                        Object.assign(mainPlayer.style, {
                            position: 'fixed',
                            top: '0', left: '0',
                            width: '100vw', height: '100vh',
                            zIndex: '2147483647',
                            border: 'none', margin: '0', padding: '0'
                        });

                        // 强制内部video/iframe标签完美填充
                        const innerMedia = mainPlayer.matches('video, iframe') ? mainPlayer : mainPlayer.querySelector('video, iframe');
                        if (innerMedia) {
                            // 终极强化：注入CSS样式并持续监控
                            const styleId = 'player-override-style';
                            if (!document.getElementById(styleId)) {
                                const styleElement = document.createElement('style');
                                styleElement.id = styleId;
                                styleElement.innerHTML = 'video, iframe { width: 100% !important; height: 100% !important; object-fit: cover !important; }';
                                document.head.appendChild(styleElement);
                            }

                            const forceFill = (media) => {
                                media.style.setProperty('width', '100%', 'important');
                                media.style.setProperty('height', '100%', 'important');
                                media.style.setProperty('object-fit', 'cover', 'important');
                            };

                            forceFill(innerMedia);

                            const observer = new MutationObserver(() => {
                                const currentMedia = mainPlayer.querySelector('video, iframe');
                                if (currentMedia) {
                                    forceFill(currentMedia);
                                }
                            });
                            observer.observe(mainPlayer, { attributes: true, childList: true, subtree: true, attributeFilter: ['style', 'class'] });
                        }

                    } catch (e) { console.error('Isolation script V5 failed:', e); }
                }, 2500);
            })();
        `;
        view.webContents.executeJavaScript(isolationScript).catch(err => {
             if (err) console.error('Failed to execute script:', err);
        });
    });
}

function createSettingsWindow() {
    if (settingsWindow && !settingsWindow.isDestroyed()) {
        settingsWindow.focus();
        return;
    }
    settingsWindow = new BrowserWindow({
        width: 450,
        height: 250,
        parent: mainWindow,
        modal: true,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    });
    settingsWindow.loadFile('settings.html');
    settingsWindow.on('closed', () => {
        settingsWindow = null;
    });
}

app.whenReady().then(async () => {
    await initialize();
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// --- IPC ---

ipcMain.on('toggle-always-on-top', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) {
        const isAlwaysOnTop = win.isAlwaysOnTop();
        win.setAlwaysOnTop(!isAlwaysOnTop);
        event.reply('always-on-top-status', !isAlwaysOnTop);
    }
});

ipcMain.on('update-view-bounds', (event, bounds) => {
    if (view && !view.webContents.isDestroyed() && mainWindow) {
        const { x, y, width, height } = bounds;
        const [winWidth, winHeight] = mainWindow.getContentSize();

        if (width <= 0 || height <= 0 || x < 0 || y < 0 || x + width > winWidth + 5 || y + height > winHeight + 5) {
            return;
        }
        
        const newBounds = { x: Math.round(x), y: Math.round(y), width: Math.round(width), height: Math.round(height) };

        if (originalBounds) {
            originalBounds = newBounds;
            return;
        }
        
        view.setBounds(newBounds);
    }
});

ipcMain.on('open-settings-window', () => {
    createSettingsWindow();
});

ipcMain.on('settings-updated', () => {
    const store = new Store();
    const settings = store.get('settings');
    if (view && !view.webContents.isDestroyed() && settings) {
        if (view.webContents.getURL() !== settings.url) {
            view.webContents.loadURL(settings.url);
        }
        // 在加载完成后再设置缩放，效果更好
        view.webContents.once('did-finish-load', () => {
            view.webContents.setZoomFactor(settings.zoom);
        });
    }
    if (settingsWindow && !settingsWindow.isDestroyed()) {
        settingsWindow.close();
    }
});

// --- 为设置窗口添加 IPC 监听器 ---

// 处理从设置窗口获取当前设置的请求
ipcMain.handle('get-settings', async () => {
    const store = new Store();
    return store.get('settings', { url: 'https://v.qq.com', zoom: 1.0 });
});

// 处理保存新设置的请求
ipcMain.on('set-settings', (event, settings) => {
    const store = new Store();
    store.set('settings', settings);
    // 通知主窗口更新内容
    ipcMain.emit('settings-updated'); 
});

// 处理关闭设置窗口的请求
ipcMain.on('close-settings-window', () => {
    if (settingsWindow && !settingsWindow.isDestroyed()) {
        settingsWindow.close();
    }
}); 