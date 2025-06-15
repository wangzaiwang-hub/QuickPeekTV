const { ipcRenderer } = require('electron');

const urlInput = document.getElementById('video-url-input');
const zoomInput = document.getElementById('zoom-factor-input');
const saveBtn = document.getElementById('save-btn');
const closeBtn = document.getElementById('close-btn');

// --- 功能：页面加载时，获取并显示当前保存的设置 ---
async function loadCurrentSettings() {
    const settings = await ipcRenderer.invoke('get-settings');
    if (urlInput) {
        urlInput.value = settings.url || '';
    }
    if (zoomInput) {
        zoomInput.value = settings.zoom || 1.0;
    }
}

// --- 功能：保存按钮点击事件 ---
saveBtn.addEventListener('click', () => {
    const newSettings = {
        url: urlInput.value,
        zoom: parseFloat(zoomInput.value) || 1.0
    };
    ipcRenderer.send('set-settings', newSettings);
});

// --- 功能：返回按钮点击事件 ---
closeBtn.addEventListener('click', () => {
    ipcRenderer.send('close-settings-window');
});

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', loadCurrentSettings); 