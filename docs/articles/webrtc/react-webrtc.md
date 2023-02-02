# 【WebRTC 跨端通信】React + React Native 双端视频聊天、屏幕共享

之前介绍过 WebRTC，简单来说它是一个点对点的实时通讯技术，主要基于浏览器来实现音视频通信。这项技术目前已经被广泛应用于实时视频通话，多人会议等场景。

不过 WebRTC 因为其过于优秀的表现，其应用范围已经不限于 Web 端，移动 App 也基本实现了 WebRTC 的 API。在跨平台框架中，Flutter 和 React Native 都实现了对 WebRTC 的支持。

我们以 App（React Native）为呼叫端，Web（React）为接收端，分别介绍两端如何进行视频通话。

## 接收端 React 实现

React 运行在浏览器中，无需引用任何模块，可以直接使用 WebRTC API。下面分几个步骤，逐步介绍在 Web 端如何获取、发送、接受远程视频流。

1. 获取本地摄像头流，并保存。

```js
const stream = null;
const getMedia = async () => {
  let ori_stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  stream = ori_stream;
};
```

2. 创建 video 标签用于播放视频。

创建两个 video 标签，分别用于播放本地视频和远程视频。

```js
const local_video = useRef();
const remote_video = useRef();
const Player = () => {
  return (
    <div>
      <video ref={local_video} autoPlay muted />;
      <video ref={remote_video} autoPlay muted />;
    </div>
  );
};
// stream 是上一步获取的本地视频流
if (local_video.current) {
  local_video.current.srcObject = stream;
}
```

3. 创建 RTC 连接实例。

每一个使用 WebRTC 通信的客户端，都要创建一个 RTCPeerConnection 连接实例，该实例是真正负责通信的角色。WebRTC 通信的实质就是 RTCPeerConnection 实例之间的通信。

```js
// 1. 创建实例
let peer = new RTCPeerConnection();
// 2. 将本地视频流添加到实例中
stream.getTracks().forEach((track) => {
  peer.addTrack(track, stream);
});
// 3. 接收远程视频流并播放
peer.ontrack = async (event) => {
  let [remoteStream] = event.streams;
  remote_video.current.srcObject = remoteStream;
};
```

实例创建之后，别忘记将上一步获取的摄像头流添加到实例中。

当两端连接完全建立之后，在 peer.ontrack 之内就能接收到对方的视频流了。

4. 连接信令服务器，准备与 App 端通信。

WebRTC 的通信过程需要两个客户端实时进行数据交换。交换内容分为两大部分：

- 交换 SDP（媒体信息）。
- 交换 ICE（网络信息）。

因此我们需要一个 WebSocket 服务器来连接两个客户端进行传输数据，该服务器在 WebRTC 中被称为`信令服务器`。

我们已经基于 socket.io 搭建了信令服务器，现在需要客户端连接，方式如下。

（1）安装 socket.io-client：

```sh
$ yarn add socket.io-client
```

（2）连接服务器，并监听消息。

连接服务器时带上验证信息（下面的用户 ID、用户名），方便在通信时可以找到对方。

