# Electron

Vite 插件：

1. vite-plugin-electron
2. vite-plugin-electron-renderer（渲染进程中使用 Node.js API）

关键知识点：

1. 通过 process.platform 判断平台（win32/darwin/linux）
2. 通过 new BrowserWindow()创建浏览器窗口
3. 一个窗口对应一个渲染进程

BrowserWindow 参数：

- webPreferences：渲染进程 web 页的设置
  1. nodeIntegration：是否访问 Node.js 的全局变量，默认禁用。
  2. preload：指定预加载脚本
  3. session: 设置页面的缓存规则
  4. contextIsolation：创建隔离上下文，网页和 preload 不能访问全局变量
  5. webSecurity：web 安全，限制同源策略

## 预加载脚本

一个 JavaScript 文件，作为进程通信的桥接层，会在网页加载之前执行。文件中可以同时访问 DOM 对象和 Node.js 全局对象。

1. `contextBridge` 模块：可以为 Web 页面定义全局对象。
2. `ipcRenderer` 模块：渲染进程向主进程发送[.invoke()]或监听[.on()]消息
3. `ipcMain` 模块：主进程监听[.handle()]渲染进程的消息
4. `win.webContents.send()`：向渲染进程发送消息

```js
const { contextBridge } = require('electron');
contextBridge.exposeInMainWorld('elecAPI', {
  version: process.version,
});
```

## 性能优化建议：

- 渲染进程

1. 减少 DOM 复杂度（层级）
2. 路由按需加载
3. 图片加载优化（压缩、webp）
4. 大列表，虚拟列表

- 主进程

1. 子进程异步任务
2. 合理使用 IPC 通信
3. 使用合理的图像缓存策略
4. 使用本地存储（sqlite）而非内存
5. 合适时机，清理缓存：session.clearCache()
6. 密集计算的，使用 Worker 线程
7. 图片处理，使用硬件加速，减少重绘次数
8. 使用 Performance Tab 性能分析面板
9. 使用代码混淆和压缩工具
10. 精简第三方依赖，较少过度使用子进程

- 整体应用优化

1. 添加启动窗口，解决闪烁和白屏问题（主窗口启动隐藏，监听 ready-to-show 事件后再显示）
2. 添加“单实例锁”防止进程多开（解决窗口重复点击问题）
3.

打包目标：

- Window：目标 nsis，架构 x64。
- Mac：目标 dmg，架构为 darwin
- Linux：目标 deb，架构为

打包优化建议（在 quaser.config.js 中指定打包工具为 electron-builder）：

1. 启用 asar 压缩代码
2. 设置 window 打包目标为 nsis，自定义安装/卸载设置
3. 设置 publish 字段，配合 electron-updater 实现自动更新，展示下载进度等
4. 自研基于 asar 的免安装热更新
5. 使用 bytenode 混淆 asar 代码（生成 jsc 文件），提高安全性
6. 使用子进程执行 window 的文件操作命令
