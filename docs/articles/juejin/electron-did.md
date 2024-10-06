# Electron 不能获取设备 ID 了！

在桌面应用开发中，常常需要获取设备唯一 ID 来表示当前客户端的唯一性。一般的设备 ID 需要满足两个条件：

1. 基于硬件和系统配置生成，确保设备的唯一性。
2. 只要不重装系统，设备 ID 多次获取都是唯一的。

`node-machine-id` 是一个常用的 Node.js 模块，它能够在 Electron 中获取机器的唯一标识。

我们的产品就是使用该模块，用法也很简单：

```js
import { machineIdSync } from 'node-machine-id';
let id = machineIdSync();
```

但是昨天出现了问题，排查结果是多台设备获取的 ID 竟然是一样的，造成了一些设备的数据被篡改，我从 issues 中找到了一些端倪。

![](./images/2024-03-13-10-14-04.png)

也就是在 `Window Ghost` 系统中会出现问题（啥是 Window Ghost ？）。

Window 中还经常遇到权限问题，而且这个 ID 总归不可控，所以还是用自定义的方式实现吧。

## 自定义设置设备 ID

自定义的设备 ID 首先需要唯一，其次在安装和卸载应用时设备 ID 不变。

满足这两个要求，最佳的方案就是将自己生成的设备 ID 存储在用户目录下。

假设当前用户叫张三，他的用户目录：

- Window：`C:\Users\张三\`
- MacOS：`/Users/张三/`

很多应用程序都把配置写到用户目录下，且该目录一般不会遇到权限问题。

（1）使用 `uuid` 生成设备 ID：

```js
import { v4 as uuidv4 } from 'uuid';
const device_id = uuidv4();
```

（2）在主进程中获取到用户目录，非常简单：

```js
import { app } from 'electron';
const user_path = app.getPath('home'); // 自动获取 Win 或 Mac 的用户目录
```

（3）在用户目录下创建 `.elappid` 文件，存放生成的设备 ID：

```js
import { join } from 'node:path';
import fs from 'node:fs';
// 获取配置文件地址
let appid_path = join(user_path, '.elappid');
// 判断文件是否存在，不存在就先创建，并写入设备ID
if (!fs.existsSync(appid_path)) {
  fs.writeFileSync(appid_path, device_id, 'utf8');
}
```

（4）读取设备 ID，并发送给渲染进程：

```js
let appid = fs.readFileSync(appid_path, 'utf8');
win.webContents.send('susr-config', { appid });
```

写一个进程间交互的方法，就能拿到设备 ID 了。

## 什么时候获取设备 ID

正常情况下，我们希望用户打开应用的时候，主动获取设备 ID 并发给渲染进程。

然而经过测试，在创建浏览器窗口的同时立即获取设备 ID 并通知渲染进程，在正式环境中，渲染进程往往接受不到消息。

这是因为创建窗口时，页面还没有初始化完成，自然接收不到消息。

保险的方法就是在页面加载完成后再获取设备 ID，方法如下：

```js
win = new BrowserWindow({...})

// 页面加载完成后触发：
win.webContents.on("did-finish-load", () => {
  console.log('在这里获取设备ID吧')
})
```
