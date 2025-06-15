const { ipcRenderer, shell } = require('electron');

// --- 窗口置顶 & 设置 & 外部链接 ---

// 使用可选链操作符(?.)来安全地添加事件监听器，避免在元素不存在时报错
document.getElementById('logo-toggle')?.addEventListener('click', () => {
    ipcRenderer.send('toggle-always-on-top');
});

document.getElementById('settings-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    ipcRenderer.send('open-settings-window');
});

document.getElementById('github-link')?.addEventListener('click', (e) => {
    e.preventDefault(); // 阻止应用内导航
    shell.openExternal(e.currentTarget.href); // 调用系统浏览器打开链接
});

ipcRenderer.on('always-on-top-status', (event, isAlwaysOnTop) => {
    const statusDiv = document.getElementById('status');
    if (statusDiv) {
        statusDiv.textContent = isAlwaysOnTop ? '置顶已开启' : '置顶已关闭';
        setTimeout(() => {
            if (statusDiv) statusDiv.textContent = '';
        }, 2000);
    }
});

// --- BrowserView 定位 (最终简化版) ---
const videoContainer = document.getElementById('browser-view-container');
let animationFrameId = null;

const sendBounds = () => {
    // 使用 requestAnimationFrame 避免在快速变化中发送过多无效信息
    if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
    }
    animationFrameId = window.requestAnimationFrame(() => {
        if (!videoContainer) return;
        const rect = videoContainer.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
            ipcRenderer.send('update-view-bounds', {
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: rect.height,
            });
        }
    });
};

// 页面加载、窗口大小变化、滚动时都触发更新
window.addEventListener('DOMContentLoaded', sendBounds);
window.addEventListener('resize', sendBounds);
document.querySelector('.content')?.addEventListener('scroll', sendBounds);

// 使用 ResizeObserver 作为最可靠的最终保障
if (videoContainer) {
    const resizeObserver = new ResizeObserver(sendBounds);
    resizeObserver.observe(videoContainer);
}

// 旧的定位逻辑已全部移除，此文件现在非常干净。 