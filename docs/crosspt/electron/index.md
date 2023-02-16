---
group:
  title: Electron
  path: /electron
  order: 3
order: 3
---

# 认识 Electron

Electron 是一个使用 JavaScript、HTML 和 CSS 构建桌面应用程序的框架。框架内部嵌入了 Chromium 和 Node.js。Chromium 负责界面的渲染，所以应用窗口像一个 Chrome 浏览器；Node.js 主要关注逻辑部分，负责系统底层能力的调用。

Electron 拥有一个进程的概念。何为进程？计算机里面任何运行起来的程序都是一个进程。比如电脑里的微信、浏览器，当你不打开它的时候它只是一个程序，当你打开它，它就会作为一个进程运行起来。

Electron 拥有两类进程，分别是：

- 主进程：负责应用的全局调度，Node.js 环境。
- 渲染进程：一个打开的窗口（页面），浏览器环境。

主进程只有一个，渲染进程可以有多个。主进程负责应用的初始化，负责创建和管理渲染进程；渲染进程的对外表现是一个应用窗口，对内表现是一个 html 页面，当页面打开时一个渲染进程就会创建，页面关闭时该渲染进程销毁。

不同进程之间需要互相通信，这是一个比较麻烦的工作。因此使用 Electron 建议尽可能少的创建窗口，一般不超过三个，否则进程通信和状态同步会损耗资源，且降低开发效率。

## 安装 electron

使用 yarn 安装 Electron，并加入开发依赖：

```sh
$ yarn add electron -D
```

在安装 Electron 过程中，除了会下载 npm 包，还会在系统中下载一个预编译的二进制文件，该文件用于执行 计算机的底层操作。

下载预编译文件非常耗时。事实上我们只需要下载一次，但是默认情况下当你运行 `yarn` 或安装一个新的包时，该文件会重新下载。

因此当应用初始化后再安装任何新包时，请记着跳过编译文件下载，方法如下：

```sh
$ ELECTRON_SKIP_BINARY_DOWNLOAD=1 yarn
```

## 主进程

主进程是 Node.js 运行环境，入口文件统一为 main.js。在 main.js 中可以充分使用 Node.js 的能力，用于控制应用的生命周期、管理渲染进程等。

```js
// 1. 导入模块
const { app, BrowserWindow } = require('electron');

// 2. 创建窗口函数
const createWindow = () => {
  let win = new BrowserWindow({
    width: 800, // 窗口宽度
    height: 600, // 窗口高度
  });
  win.loadFile('index.html');
};

// 3. 初始化后执行函数
app.whenReady().then(() => {
  createWindow();
});
```

代码中的 createWindow() 方法创建了一个应用窗口（渲染进程）。app.whenReady() 表示主进程初始化后的声明周期，这里是最早可以调用 createWindow() 方法的地方。

在项目目录下运行以下命令，main.js 就会被执行。

```sh
$ electron .
```

于此同时，电脑会打开一个应用窗口，正是 index.html 的页面内容。

主进程负责一切在浏览器中干不了的事情。比如获取电脑某个文件夹的信息，获取系统版本等。因此除了开发页面内容，所有原生应用等能力都由主进程提供。

## 渲染进程

渲染进程是应用中的窗口，类似于一个 chrome 浏览器。浏览器可以打开多个 tab 页，Electron 也可以打开多个窗口，每个窗口都对应一个渲染进程，可以被随时创建和销毁。

实例化 BrowserWindow() 时会指定一个 html 文件作为页面，并返回一个渲染进程实例。记得把这个实例存起来。

```js
class {
  constructor() {
    this.window = null;
  }
  createWindow() {
    let win = new BrowserWindow();
    win.loadFile('index.html');
    this.window = win
  }
  close() {
    if(this.window) {
      this.window.close()
    }
  }
}
```

如果页面上有“退出”按钮，点击后调用上面代码中的 `close()` 方法，就会关闭窗口。

渲染进程既然是一个浏览器，那么浏览器的调试神器“控制台”必不可少。当我们需要调试页面时，用以下方式打开浏览器控制台：

```js
let win = new BrowserWindow();
win.loadFile('index.html');
// 打开控制台
win.webContents.openDevTools();
```

窗口创建与销毁只是模拟了浏览器页面的打开与关闭，最重要的还是页面开发。这里大家最关心的问题是：能不能使用 JavaScript 框架开发？

当然可以！在 html 文件中，这里和普通的 Web 开发并无区别。我们选择简单轻量的框架 ——— Vue 来提高页面的开发效率。

> 如果你是初次使用 Electron，建议不要使用像 electron-vue 这种集成丰富的框架，它很难让你体会到 Elctron 与 Web 开发的区别在哪。我们仅用普通导入 js 文件的方式引入 Vue，舍掉一切构建工具，从简单开始。

首先安装 Vue：

```
$ yarn add vue@2
```

接着创建 `pages/index` 文件夹存放首页代码。将页面文件 index.html 放到此处，再创建 index.js，并在页面文件中引入：

```html
<script src="../../node_modules/vue/dist/vue.js"></script>
<script src="./index.js"></script>
```

在 index.js 中就可以实例化 Vue，书写页面逻辑了：

```js
// index.js
const data = {
  loading: false,
};

const methods = {
  setLoading() {
    this.loading = !this.loading;
  },
};

var app = new Vue({
  el: '#app',
  data,
  methods,
});
```

如果应用中还需要其他窗口，将上面的 index 文件夹复制一份，放到同级目录下就可以了。

除了使用 Vue，自然还免不了 CSS。写习惯了 less 嵌套语法表示不想再写层层重复的 css 了，所以还是用 less 吧。首先全局安装 less：

```sh
$ npm install -g less
```

安装 less 后，会提供全局 `lessc` 命令用于编译。再新建一个 index.less 文件：

```less
// index.less
#app {
  font-size: 20px;
}
```

然后在终端编译该文件，输出 index.css：

```sh
$ lessc ./index.less ./index.css
```

最后在 html 中引入 index.css 即可。
