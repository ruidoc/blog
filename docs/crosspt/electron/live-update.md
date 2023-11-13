# Electron 热更新

Electron 的热更新不会像 Ionic 一样直接下载 Web 代码静默更新，Electron 更新需要走安装流程，因为它有主进程（Node.js），不仅仅是前端代码。

但是 Electron 的热更新分为“全量更新”和“增量更新”。全量更新是下载完整包并安装，增量更新则是下载差异包安装，当然差异包会更小一些。

不过 Electron 与 Ionic 在检测版本、判断是否有新版本、下载新包方面的逻辑基本是一样的，Electron 的热更新使用 `electron-builder` 实现。

## 认识 electron-builder

本地开发 Electron 项目使用命令就可以启动，
