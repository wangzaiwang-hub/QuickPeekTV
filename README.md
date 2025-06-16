# 弹窗摸鱼神器

一款终极的摸鱼工具，它将自己伪装成一个无害的弹窗广告，但内部却是一个功能齐全的迷你浏览器。让你可以在"百忙"之中，光明正大地处理任何"紧急"的网页任务。

## ✨ 核心功能

- **高度伪装**：精心设计的广告样式布局，完美融入任何桌面环境，让人真假难辨。
- **内置浏览器**：左侧核心区域并非视频，而是一个可以加载任意网页的 `BrowserView`。看股票、刷B站、追小说... 一切皆有可能。
- **自由定制**：通过设置面板，可以随意更换要加载的网页地址和页面的缩放比例。
- **置顶显示**：一键切换窗口置顶，确保你的"工作"窗口永远在最上层。
- **无边框拖动**：无原生边框的简洁设计，并实现了窗口任意位置拖动。
- **应用内全屏**：网页中的视频全屏时，将充满整个应用窗口，而不是整个电脑屏幕，保持低调。
- **持久化记忆**：自动保存你上次关闭时的窗口位置、URL和缩放设置。
  
## 📚软件截图
- **主页截图**：
![主页截图](https://github.com/user-attachments/assets/e17be9c2-8892-4e67-8794-633f7e989930)
- **设置截图**：
![设置截图](https://github.com/user-attachments/assets/ab67f5fe-b84c-4ef7-92e9-3bd736824a0f)
- **使用预览**：
![使用预览](https://github.com/user-attachments/assets/de1fe616-2e32-447e-a8f9-c1ee3d601231)

## 🔨 使用方法
- **logo功能**：点击一下是置顶弹窗，弹窗显示在所有软件界面上层
- 
![logo](https://github.com/user-attachments/assets/e3464456-afc9-4184-9553-d5966c1b6cfd)
- **私房按钮**：这其实是设置按钮，输入视频网站可以智能去除广告及其他不相关元素，只留下视频素材
- 
![私房](https://github.com/user-attachments/assets/382497be-b54f-40a5-893f-d43e5defafae)
- **如何关闭**：我希望这是个关不掉的广告，可以一直看直播和视频，所以只能通过下方右击才能关闭软件
- 
![image](https://github.com/user-attachments/assets/53f1d1ed-4398-4225-8b46-0cf022d9d987)
- **注意**：软件默认开启声音及视频自动播放，使用之前先注意自己的环境
- 

## 🚀 下载说明

### 普通用户

直接下载 `dist` 文件夹内的 `摸鱼神器 Setup X.X.X.exe` 安装包，双击安装即可。

### 开发者

如果需要自行修改或运行源码，请按以下步骤操作：

1.  **克隆/下载仓库**
    ```bash
    # (假设你已经有了项目文件)
    ```

2.  **安装依赖**
    ```bash
    npm install
    ```

3.  **启动应用**
    ```bash
    npm start
    ```

## 📦 打包构建

如果对代码进行了修改，可以运行以下命令来重新打包生成 `.exe` 文件：

```bash
npm run build
```

打包后的文件会出现在 `dist` 目录中。

## 🛠️ 技术栈

- **框架**: [Electron](https://www.electronjs.org/)
- **配置持久化**: [electron-store](https://github.com/sindresorhus/electron-store)
- **打包工具**: [electron-builder](https://www.electron.build/)
- **前端**: HTML, CSS, JavaScript

## 📄 许可证

本项目采用 [MIT](https://opensource.org/licenses/MIT) 许可证。 
