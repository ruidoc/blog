---
order: 3
---

# 自定义接口检查更新

上一篇我们详细介绍了 Electron 自动更新的全流程。

简单来说，就是在打包时生成 latest.yml 文件和安装包，并将其上传到服务器。客户端每次打开时会访问远程的 latest.yml 来判断是否需要更新，需要则自动下载安装包并更新。

对于以上的更新流程，有朋友在评论区留言表示不够灵活，比如：

- 只能自动更新吗？能不能通过后端接口来判断是否更新？
- 必须要用 latest.yml 吗？能不能绕开它？
- 如何区分 Window、Mac、Mac M1 三种安装包？

下面我们一一解答这些问题，并手撸一个更灵活的自动更新接口。

## 如何本地测试更新？

在开发阶段想测试一下检测更新的流程走没走通，可能不太好测试，因为 Electron 默认在开发环境下会绕过更新检测。

开发环境下 Electron 启动后，如果接入了自动更新，主进程控制台会打印下面的信息：

> Skip checkForUpdates because application is not packed and dev update config is not forced

意思是当前是开发环境，未打包，所以绕过检测。Electron 通过 `app.isPackaged` 的值来判断是否打包，那么在开发环境下，我们可以修改一下这个值：

```js
import { app } from 'electron';

// 未打包时是开发环境
if (!app.isPackaged) {
  Object.defineProperty(app, 'isPackaged', {
    get: () => true,
  });
}
```

重新运行，会发现检测更新的逻辑执行了。此时会看到第二个错误：

> Error: ENOENT: no such file or directory /xxxx/app-update.yml

因为没有打包嘛，所以找不到 `app-update.yml` 这个文件，索性我们就创建一个。在根目录下创建一个 `dev-update.yml` 文件（文件名可自定义），写入配置：

```yml
provider: generic
updaterCacheDirName: demo-updater # 下载目录
```

然后在开发环境指定这个配置文件地址：

```js
import { app } from 'electron';
import path from "path";

if(!app.isPackaged) {
  ...
  autoUpdater.updateConfigPath = path.join(__dirname, "../../dev-update.yml");
}
```

重新运行项目，会发现检测更新的逻辑可以正常执行了。

## 能不能绕开 latest.yml，走后端接口？

可能大家希望的检查更新流程是这样：

> 调用后端的 API 接口，接口返回 JSON 格式数据，包含最新的版本号和安装包下载地址。将该版本号与本地版本号做对比，如果不一样则表示有更新，并执行下载。

然而 `electron-updater` 是通过 `latest.yml` 文件来获取版本号等信息。latest.yml 是一个配置文件，内容如下：

```yml
version: 1.0.25
files:
  - url: tv-player_1.0.25.exe
    sha512: xxxxxx
    size: 72716511
path: tv-player_1.0.25.exe
sha512: xxxxxx
releaseDate: '2023-11-29T02:28:28.032Z'
```

大家想绕过它，可能是因为 YAML 文件的内容看不太懂，或者与接口格式不匹配。其实它就是一个普通的配置文件，转换成 JSON 格式如下：

```json
{
  "version": "1.0.25",
  "files": [
    {
      "url": "tv-player_1.0.25.exe",
      "sha512": "xxxxxx",
      "size": "72716511"
    }
  ],
  "path": "tv-player_1.0.25.exe"
}
```

可能有人会问：配置文件可以改成 `latest.json` 吗，这样后端就可以动态返回了。

我仔细查阅过文档，目前只支持 YAML 文件，不支持 JSON，所以 latest.yml 无法绕开。但这只是官方说法，咱还是有办法滴。

经过大量测试，我发现把 latest.yml 文件的内容手动改成 JSON 格式也是可以的。这样的话，就可以写一个接口来模拟 latest.yml 的地址。

假设 latest.yml 的访问路由是 `/ele-app/latest.yml`，那么写一个接口如下：

```js
const app = require('express')()

app.get('/ele-app/latest.yml', (req, res, next) => {
  let resinfo = {
    version: "1.0.25",
    path: "xxx_1.0.25.exe"
    sha512: "xxxxxx"
  }
  res.send(resinfo)
})
```

该接口就是自定义的检测更新接口。接口返回值中至少要包含 `version`，`path`，`sha512` 三个属性（与 latest.yml 中的配置保持一致）。这样我们不需要上传 latest.yml 文件了，用该接口替代即可。

