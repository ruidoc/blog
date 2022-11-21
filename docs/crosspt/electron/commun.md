# 进程间通信

在 Electron 中，主进程是 Node.js 环境，渲染进程是浏览器环境。当在页面中需要调用原生能力时，就需要渲染进程与主进程通信了。

在新版的 Electron 中，进程通信是双向的，可以由渲染进程主动发起，也可以由主进程主动发起。但是浏览器不能访问 Node.js 接口，Node.js 也不能访问 DOM 对象，此时就需要一个桥接层。

Electron 提供了一个名为 “预加载脚本” 的特殊 JavaScript 文件作为桥接层。该文件在创建应用窗口时提供，网页加载之前执行。文件中可以同时访问 DOM 对象和 Node.js 全局对象。

## 预加载脚本

创建一个 `libs/preload.js` 文件作为预加载脚本，然后在创建应用窗口时指定：

```js
const path = require('path');
const preload = path.join(__dirname, './libs/preload.js');
const window = new BrowserWindow({
  width: 800,
  height: 600,
  webPreferences: {
    preload,
  },
});
```

当窗口打开时该文件会加载执行。在文件中写入如下内容：

```js
// preload.js
console.log('浏览器环境：', window);
console.log('Node.js环境：', process);
```

运行代码，并打开浏览器控制台，就能看到打印出来的 window 和 process 对象。

> 从浏览器控制台打印出内容，说明代码是在浏览器环境中执行的，只不过是将 Node.js 中的 process 对象作为全局变量加在了浏览器环境中。

在预加载脚本中可以通过 `contextBridge` 接口为浏览器设置全局对象，以此来将 Node.js 获取到的数据暴露给浏览器。

### contextBridge 模块

通过 contextBridge 模块可以为 html 页面定义全局对象。如下：

```js
// preload.js
const { contextBridge } = require('electron');
contextBridge.exposeInMainWorld('elecAPI', {
  version: process.version,
});
```

上面定义的全局对象，在页面中就可以这样访问：

```html
<!-- index.html -->
<script>
  var version = window.elecAPI.version;
  console.log(version); // Node.js 版本
</script>
```

> 注意：contextBridge 只能在预加载脚本中使用，别处无效。

## 进程间通信

进程间通信（IPC），主要是指主进程和渲染进程之间的通信。主进程通信在 main.js 中发起，渲染进程通信在 preload.js（预加载文件）中发起。

渲染进程中使用 `ipcRenderer` 模块发起/接受消息，主进程使用 `ipcMain` 模块发起/接受消息。下面看看这两个模块怎么用。

### ipcRenderer 模块

首先在 preload.js 中导入模块：

```js
const { ipcRenderer } = require('electron');
```

渲染进程主动向主进程发送消息，使用 `ipcRenderer.invoke()` 方法实现。该方法的第一个参数是字符串，表示唯一的消息标识，类似于事件名称。后面的参数可以任意定义。

```js
ipcRenderer.invoke('get-env', 'index').then((res) => {
  console.log(res); // 主进程返回的值
});
```

如上，该方法执行后返回一个 `Promise`。当主进程收到消息并返回结果时，会触发 `.then` 函数，并收到主进程发来的结果，此时一次通信结束。

一般情况下，发起消息会在 HTML 页面中触发，返回结果也会在页面中获取，此时就要将 ipcRenderer 和 contextBridge 搭配使用。

定义一个全局变量，下面再定义一个函数，如下：

```js
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('elecAPI', {
  getEnv: () => ipcRenderer.invoke('get-env'),
});
```

在全局变量 elecAPI 下定义的函数 `getEnv` 返回一个 ipcRenderer.invoke() 执行后的 Promise，那么在 HTML 页面中即可这样使用：

```html
<script>
  window.elecAPI.getEnv().then((res) => {
    console.log(res); // 主进程返回结果
  });
</script>
```

渲染进程除了向主进程主动发送消息，还可以监听主进程发来的消息。监听消息使用 `ipcRenderer.on()`。

当然，监听消息一般也在 HTML 页面中监听。结合上面的案例，可以这样定义：

```js
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('elecAPI', {
  onInfo: (callback) => ipcRenderer.on('on-info', callback),
});
```

渲染进程监听到消息后触发页面中传来的回调函数，在页面中即可这样使用：

```html
<script>
  window.elecAPI.onInfo((res) => {
    console.log(res); // 主进程返回结果
  });
</script>
```

渲染进程的发送和监听消息就是这些，接着再看主进程的实现。

### ipcMain 模块

在 main.js 中通过导入 ipcMain 模块：

```js
const { ipcMain } = require('electron');
```

对于渲染进程发来的消息，主进程通过 `ipcMain.handle()` 方法来监听并处理。第一个参数是渲染进程的唯一消息标识，比如上面的 `get-env` 消息，接受并处理如下：

```js
ipcMain.handle('get-env', (from) => {
  console.log(from); // index
  return Promise.resolve(process.env.NODE_ENV);
});
```

如上，在回调函数中 `return` 一个 Promise，就会触发渲染进程中的 `.then` 函数，并将返回后的值传给渲染进程。

主进程向渲染进程发送消息，会用到渲染进程实例。还记得前面说要把渲染进程实例保存起来吗？因为该实例除了可以关闭窗口，还可以发送消息：

```js
var win = new BrowserWindow();
// 向该渲染进程发送消息
win.webContents.send('main-info', { label: 'hello' });
```

然后渲染进程内可以监听消息了：

```js
ipcRenderer.on('main-info', (value) => {
  console.log(value.label); // hello
});
```
