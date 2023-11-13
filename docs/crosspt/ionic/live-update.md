# Ionic 热更新

对于 Hybrid App，也就是原生和 Web 混合开发的应用，其 Web 部分都支持热更新（包括 React Native 和 Ionic）。所谓热更新就是在不需要重新安装 App 的情况下，直接更新 Web 部分的代码，从而动态更新页面的技术。

热更新只能更新 Web 代码，这是热更新的前提条件，也是其实现原理。

## 核心方案

在 Ionic 中，使用 `@capgo/capacitor-updater` 这个包来实现热更新。首先安装这个包：

```sh
$ yarn add @capgo/capacitor-updater@4
```

假设现在 Web 代码已更新，我们将其打包成 zip 文件传到服务器上，地址为 http://example.com/dist.zip

那么在 App 中的更新方式共有三步：

```js
import { CapacitorUpdater } from '@capgo/capacitor-updater';

// 1. 初始化
CapacitorUpdater.notifyAppReady();
// 2. 下载更新包
let data = await CapacitorUpdater.download({
  url: 'http://example.com/dist.zip',
  version: 'v0.1.1', // 更新的版本
});
// 3. 执行热更新
CapacitorUpdater.set(data);
```

以上三步执行完成，App 会重新加载新的 Web 代码，完成热更新。

## 实现细节

从实现细节来说，我们还要有诸多条件和判断。最关健的问题是：什么时候检测更新？如何检测到有新的版本发布？

### 1. 什么时候检测更新？

App 检测是否有更新肯定要与服务器交互，因此不能一直在检测，需要提供一个时机。比较好的方案是 App 每次进入的时候检测一次，因此需要监听 App 打开。

监听 App 的前后台切换需要 `@capacitor/app` 这个包来实现，首先安装：

```sh
$ yarn add @capacitor/app
```

然后在 src/main.js 主入口文件中初始化热更新包，并添加 App 的状态监听：

```js
import { App } from '@capacitor/app';
import { CapacitorUpdater } from '@capgo/capacitor-updater';

CapacitorUpdater.notifyAppReady();
liveUpdate(); // APP 第一次打开
App.addListener('appStateChange', async (state) => {
  if (state.isActive) {
    // APP 进入前台
    liveUpdate();
  }
});
```

在 liveUpdate() 这个方法中，我们写具体的检测更新逻辑。

### 2. 如何检测到有新的版本发布？

如果线上发布了新版本，我们下载并更新即可。可是如何知道线上有新版本呢？

这就需要有一个接口，查询线上的版本号，并和本地的版本号做对比；如果有差异，则下载线上包，并在本地更新版本号，每次打开 App 都检查一次版本号。

我们直接在项目根目录下创建 version.json 文件并写入版本号，每次发布新代码后修改版本号，将其上传到服务器并通过 API 返回该文件。

```json
{
  "version": "0.1.0"
}
```

假设获取该文件的地址是 /example.com/version.json，那么首先通过该 URL 获取线上版本号：

```js
let res = await fetch('http://example.com/version.json', {
  cache: 'no-cache',
}).then((res) => res.json());

console.log('线上版本：', res.version);
```

接下来要将线上版本与本地版本对比，这就要在本地存储版本号。前端本地存储你可能会想到 localStorage，但是在 APP 中不行，因为应用被杀死后再启动，localStorage 就会清空，因此要使用 App 级别的本地存储。

App 的本地存储使用 `@capacitor/preferences` 这个库来实现，首先安装：

```sh
$ yarn add @capacitor/preferences
```

添加和获取存储的方法如下：

```js
import { Preferences } from '@capacitor/preferences';

// 添加本地存储
await Preferences.set({
  key: 'version',
  value: 'v1.0.0',
});

// 获取本地存储
await Preferences.get({ key: 'version' });
```

## 3. 编写版本对比和执行热更新的方法：

热更新方法 checkVersion() 的完整代码如下：

```js
const checkVersion = async () => {
  console.log('开始检测更新');
  let { value: version } = await Preferences.get({ key: 'version' });

  let res = await fetch('http://example.com/version.json', {
    cache: 'no-cache',
  }).then((res) => res.json());
  console.log('版本对比：', res.version, version);

  if (res.version !== version) {
    let data = await CapacitorUpdater.download({
      url: 'http://example.com/dist.zip',
      version: res.version,
    });
    CapacitorUpdater.set(data);
    await Preferences.set({
      key: 'version',
      value: res.version,
    });
    console.log('更新成功');
  }
};
```