```js
import { io } from 'socket.io-client';
const socket = null;
const socketInit = () => {
  let sock = io(`https://xxxx/webrtc`, {
    auth: {
      userid: '111',
      username: '我是接收端',
      role: 'reader',
    },
  });
  sock.on('connect', () => {
    console.log('连接成功');
  });
  socket = sock;
};
useEffect(() => {
  socketInit();
}, []);
```

经过上面 4 个步骤，我们的准备工作已经做好了。结下来可以进行正式的通信步骤了。

5. 接收 offer，交换 SDP。

监听 offer 事件（呼叫端发来的 offer 数据），然后创建 answer 并发回呼叫端。

```js
// 接收 offer
socket.on('offer', (data) => {
  transMedia(data);
});
// 发送 answer
const transMedia = async (data: any) => {
  let offer = new RTCSessionDescription(data.offer);
  await peer.setRemoteDescription(offer);
  let answer = await peer.createAnswer();

  socket.emit('answer', {
    to: data.from, // 呼叫端 Socket ID
    answer,
  });
  await peer.setLocalDescription(answer);
};
```

6. 接收 candidate，交换 ICE。

监听 candid 事件（呼叫端发来的 candidate 数据）并添加到本地 peer 实例，然后监听本地的 candidate 数据并发回给呼叫端。

上一步执行 peer.setLocalDescription() 之后，就会触发 `peer.onicecandidate` 事件。

```js
// 接收 candidate
socket.on('candid', (data) => {
  let candid = new RTCIceCandidate(data.candid);
  peer.addIceCandidate(candid);
});
// 发送 candidate
peer.onicecandidate = (event) => {
  if (event.candidate) {
    socket.emit('candid', {
      to: data.from, // 呼叫端 Socket ID
      candid: event.candidate,
    });
  }
};
```

至此，整个通信过程就完成了。如果没有意外，此时在第 3 步的 peer.ontrack 事件内拿到的对端视频流开始传输数据，我们可以看到对端的视频画面了。

## 呼叫端 React Native 实现

在 React Native 端并不能直接使用 WebRTC API，我们需要一个第三方模块 `react-native-webrtc` 来实现，它提供了和 Web 端几乎一致的 API。

幸运的是，React Native 可以复用 Web 端的大多数逻辑性资源，socket.io-client 可以直接安装使用，和 Web 端完全一致。

不幸的是，App 开发少不了原生的环境配置、权限配置，这些比较繁琐，接下来介绍如何实现吧。

1. 创建 React Native 项目。

创建项目之前需要配置开发环境，我们以 Android 为例，具体的配置可以看[这篇文章](https://blog.ruims.top/crosspt/react-native/env)。

配置完成之后，直接通过 npx 命令创建项目，命名为 `RnWebRTC`：

```sh
$ npx react-native init RnWebRTC --template react-native-template-typescript
```

> 提示：如果不想使用 TypeScript，将 --template 选项和后面的内容去掉即可。

我安装的最新版本如下：

- react: "18.1.0"
- react-native: "0.70.6"

创建之后，查看根目录的 `index.js` 和 `App.tsx` 两个文件，分别是入口文件和页面组件，我们就在 App.tsx 这个组件中编写代码。

我们以安卓为例，直接用手机数据线连接电脑，打开 USB 调试模式，然后运行以下命令：

```sh
$ yarn run android
```

执行该命令会安装 Gradle（安卓包管理）依赖，并编译打包 Android 应用。第一次运行耗时比较久，耐心等待打包完成后，手机上会提示安装该 App。

该命令在打包的同时，还会单独启动一个终端，运行 Metro 开发服务器。Metro 的作用是监 JS 代码修改，并打包成 js bundle 交给原生 App 去渲染。

单独启动 Metro 服务器，可运行 `yarn run start`。

2. 安装 react-native-webrtc。

直接运行安装命令：

```sh
$ yarn add react-native-webrtc
```

安装之后并不能直接使用，需要在 android 文件夹中修改两处代码。

第一处：因为 react-native-webrtc 需要最低的安卓 SDK 版本为 `24`，而默认生成的最低版本是 21，所以修改 `android/build.gradle` 中的配置：

```
buildscript {
  ext {
      minSdkVersion = 24
  }
}
```

第二处：webrtc 需要摄像头、麦克风等权限，所以我们把权限先配齐喽。在 `android/app/src/main/AndroidManifest.xml` 中的 `<application>` 标签前添加如下配置：

```xml
<uses-feature android:name="android.hardware.camera" />
<uses-feature android:name="android.hardware.camera.autofocus" />
<uses-feature android:name="android.hardware.audio.output" />
<uses-feature android:name="android.hardware.microphone" />

