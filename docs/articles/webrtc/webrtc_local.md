# 音视频通信加餐 —— WebRTC 一探到底

最近需要搭建一个在线课堂的直播平台，考虑到清晰度和延迟性，我们一致认为使用 WebRTC 最合适。

原因有两点：首先是“点对点通信”非常吸引我们，不需要中间服务器，客户端直连，通信非常方便；再者是 WebRTC 浏览器原生支持，其他客户端支持也很好，不像传统直播用 flv.js 做兼容，可以实现标准统一。

然而令我非常尴尬的是，社区看了好几篇文章，理论架构写了一堆，但没一个能跑起来。WebRTC 里面概念很新也很多，理解它的`通信流程`才是最关键，这点恰恰很少有描述。

于是我就自己捣鼓吧。捣鼓了几天，可算是整明白了。下面我结合自己的实践经验，按照我理解的关键步骤，带大家从应用场景的角度认识这个厉害的朋友 —— `WebRTC`。

> 线上预览：[本地通信 Demo](https://example.ruims.top/local/)

## 大纲预览

本文介绍的内容包括以下方面：

- 什么是 WebRTC？
- 获取媒体流
- 对等连接流程
- 本地模拟通信源码
- 局域网两端通信
- 一对多通信
- 我想学更多

## 什么是 WebRTC？

WebRTC (Web Real-Time Communications) 是一项实时通讯技术，它允许网络应用或者站点，在**不借助中间媒介**的情况下，建立浏览器之间点对点（Peer-to-Peer）的连接，实现视频流和音频流或者其他任意数据的传输。

简单的说，就是 WebRTC 可以不借助媒体服务器，通过浏览器与浏览器直接连接（点对点），即可实现音视频传输。

如果你接触过直播技术，你就会知道“没有媒体服务器”多么令人惊讶。以往的直播技术大多是基于推流/拉流的逻辑实现的。要想做音视频直播，则必须有一台**流媒体服务器**做为中间站做数据转发。但是这种推拉流的方案有两个问题：

1. 较高的延迟
2. 清晰度难以保证

因为两端通信都要先过服务器，就好比本来是一条直路，你偏偏“绕了半个圈”，这样肯定会花更多的时间，因此直播必然会有延迟，即使延迟再低也要 1s 以上。

清晰度高低的本质是数据量的大小。你想象一下，每天乘地铁上班，早高峰人越多，进站的那条道就越容易堵，堵你就会走走停停，再加上还绕了路，是不是到公司就更晚了。

把这个例子联系到高清晰度的直播：因为数据量大就容易发生网络拥堵，拥堵就会导致播放卡顿，同时延迟性也会更高。

但是 WebRTC 就不一样了，它不需要媒体服务器，两点一线直连，首先延迟性一定大大缩短。再者因为传输路线更短，所以清晰度高的数据流也更容易到达，相对来说不易拥堵，因此播放端不容易卡顿，这样就兼顾了清晰度与延迟性。

当然 WebRTC 也是支持中间媒体服务器的，有些场景下确实少不了服务器转发。我们这篇只探讨点对点的模式，旨在帮助大家更容易的了解并上手 WebRTC。

## 获取媒体流

点对点通信的第一步，一定是发起端获取媒体流。

常见的媒体设备有三种：**摄像机**，**麦克风** 和 **屏幕**。其中摄像机和屏幕可以转化为视频流，而麦克风可转化为音频流。音视频流结合起来就组成了常见的媒体流。

以 Chrome 浏览器为例，摄像头和屏幕的视频流获取方式不一样。对于摄像头和麦克风，使用如下 API 获取：

```js
var stream = await navigator.mediaDevices.getUserMedia();
```

对于屏幕录制，则会用另外一个 API。限制是这个 API 只能获取视频，不能获取音频：

```js
var stream = await navigator.mediaDevices.getDisplayMedia();
```

> 注意：这里我遇到过一个问题，编辑器里提示 navigator.mediaDevices == undefined，原因是我的 typescript 版本小于 4.4，升级版本即可。

这两个获取媒体流的 API 有使用条件，必须满足以下两种情况之一：

- 域名是 localhost
- 协议是 https

如果不满足，则 `navigator.mediaDevices` 的值就是 **undefined**。

以上方法都有一个参数 `constraints`，这个参数是一个配置对象，称为 **媒体约束**。这里面最有用的是可以配置只获取音频或视频，或者音视频同时获取。

比如我只要视频，不要音频，就可以这样：

```js
let stream = await navigator.mediaDevices.getDisplayMedia({
  audio: false,
  video: true,
});
```

除了简单的配置获取视频之外，还可以对视频的清晰度，码率等涉及视频质量相关的参数做配置。比如我需要获取 1080p 的超清视频，我就可以这样配：

```js
var stream = await navigator.mediaDevices.getDisplayMedia({
  audio: false,
  video: {
    width: 1920,
    height: 1080,
  },
});
```

当然了，这里配置视频的分辨率 1080p，并不代表实际获取的视频一定是 1080p。比如我的摄像头是 720p 的，那即便我配置了 2k 的分辨率，实际获取的最多也是 720p，这个和硬件与网络有关系。

上面说了，媒体流是由音频流和视频流组成的。再说的严谨一点，一个媒体流（[MediaStream](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaStream)）会包含多条媒体轨道（[MediaStreamTrack](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaStreamTrack)），因此我们可以从媒体流中单独获取音频和视频轨道：

```js
// 视频轨道
let videoTracks = stream.getVideoTracks();
// 音频轨道
let audioTracks = stream.getAudioTracks();
// 全部轨道
stream.getTracks();
```

单独获取轨道有什么意义呢？比如上面的获取屏幕的 API `getDisplayMedia` 无法获取音频，但是我们直播的时候既需要屏幕也需要声音，此时就可以分别获取音频和视频，然后组成一个新的媒体流。实现如下：

```javascript
const getNewStream = async () => {
  var stream = new MediaStream();
  let audio_stm = await navigator.mediaDevices.getUserMedia({
    audio: true,
  });
  let video_stm = await navigator.mediaDevices.getDisplayMedia({
    video: true,
  });
  audio_stm.getAudioTracks().map((row) => stream.addTrack(row));
  video_stm.getVideoTracks().map((row) => stream.addTrack(row));
  return stream;
};
```

## 对等连接流程

要说 WebRTC 有什么不优雅的地方，首先要提的就是连接步骤复杂。很多同学就因为总是连接不成功，结果被成功劝退。

对等连接，也就是上面说的点对点连接，核心是由 `RTCPeerConnection` 函数实现。两个浏览器之间点对点的连接和通信，本质上是两个 RTCPeerConnection 实例的连接和通信。

用 `RTCPeerConnection` 构造函数创建的两个实例，成功建立连接之后，可以传输视频、音频或任意二进制数据（需要支持 _RTCDataChannel_ API ）。同时也提供了连接状态监控，关闭连接的方法。不过两点之间数据单向传输，只能由发起端向接收端传递。

我们现在根据核心 API，梳理一下具体连接步骤。

#### 第一步：创建连接实例

首先创建两个连接实例，这两个实例就是互相通信的双方。

```js
var peerA = new RTCPeerConnection();
var peerB = new RTCPeerConnection();
```

> 下文统一将发起直播的一端称为 `发起端`，接收观看直播的一端称为 `接收端`

现在的这两个连接实例都还没有数据。假设 peerA 是发起端，peerB 是接收端，那么 peerA 的那端就要像上一步一样获取到媒体流数据，然后添加到 peerA 实例，实现如下：

```javascript
var stream = await navigator.mediaDevices.getUserMedia();
stream.getTracks().forEach((track) => {
  peerA.addTrack(track, stream);
});
```

当 peerA 添加了媒体数据，那么 peerB 必然会在后续连接的某个环节接收到媒体数据。因此还要为 peerB 设置监听函数，获取媒体数据：

```javascript
peerB.ontrack = async event => {
  let [ remoteStream ] = event.streams
  console.log(remoteStream)
})
```

这里要注意：**必须 peerA 添加媒体数据之后，才能进行下一步!** 否则后续环节中 peerB 的 `ontrack` 事件就不会触发，也就不会拿到媒体流数据。

#### 第二步：建立对等连接

添加数据之后，两端就可以开始建立对等连接。

建立连接最重要的角色是 `SDP`（RTCSessionDescription），翻译过来就是 `会话描述`。连接双方需要各自建立一个 SDP，但是他们的 SDP 是不同的。发起端的 SDP 被称为 `offer`，接收端的 SDP 被称为 `answer`。

其实两端建立对等连接的本质就是互换 SDP，在互换的过程中相互验证，验证成功后两端的连接才能成功。

现在我们为两端创建 SDP。peerA 创建 offer，peerB 创建 answer：

```js
var offer = await peerA.createOffer();
var answer = await peerB.createAnswer();
```

创建之后，首先接收端 peerB 要将 offset 设置为远程描述，然后将 answer 设置为本地描述：

```javascript
await peerB.setRemoteDescription(offer);
await peerB.setLocalDescription(answer);
```

> 注意：当 peerB.setRemoteDescription 执行之后，peerB.ontrack 事件就会触发。当然前提是第一步为 peerA 添加了媒体数据。

这个很好理解。offer 是 peerA 创建的，相当于是连接的另一端，因此要设为“远程描述”。answer 是自己创建的，自然要设置为“本地描述”。

同样的逻辑，peerB 设置完成后，peerA 也要将 answer 设为远程描述，offer 设置为本地描述。

```javascript
await peerA.setRemoteDescription(answer);
await peerA.setLocalDescription(offer);
```

到这里，互相交换 SDP 已完成。但是通信还未结束，还差最后一步。

当 peerA 执行 **setLocalDescription** 函数时会触发 `onicecandidate` 事件，我们需要定义这个事件，然后在里面为 peerB 添加 **candidate**：

```javascript
peerA.onicecandidate = (event) => {
  if (event.candidate) {
    peerB.addIceCandidate(event.candidate);
  }
};
```

至此，端对端通信才算是真正建立了！如果过程顺利的话，此时 peerB 的 ontrack 事件内应该已经接收到媒体流数据了，你只需要将媒体数据渲染到一个 video 标签上即可实现播放。

还要再提一次：这几步看似简单，实际顺序非常重要，一步都不能出错，否则就会连接失败！如果你在实践中遇到问题，一定再回头检查一下步骤有没有出错。

最后我们再为 peerA 添加状态监听事件，检测连接是否成功：

```javascript
peerA.onconnectionstatechange = (event) => {
  if (peerA.connectionState === 'connected') {
    console.log('对等连接成功！');
  }
  if (peerA.connectionState === 'disconnected') {
    console.log('连接已断开！');
  }
};
```

## 本地模拟通信源码

上一步我们梳理了点对点通信的流程，其实主要代码也就这么多。这一步我们再把这些知识点串起来，简单实现一个本地模拟通信的 Demo，运行起来让大家看效果。

首先是页面布局，非常简单。两个 video 标签，一个播放按钮：

```html
<div class="local-stream-page">
  <video autoplay controls muted id="elA"></video>
  <video autoplay controls muted id="elB"></video>
  <button onclick="onStart()">播放</button>
</div>
```

然后设置全局变量：

```javascript
var peerA = null;
var peerB = null;
var videoElA = document.getElementById('elA');
var videoElB = document.getElementById('elB');
```

按钮绑定了一个 `onStart` 方法，在这个方法内获取媒体数据：

```javascript
const onStart = async () => {
  try {
    var stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    if (videoElA.current) {
      videoElA.current.srcObject = stream; // 在 video 标签上播放媒体流
    }
    peerInit(stream); // 初始化连接
  } catch (error) {
    console.log('error：', error);
  }
};
```

onStart 函数里调用了 `peerInit` 方法，在这个方法内初始化连接：

```javascript
const peerInit = (stream) => {
  // 1. 创建连接实例
  var peerA = new RTCPeerConnection();
  var peerB = new RTCPeerConnection();
  // 2. 添加视频流轨道
  stream.getTracks().forEach((track) => {
    peerA.addTrack(track, stream);
  });
  // 添加 candidate
  peerA.onicecandidate = (event) => {
    if (event.candidate) {
      peerB.addIceCandidate(event.candidate);
    }
  };
  // 检测连接状态
  peerA.onconnectionstatechange = (event) => {
    if (peerA.connectionState === 'connected') {
      console.log('对等连接成功！');
    }
  };
  // 监听数据传来
  peerB.ontrack = async (event) => {
    const [remoteStream] = event.streams;
    videoElB.current.srcObject = remoteStream;
  };
  // 互换sdp认证
  transSDP();
};
```

初始化连接之后，在 `transSDP` 方法中互换 SDP 建立连接：

```javascript
const transSDP = async () => {
  // 1. 创建 offer
  let offer = await peerA.createOffer();
  await peerB.setRemoteDescription(offer);
  // 2. 创建 answer
  let answer = await peerB.createAnswer();
  await peerB.setLocalDescription(answer);
  // 3. 发送端设置 SDP
  await peerA.setLocalDescription(offer);
  await peerA.setRemoteDescription(answer);
};
```

> 注意：这个方法里的代码顺序非常重要，如果改了顺序多半会连接失败！

如果顺利的话，此时已经连接成功。截图如下：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ce144d8eb7a648debbcc1f43a12c1631~tplv-k3u1fbpfcp-watermark.image?)