基于该检测更新接口，接下来我们逐步实现自定义更新流程。

## 如何区分 Windows 和 Mac 系统

对于 Windows 和 Mac 两个系统的更新，electron-updater 使用不同的配置文件，分别是 `latest.yml` 和 `latest-mac.yml`。

从上一步的检测更新接口来看，不同的配置文件就是不同的路由，我们改造接口如下：

```js
app.get('/ele-app/:platform', (req, res, next) => {
  let { platform } = req.params
  let resinfo = null
  // 返回 Window 配置
  if(platform == 'latest.yml') {
    resinfo = {
      version: "1.0.25",
      path: "xxx_1.0.25.exe"
      sha512: "xxxxxx"
    }
  }
  // 返回 Mac 配置
  if(platform == 'latest-mac.yml') {
    resinfo = {
      version: "1.0.33",
      path: "xxx_1.0.33.dmg"
      sha512: "xxxxxx"
    }
  }
  if(!resinfo) {
    resinfo = { code: 400, msg: '参数错误' }
  }
  res.send(resinfo)
})
```

上面代码中，使用动态路由返回 Window 和 Mac 的配置，同时兼容了两个平台的更新检测。

## 完整的自定义更新流程

经过上面的介绍，自定义检测更新的关键思路已经讲清楚了。下面我们梳理一下完整的更新流程。

（1）打包各个平台的安装包，上传服务器。

如何打包在上一篇介绍过，就不展开了。注意的是：现在你只需要上传安装包，不需要上传 latest.yml 文件了。

（2）在主进程中设置更新地址，并手动控制更新。

假设我们编写的检测更新接口已经部署，设置方法如下：

```js
import { autoUpdater } from 'electron-updater';

// 设置检测更新的地址
autoUpdater.setFeedURL('http://[xxx]/ele-app');
// 不自动下载
autoUpdater.autoDownload = false;
// 触发检测
autoUpdater.checkForUpdatesAndNotify().catch();

// 监听到可更新
autoUpdater.on('update-available', (info) => {
  // info 是检测更新接口返回的数据
  if (info.can_download) {
    // can_download 是自定义属性
    autoUpdater.downloadUpdate();
  }
});
```

（3）编写检测更新接口，返回配置

返回的配置我们可以自定义，假设返回结果如下：

```json
{
  "version": "1.0.25",
  "path": "http://xxx/xxx_1.0.25.exe",
  "sha512": "xxxxxx",
  "can_download": false
}
```

上述示例中，接口返回了自定义属性 `can_download` 表示是否执行下载更新，在第（2）步中使用到了该属性。

通过这种方式，即便我们更新了安装包，也可以自由决定是否要下载安装。

这里有一个小惊喜：`path` 属性的值可以是一个完整的安装包地址，这样可以把安装包上传到任意地方。如果值是一个文件名，那么会以第（2）步中 `setFeedURL()` 方法设置的地址为前缀。

> 提醒：sha512 属性的值必须从打包生成的 latest.yml 中获取，不可以随意写，否则在安装时不能通过检验，会报这个错：
>
> Error: sha512 checksum mismatch

## 特别篇：Mac 如何区分 Intel 和 M1？

Mac 系统有两种软件包，分别对应 M1 芯片和 Intel 芯片，两者不兼容。一般打包时我们也会构建两种安装包。

那么在检测更新时，我们就需要返回适配当前系统的安装包。但不管是 M1 还是 Intel 都使用 `latest-mac.yml` 这一个配置文件，该如何区分呢？

这个时候就要从主进程中获取参数，然后传给接口了。步骤如下：

（1）在主进程中，获取系统架构，并通过请求头传给检测更新接口。

```js
import { autoUpdater } from 'electron-updater';

// 添加请求头
autoUpdater.requestHeaders = {
  elearch: process.arch,
};
```

（2）在接口中接收参数，并在返回 Mac 配置中判断：

```js
app.get('/ele-app/:platform', (req, res, next) => {
  let { platform } = req.params
  let { elearch } = req.headers

  if(platform == 'latest-mac.yml') {
    if(elearch == 'arm64') {
      // M1
      return {...}
    } else {
      // Intel
      return {...}
    }
  }
})
```

有了上面的逻辑，我们在打包时就可以单独打两个包，分别上传，检测时返回不同的下载地址即可。