<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.CHANGE_NETWORK_STATE" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
<uses-permission android:name="android.permission.INTERNET" />
```

接着执行命令重新打包安卓：

```sh
$ yarn run android
```

现在就可以在 App.tsx 中导入和使用 WebRTC 的相关 API 了：

```js
import {
  ScreenCapturePickerView,
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
} from 'react-native-webrtc';
```

3. 连接信令服务器，准备与 Web 端通信。

因为 React Native 可以直接使用 `socket.io-client` 模块，所以这一步和 Web 端的代码一致。

```sh
$ yarn add socket.io-client
```

连接信令服务器时，只是传递的验证信息不同：

```js
import { io } from 'socket.io-client';
const socket = null;
const socketInit = () => {
  let sock = io(`https://xxxx/webrtc`, {
    auth: {
      userid: '222',
      username: '我是呼叫端',
      role: 'sender',
    },
  });
  sock.on('connect', () => {
    console.log('连接成功');
  });
  socket = sock;
};
useEffect(() => {
  socketInit();
}, []);
```

4. 使用 RTCView 组件播放视频。

创建两个 RTCView 组件，分别用于播放本地视频和远程视频。

```js
import { mediaDevices, RTCView } from 'react-native-webrtc';
var local_stream = null;
var remote_stream = null;
// 获取本地摄像头
const getMedia = async () => {
  local_stream = await mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
};
// 播放视频组件
const Player = () => {
  return (
    <View>
      <RTCView style={{ height: 500 }} streamURL={local_stream.toURL()} />
      <RTCView style={{ height: 500 }} streamURL={remote_stream.toURL()} />
    </View>
  );
};
```

5. 创建 RTC 连接实例。

这一步与 Web 端基本一致，接收到远端流直接赋值。

```js
// 1. 创建实例
let peer = new RTCPeerConnection();
// 2. 将本地视频流添加到实例中
local_stream.getTracks().forEach((track) => {
  peer.addTrack(track, local_stream);
});
// 3. 接收远程视频流
peer.ontrack = async (event) => {
  let [remoteStream] = event.streams;
  remote_stream = remoteStream;
};
```

6. 创建 offer，开始交换 SDP。

App 端作为呼叫端，需要主动创建 offer 并发给接收端，并监听接收端发回的 answer：

```js
// 发送 offer
const peerInit = async (socket_id) => {
  let offer = await peer.createOffer();
  peer.setLocalDescription(offer);
  socket.emit('offer', {
    to: socket_id, // 接收端 Socket ID
    offer: offer,
  });
};
// 接收 answer
socket.on('answer', (data) => {
  let answer = new RTCSessionDescription(data.answer);
  peer.setRemoteDescription(answer);
});
```

7. 监听 candidate，交换 ICE。

这一步依然与 Web 端一致，分别是发送本地的 candidate 和接收远程的 candidate：

```js
// 发送 candidate
peer.onicecandidate = (event) => {
  if (event.candidate) {
    socket.emit('candid', {
      to: socket_id, // 接收端 Socket ID
      candid: event.candidate,
    });
  }
};
// 接收 candidate
socket.on('candid', (data) => {
  let candid = new RTCIceCandidate(data.candid);
  peer.addIceCandidate(candid);
});
```

至此，App 端与 Web 端的视频通话流程已经完成，现在两端可以互相看到对方的视频画面了。

![](./images/2022-12-27-09-50-15.png)

## 搭建 socket.io 信令服务器

在 Web 和 App 两端视频通话时用到了信令服务器，该服务使用 socket.io 实现，代码并不复杂，下面介绍下信令服务器如何编写：

1. 创建项目，安装需要的依赖。

创建 `socket-server` 文件夹，并执行以下命令生成 package.json：

```
$ npm init
```

接着安装必要的模块：

```
$ npm install koa socket.io
```

2. 创建入口文件，启动 socket 服务。

创建 app.js 文件，写入以下代码：

```js
const Koa = require('koa');
const http = require('http');
const SocketIO = require('socket.io');
const SocketIoApi = require('./io.js');

const app = new Koa();

const server = http.createServer(app.callback());

const io = new SocketIO.Server(server, {
  cors: { origin: '*' },
  allowEIO3: true,
});
app.context.io = io; // 将socket实例存到全局

new SocketIoApi(io);

server.listen(9800, () => {
  console.log(`listen to http://localhost:9800`);
});
```

代码中使用 `Koa` 框架运行一个服务器，并且接入了 `socket.io`，一个基本的 WebSocket 服务器就写好了。接着将它运行起来：

```
$ node app.js
```

此时 Koa 运行的 HTTP 服务器和 socket.io 运行的 WebSocket 服务器共享 9800 端口。

3. 创建 io.js，编写信令服务器逻辑。

上一步在入口文件 app.js 中引用了 io.js，该文件导出一个类，我们来编写具体的逻辑：

```js
// io.js
class IoServer {
  constructor(io) {
    this.io = io;
    this.rtcio = io.of('/webrtc');
    this.rtcio.on('connection', (socket) => {
      this.rtcListen(socket);
    });
  }
  rtcListen(socket) {
    // 发送端｜发送 offer
    socket.on('offer', (json) => {
      let { to, offer } = json;
      let target = this.rtcio.sockets.get(to);
      if (target) {
        target.emit('offer', {
          from: socket.id,
          offer,
        });
      } else {
        console.error('offer 接收方未找到');
      }
    });
    // 接收端｜发送 answer
    socket.on('answer', (json) => {
      let { to, answer } = json;
      let target = this.rtcio.sockets.get(to);
      // console.log(to, socket)
      if (target) {
        target.emit('answer', {
          from: socket.id,
          answer,
        });
      } else {
        console.error('answer 接收方未找到');
      }
    });
    // 发送端｜发送 candidate
    socket.on('candid', (json) => {
      let { to, candid } = json;
      let target = this.rtcio.sockets.get(to);
      // console.log(to, socket)
      if (target) {
        target.emit('candid', {
          from: socket.id,
          candid,
        });
      } else {
        console.error('candid 接收方未找到');
      }
    });
  }
}