我们用两个 video 标签和三个方法，实现了本地模拟通信的 demo。其实 “本地模拟通信” 就是模拟 peerA 和 peerB 通信，把两个客户端放在了一个页面上，当然实际情况不可能如此，这个 demo 只是帮助我们理清通信流程。

Demo 完整代码我已经上传 GitHub，需要查阅请看 [这里](https://github.com/ruidoc/blog-codes/tree/master/src/webrtc-web)，拉代码直接打开 `index.html` 即可看到效果。

接下来我们探索真实场景 —— 局域网如何通信。

## 局域网两端通信

上一节实现了本地模拟通信，在一个页面模拟了两个端连接。现在思考一下：**如果 peerA 和 peerB 是一个局域网下的两个客户端，那么本地模拟通信的代码需要怎么改呢？**

本地模拟通信我们用了 **两个标签** 和 **三个方法** 来实现。如果分开的话，首先 peerA 和 peerB 两个实例，以及各自绑定的事件，肯定是分开定义的，两个 video 标签也同理。然后获取媒体流的 onStart 方法一定在发起端 peerA，也没问题，但是互换 SDP 的 `transSDP` 方法此时就失效了。

为啥呢？比如在 peerA 端：

```javascript
// peerA 端
let offer = await peerA.createOffer();
await peerA.setLocalDescription(offer);
await peerA.setRemoteDescription(answer);
```

这里设置远程描述用到了 answer，那么 `answer` 从何而来？

本地模拟通信我们是在同一个文件里定义变量，可以互相访问。但是现在 peerB 在另一个客户端，answer 也在 peerB 端，这样的话就需要在 peerB 端创好 answer 之后，传到 peerA 端。

相同的道理，peerA 端创建好 offer 之后，也要传到 peerB 端。这样就需要两个客户端远程交换 SDP，这个过程被称作 `信令`。

没错，信令是远程交换 SDP 的**过程**，并不是某种凭证。

两个客户端需要互相主动交换数据，那么就需要一个服务器提供连接与传输。而“主动交换”最适合的实现方案就是 `WebSocket`，因此我们需要基于 WebSocket 搭建一个 `信令服务器` 来实现 SDP 互换。

不过本篇不会详解信令服务器，我会单独出一篇搭建信令服务器的文章。现在我们用两个变量 `socketA` 和 `socketB` 来表示 peerA 和 peerB 两端的 WebSocket 连接，然后改造对等连接的逻辑。

首先修改 peerA 端 SDP 的传递与接收代码：

```javascript
// peerA 端
const transSDP = async () => {
  let offer = await peerA.createOffer();
  // 向 peerB 传输 offer
  socketA.send({ type: 'offer', data: offer });
  // 接收 peerB 传来的 answer
  socketA.onmessage = async (evt) => {
    let { type, data } = evt.data;
    if (type == 'answer') {
      await peerA.setLocalDescription(offer);
      await peerA.setRemoteDescription(data);
    }
  };
};
```

这个逻辑是发起端 peerA 创建 offer 之后，立即传给 peerB 端。当 peerB 端执行完自己的代码并创建 answer 之后，再回传给 peerA 端，此时 peerA 再设置自己的描述。

此外，还有 candidate 的部分也需要远程传递：

```javascript
// peerA 端
peerA.onicecandidate = (event) => {
  if (event.candidate) {
    socketA.send({ type: 'candid', data: event.candidate });
  }
};
```

peerB 端稍有不同，必须是接收到 offer 并设置为远程描述之后，才可以创建 answer，创建之后再发给 peerA 端，同时也要接收 candidate 数据：

```javascript
// peerB 端，接收 peerA 传来的 offer
socketB.onmessage = async (evt) => {
  let { type, data } = evt.data;
  if (type == 'offer') {
    await peerB.setRemoteDescription(data);
    let answer = await peerB.createAnswer();
    await peerB.setLocalDescription(answer);
    // 向 peerA 传输 answer
    socketB.send({ type: 'answer', data: answer });
  }
  if (type == 'candid') {
    peerB.addIceCandidate(data);
  }
};
```

这样两端通过远程互传数据的方式，就实现了局域网内两个客户端的连接通信。

总结一下，两个客户端监听对方的 WebSocket 发送消息，然后接收对方的 SDP，互相设置为远程描述。接收端还要获取 candidate 数据，这样“信令”这个过程就跑通了。

## 一对多通信

前面我们讲的，不管是本地模拟通信，还是局域网两端通信，都属于“**一对一**”通信。

然而在很多场景下，比如在线教育班级直播课，一个老师可能要面对 20 个学生，这是典型的一对多场景。但是 WebRTC 只支持点对点通信，也就是一个客户端只能与一个客户端建立连接，那这种情况该怎么办呢？

记不记得前面说过：两个客户端之间点对点的连接和通信，本质上是两个 RTCPeerConnection 实例的连接和通信。

那我们变通一下，比如现在接收端可能是 peerB，peerC，peerD 等等好几个客户端，建立连接的逻辑与之前的一样不用变。那么发起端能否从“**一个连接实例**”扩展到“**多个连接实例**”呢？

也就是说，发起端虽然是一个客户端，但是不是可以同时创建多个 RTCPeerConnection 实例。这样的话，一对一连接的本质没有变，只不过把多个连接实例放到了一个客户端，每个实例再与其他接收端连接，变相的实现了一对多通信。

具体思路是：发起端维护一个连接实例的数组，当一个接收端请求建立连接时，发起端新建一个连接实例与这个接收端通信，连接成功后，再将这个实例 push 到数组里面。当连接断开时，则会从数组里删掉这个实例。

这种方式我亲测有效，下面我们对发起端的代码改造。其中类型为 `join` 的消息，表示连接端请求连接。

```javascript
// 发起端
var offer = null;
var Peers = []; // 连接实例数组

// 接收端请求连接，传来标识id
const newPeer = async (id) => {
  // 1. 创建连接
  let peer = new RTCPeerConnection();
  // 2. 添加视频流轨道
  stream.getTracks().forEach((track) => {
    peer.addTrack(track, stream);
  });
  // 3. 创建并传递 SDP
  offer = await peerA.createOffer();
  socketA.send({ type: 'offer', data: { id, offer } });
  // 5. 保存连接
  Peers.push({ id, peer });
};

// 监听接收端的信息
socketA.onmessage = async (evt) => {
  let { type, data } = evt.data;
  // 接收端请求连接
  if (type == 'join') {
    newPeer(data);
  }
  if (type == 'answer') {
    let index = Peers.findIndex((row) => row.id == data.id);
    if (index >= 0) {
      await Peers[index].peer.setLocalDescription(offer);
      await Peers[index].peer.setRemoteDescription(data.answer);
    }
  }
};
```

这个就是核心逻辑了，其实不难，思路理顺了就很简单。

因为信令服务器我们还没有详细介绍，实际的一对多通信需要信令服务器参与，所以这里我只介绍下实现思路和核心代码。更详细的实现，我会在下一篇介绍信令服务器的文章再次实战一对多通信，到时候完整源码一并奉上。

## 我想学更多

为了更好的保护原创，之后的文章我会首发微信公众号 **前端砍柴人**。这个公众号只做原创，每周至少一篇高质量文章，方向是前端工程与架构，Node.js 边界探索，一体化开发与应用交付等实践与思考。

除此之外，我还建了一个微信群，专门提供对这个方向感兴趣的同学交流与学习。如果你也感兴趣，欢迎加我微信  `ruidoc`  拉你入群，我们一同进步～