module.exports = IoServer;
```

上面代码的逻辑中，当客户端连接到服务器，就开始监听 `offer`，`answer`，`candid` 三个事件。当有客户端发送消息，这里负责将消息转发给另一个客户端。

两个客户端通过唯一的 Socket ID 找到对方。在 socket.io 中，每一次连接都会产生一个唯一的 Socket Id。

1. 获取已连接的接收端列表。

因为每次刷新浏览器 WebSocket 都要重新连接，因此每次的 Socket ID 都不相同。为了在呼叫端准确找到在线的接收端，我们写一个获取接收端列表的接口。

在入口文件中通过 `app.context.io = io` 将 SocketIO 实例全局存储到了 Koa 中，那么获取已连接的接收端方式如下：

```js
app.get('/io-clients', async (ctx, next) => {
  let { io } = ctx.app.context;
  try {
    let data = await io.of('/webrtc').fetchSockets();
    let resarr = data
      .map((row) => ({
        id: row.id,
        auth: row.handshake.auth,
        data: row.data,
      }))
      .filter((row) => row.auth.role == 'reader');
    ctx.body = { code: 200, data: resarr };
  } catch (error) {
    ctx.body = error.toString();
  }
});
```

然后在呼叫端使用 GET 请求 `https://xxxx/io-clients` 可拿到在线接收端的 Socket ID 和其他信息，然后选择一个接收端发起连接。

> 注意：在线上获取摄像头和屏幕时要求域名必须是 https，否则无法获取。因此切记给 Web 端和信令服务器都配置好 https 的域名，可以避免通信时发生异常。

## TURN 跨网络视频通信

前面我们实现了 App 端和 Web 端双端通信，但是通信成功有一个前提：`两端必须连接同一个 WIFI`。

这是因为 WebRTC 的通信是基于 IP 地址和端口来找到对方，如果两端连接不同的 WIFI（不在同一个网段），或是 App 用流量 Web 端用 WIFI，那么两端的 IP 地址谁都不认识谁，自然无法建立通信。

当两端不在一个局域网时，优先使用 STUN 服务器，将两端的本地 IP 转换为公网 IP 进行连接。STUN 服务器我们直接使用谷歌的就可以，但是因为防火墙等各种原因，实际测试 STUN 基本是连不通的。

当两端不能找到对方，无法直接建立连接时，那么我们就要使用兜底方案 ——— 用一个中继服务器转发数据，将媒体流数据转发给对方。该中继服务器被称为 TURN 服务器。

TURN 服务器因为要转发数据流，因此对带宽消耗比较大，需要我们自己搭建。目前有很多开源的 TURN 服务器方案，经过性能测试，我选择使用 Go 语言开发的 [pion/turn](https://github.com/pion/turn) 框架。

1. 安装 Golang：

使用 pion/turn 的第一步是在你的服务器上安装 Golang。我使用的是 Linux Centos7 系统，使用 `yum` 命令安装最方便。

```sh
$ yum install -y epel-release # 添加 epel 源
$ yum install -y golang # 直接安装
```

安装之后使用如下命令查看版本，测试是否安装成功：

```sh
$ go version
go version go1.17.7 linux/amd64
```

2. 运行 pion/turn：

直接将 pion/turn 的源码拉下来：

```sh
$ git clone https://github.com/pion/turn ./pion-turn
```

源码中提供了很多案例可以直接使用，我们使用 `examples/turn-server/simple` 这个目录下的代码：

```sh
$ cd ./pion-turn/examples/turn-server/simple
$ go build
```

使用 `go build` 编译后，当前目录下会生成一个 simple 文件，该文件是可执行文件，使用该文件启动 TURN 服务器：

```sh
$ ./simple -public-ip 123.45.67.89 -users ruidoc=123456
```

上面命令中的 `123.45.67.89` 是你服务器的公网 IP，并配置一个用户名和密码分别为 `ruidoc` 和 `123456`，这几项配置根据你的实际情况设置。

默认情况下该命令不会后台运行，我们用下面的方式让它后台运行：

```
$ nohup ./simple -public-ip 123.45.67.89 -users ruidoc=123456 &
```

此时，该 TURN 服务已经在后台运行，并占用一个 `3478` 的 UDP 端口。我们查看一下端口占用：

```sh
$ netstat -nplu
```

![](./images/2022-12-26-15-51-20.png)

从上图可以看出，该服务已经在运行中。

3. 配置安全组、检测 TURN 是否可用。

上一步已经启动了 TURN 服务器，但是默认情况下从外部连接不上（这里是个坑），因为阿里云需要在安全组的入方向添加一条 UPD 3478 端口（其他云服务商也差不多），表示该端口允许从外部访问。

![](./images/2022-12-26-16-01-13.png)

安全组添加后，我们就可以测试 TURN 服务器的连通性了。

打开 [Trickle ICE](https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/)，添加我们的 TURN 服务器，格式为 `turn:123.45.67.89:3478`，然后输入上一步配置的用户名和密码：

![](./images/2022-12-26-16-04-47.png)

点击 Gather candidates 按钮，会列出以下信息。如果包含 `relay` 这一条，说明我们的 TURN 服务器搭建成功，可以使用了。

![](./images/2022-12-26-16-06-09.png)

4. 客户端添加 ICE 配置。

在 App 端和 Web 端创建 RTC 实例时，加入以下配置：

```js
var turnConf = {
  iceServers: [
    {
      urls: 'stun:stun1.l.google.com:19302', // 免费的 STUN 服务器
    },
    {
      urls: 'turn:123.45.67.89:3478',
      username: 'ruidoc',
      credential: '123456',
    },
  ],
};
var peer = new RTCPeerConnection(turnConf);
```

现在关闭手机 WIFI，使用流量与 Web 端发起连接，不出意外可以正常通信，但是延迟好像高了一些（毕竟走中转肯定没有直连快）。此时再打开手机 WIFI 重新连接，发现延迟又变低了。

这就是 WebRTC 智能的地方。它会优先尝试直连，如果直连不成功，最后才会使用 TURN 转发。

## App 端屏幕共享

视频通话一般都是共享摄像头，然而有的时候会有共享屏幕的需求。

在 Web 端共享屏幕很简单，将 `getUserMedia` 改成 `getDisplayMedia` 即可。然而在 App 端，可能因为隐私和安全问题，实现屏幕共享比较费劲。

安卓原生端使用 mediaProjection 实现共享屏幕。在 Android 10+ 之后，如果想正确共享屏幕，必须要有一个持续存在的“前台进程”来保证屏幕共享的进程不被系统自动杀死。

如果没有配置前台进程，则屏幕流无法传输。下面我们来介绍下在如何 App 端共享屏幕。

1. 安装 Notifee。

[Notifee](https://notifee.app/react-native/docs/overview) 是 React Native 实现通知栏消息的第三方库。我们可以启动一个持续存在的消息通知作为前台进程，从而使屏幕流正常推送。

使用命令安装 Notifee：

```
$ yarn add @notifee/react-native@5
```

注意这里安装 Notifee `5.x` 的版本，因为最新版的 `7.x` 需要 Android SDK 的 `compileSdkVersion` 为 33，而我们创建的项目默认为 31，使用 5.x 不需要修改 SDK 的版本号。

2. 注册前台服务。

在入口文件 index.js 中，我们使用 Notifee 注册一个前台服务：

```js
import notifee from '@notifee/react-native';
notifee.registerForegroundService((notification) => {
  return new Promise(() => {});
});
```

这里只需要注册一下，不需要其他操作，因此比较简单。接着还需要在 Android 代码中注册一个 service，否则前台服务不生效。

打开 `android/app/src/main/AndroidManifest.xml` 文件，在 `<application>` 标签内添加如下代码：

```xml
<service
   android:name="app.notifee.core.ForegroundService"
   android:foregroundServiceType="mediaProjection|camera|microphone" />
```

3. 创建前台通知。

注册好前台服务之后，接着我们在获取屏幕前创建前台通知，代码如下：

```js
import notifee from '@notifee/react-native';
const startNoti = async () => {
  try {
    let channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });
    await notifee.displayNotification({
      title: '屏幕录制中...',
      body: '在应用中手动关闭该通知',
      android: {
        channelId,
        asForegroundService: true, // 通知作为前台服务，必填
      },
    });
  } catch (err) {
    console.error('前台服务启动异常：', err);
  }
};
```

该方法会创建一个通知消息，具体 API 可以参考 Notifee [文档](https://notifee.app/react-native/docs/displaying-a-notification)。接着在捕获屏幕之前调用该方法即可：

```js
const getMedia = async () => {
  await startNoti();
  let stream = await mediaDevices.getDisplayMedia();
};
```

最终经过测试，可以看到 App 端和 Web 端的屏幕都实现了共享。App 端效果如下：

![](./images/2022-12-27-01-15-47.png)

Web 端效果如下：

![](./images/2022-12-27-01-03-37.png)

## 摄像头与屏幕视频混流

在一些直播教学的场景中，呼叫端会同时共享两路视频 ——— 屏幕画面和摄像头画面。在我们的经验中，一个 RTC 连接实例中只能添加一条视频流。

如果要同时共享屏幕和摄像头，我们首先想到的方案可能是在一个客户端创建两个 peer 实例，每个实例中添加一路视频流，发起两次 RTC 连接。

事实上这种方案是低效的，增加复杂度的同时也增加了资源的损耗。那么能不能在一个 peer 实例中添加两路视频呢？其实是可以的。

总体思路：在呼叫端将两条流合并为一条，在接收端再将一条流拆分为两条。

1. 呼叫端组合流。

组合流其实很简单。因为流是由多个媒体轨道组成，我们只需要从屏幕和摄像头中拿到媒体轨道，再将它们塞到一个自定义的流中，一条包含两个视频轨道的流就组合好了。

```js
var stream = new MediaStream();
const getMedia = async () => {
  let camera_stream = await mediaDevices.getUserMedia();
  let screen_stream = await mediaDevices.getDisplayMedia();
  screen_stream.getVideoTracks().map((row) => stream.addTrack(row));
  camera_stream.getVideoTracks().map((row) => stream.addTrack(row));
  camera_stream.getAudioTracks().map((row) => stream.addTrack(row));
};
```

代码中为一个自定义媒体流添加了三条媒体轨道，分别是屏幕视频、摄像头视频和摄像头音频。记住这个顺序，在接收端按照该顺序拆流。

接着将这条媒体流添加到 peer 实例中，后面走正常的通信逻辑即可：

```js
stream.getTracks().forEach((track) => {
  peer.addTrack(track, stream);
});
```

2. 接收端拆解流。

接收端在 ontrack 事件中拿到组合流，进行拆解：

```js
peer.ontrack = async (event: any) => {
  const [remoteStream] = event.streams;
  let screen_stream = new MediaStream();
  let camera_stream = new MediaStream();
  remoteStream.getTracks().forEach((track, ind) => {
    if (ind == 0) {
      screen_stream.addTrack(track);
    } else {
      camera_stream.addTrack(track);
    }
  });
  video1.srcObject = camera_stream; // 播放摄像头音视频
  video2.srcObject = screen_stream; // 播放屏幕视频
};
```

这一步中，定义两条媒体流，然后将接收到的混合流中的媒体轨道拆分，分别添加到两条流中，这样屏幕流和摄像头流就拆开了，分别在两个 video 中播放即可。

## 总结

本篇比较系统的介绍了 App 端和 Web 端使用 WebRTC 通信的全流程，可以看到整个流程还是比较复杂的。尤其是我们前端不擅长的地方，比如 TURN 搭建和连通，App 端的各种版本权限问题，坑还是很多的。

如果有小伙伴在这个流程中遇到了问题，欢迎加我微信 `ruidoc` 拉你进入跨端与音视频讨论群提问，或者关注我的公众号 `程序员成功` 查看更多文章。

再次感谢您的阅读～
