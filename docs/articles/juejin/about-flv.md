---
sidemenu: false
---

# 用一个 flv.js 播放监控的例子，带你深撅直播流技术

大家好，我是杨成功。

本文记录一下在使用 flv.js 播放监控视频时踩过的各种各样的坑。虽然官网给的 **Getting Started** 只有短短几行代码，跑一个能播视频的 demo 很容易，但是播放时各种各样的异常会搞到你怀疑人生。

究其原因，一方面 GitHub 上文档比较晦涩，说明也比较简陋；另一方面是受“视频播放”思维的影响，没有对**流**的足够认识以及缺乏处理流的经验。

下面我将自己踩过的坑，以及踩坑过程中补充的相关知识，详细总结一下。

## 大纲预览

本文介绍的内容包括以下方面：

- 直播与点播
- 静态数据与流数据
- 为什么选 flv？
- 协议与基础实现
- 细节处理要点
- 样式定制

## 点播与直播

啥是直播？啥是点播？

直播就不用说了，抖音普及之下大家都知道直播是干嘛的。点播其实就是视频播放，和咱们哔哩哔哩看视频一摸一样没区别，就是把提前做好的视频放出来，就叫点播。

点播对于我们前端来说，就是拿一个 mp4 的链接地址，放到 `video` 标签里面，浏览器会帮我们处理好视频解析播放等一些列事情，我们可以拖动进度条选择想看的任意一个时间。

但是直播不一样，直播有两个特点：

1. 获取的是流数据
2. 要求实时性

先看一下什么叫流数据。大部分没有做过音视频的前端同学，我们常接触的数据就是 ajax 从接口获取的 json 数据，特别一点的可能是文件上传。这些数据的特点是，它们都属于一次性就能拿到的数据。我们一个请求，一个响应，完整的数据就拿回来了。

但是流不一样，流数据获取是一帧一帧的，你可以理解为是一小块一小块的。像直播流的数据，它并不是一个完整的视频片段，它就是很小的二进制数据，需要你一点一点的拼接起来，才有可能输出一段视频。

再看它的实时性。如果是点播的话，我们直接将完整的视频存储在服务器上，然后返回链接，前端用 video 或播放器播就行了。但是直播的实时性，就决定了数据源不可能在服务器上，而是在某一个客户端。

数据源在客户端，那么又是怎么到达其他客户端的呢？

这个问题，请看下面这张流程图：

[about-process](images/about-process.png)

如图所示，发起直播的客户端，向上连着流媒体服务器，直播产生的视频流会被实时推送到服务端，这个过程叫做`推流`。其他客户端同样也连接着这个流媒体服务器，不同的是它们是播放端，会实时拉取直播客户端的视频流，这个过程叫做`拉流`。

**推流—> 服务器-> 拉流**，这是目前流行的也是标准的直播解决方案。看到了吧，直播的整个流程全都是流数据传输，数据处理直面二进制，要比点播复杂了几个量级。

具体到我们业务当中的摄像头实时监控预览，其实和上面的完全一致，只不过发起直播的客户端是摄像头，观看直播的客户端是浏览器而已。

## 静态数据与流数据

我们常接触的文本，json，图片等等，都属于静态数据，前端用 ajax 向接口请求回来的数据就是静态数据。

像上面说到的，直播产生的视频和音频，都属于流数据。流数据是一帧一帧的，它的本质是二进制数据，因为很小，数据像水流一样连绵不断的流动，因此非常适合实时传输。

静态数据，在前端代码中有对应的数据类型，比如 `string，json，array` 等等。那么流数据（二进制数据）的数据类型是什么？在前端如何存储？又如何操作？

首先明确一点，前端是可以存储和操作二进制的。最基本的二进制对象是 `ArrayBuffer`，它表示一个固定长度，如：

```js
let buffer = new ArrayBuffer(16); // 创建一个 16 字节 的 buffer，用 0 填充
alert(buffer.byteLength); // 16
```

`ArrayBuffer` 只是用于存储二进制数据，如果要操作，则需要使用 **视图对象**。

视图对象，不存储任何数据，作用是将 ArrayBuffer 的数据做了结构化的处理，便于我们操作这些数据，说白了它们是操作二进制数据的接口。

视图对象包括：

- **Uint8Array**：每个 item 1 个字节
- **Uint16Array**：每个 item 2 个字节
- **Uint32Array**：每个 item 4 个字节
- **Float64Array**：每个 item 8 个字节

按照上面的标准，一个 16 字节 ArrayBuffer，可转化的视图对象和其长度为：

- Uint8Array：长度 16
- Uint16Array：长度 8
- Uint32Array：长度 4
- Float64Array：长度 2

这里只是简单介绍流数据在前端如何存储，为的是避免你在浏览器看到一个长长的 ArrayBuffer 不知道它是什么，记住它一定是二进制数据。

## 为什么选 flv？

前面说到，直播需要实时性，延迟当然越短越好。当然决定传输速度的因素有很多，其中一个就是视频数据本身的大小。

点播场景我们最常见的 mp4 格式，对前端是兼容性最好的。但是相对来说 mp4 的体积比较大，解析会复杂一些。在直播场景下这就是 mp4 的劣势。

flv 就不一样了，它的头部文件非常小，结构简单，解析起来又块，在直播的实时性要求下非常有优势，因此它成了最常用的直播方案之一。

当然除了 flv 之外还有其他格式，对应直播协议，我们一一对比一下：

- **RTMP**: 底层基于 TCP，在浏览器端依赖 Flash。
- **HTTP-FLV**: 基于 HTTP 流式 IO 传输 FLV，依赖浏览器支持播放 FLV。
- **WebSocket-FLV**: 基于 WebSocket 传输 FLV，依赖浏览器支持播放 FLV。
- **HLS**: Http Live Streaming，苹果提出基于 HTTP 的流媒体传输协议。HTML5 可以直接打开播放。
- **RTP**: 基于 UDP，延迟 1 秒，浏览器不支持。

其实早期常用的直播方案是 `RTMP`，兼容性也不错，但是它依赖 Flash，而目前浏览器下 Flash 默认是被禁用的状态，已经被时代淘汰的技术，因此不做考虑。

`HLS` 协议也很常见，对应视频格式就是 `m3u8`。它是由苹果推出，对手机支持非常好，但是致命缺点是延迟高（10~30 秒），因此也不做考虑。

RTP 不必说，浏览器不支持，剩下的就只有 flv 了。

但是 flv 又分为 `HTTP-FLV` 和 `WebSocket-FLV`，它两看着像兄弟，又有什么区别呢？

前面我们说过，直播流是实时传输，连接创建后不会断，需要持续的推拉流。这种需要长连接的场景我们首先想到的方案自然是 WebSocket，因为 WebSocket 本来就是长连接实时互传的技术。

不过呢随着 js 原生能力扩展，出现了像 `fetch` 这样比 ajax 更强的黑科技。它不光支持对我们更友好的 Promise，并且天生可以处理流数据，性能很好，而且使用起来也足够简单，对我们开发者来说更方便，因此就有了 http 版的 flv 方案。

综上所述，最适合浏览器直播的是 flv，但是 flv 也不是万金油，它的缺点是前端 video 标签不能直接播放，需要经过处理才行。

处理方案，就是我们今天的主角：`flv.js`

## 协议与基础实现

前面我们说到，flv 同时支持 WebSocket 和 HTTP 两种传输方式，幸运的是，flv.js 也同时支持这两种协议。

选择用 http 还是 ws，其实功能和性能上差别不大，关键看后端同学给我们什么协议吧。我这边的选择是 http，前后端处理起来都比较方便。

接下来我们介绍 flv.js 的具体接入流程，官网在[这里](https://github.com/Bilibili/flv.js/)

假设现在有一个直播流地址：`http://test.stream.com/fetch-media.flv`，第一步我们按照官网的快速开始建一个 demo：

```javascript
import flvjs from 'flv.js';
if (flvjs.isSupported()) {
  var videoEl = document.getElementById('videoEl');
  var flvPlayer = flvjs.createPlayer({
    type: 'flv',
    url: 'http://test.stream.com/fetch-media.flv',
  });
  flvPlayer.attachMediaElement(videoEl);
  flvPlayer.load();
  flvPlayer.play();
}
```

首先安装 `flv.js`，代码的第一行是检测浏览器是否支持 flv.js，其实大部分浏览器是支持的。接下来就是获取 `video` 标签的 DOM 元素。flv 会把处理后的 flv 流输出给 video 元素，然后在 video 上实现视频流播放。

接下来是关键之处，就是创建 `flvjs.Player` 对象，我们称之为播放器实例。播放器实例通过 `flvjs.createPlayer` 函数创建，参数是一个配置对象，常用如下：

- `type`：媒体类型，`flv` 或 `mp4`，默认 flv
- `isLive`：可选，是否是直播流，默认 true
- `hasAudio`：是否有音频
- `hasVideo`：是否有视频
- `url`：指定流地址，可以是 `https(s)` or `ws(s)`

上面的是否有音频，视频的配置，还是要看流地址是否有音视频。比如监控流只有视频流没有音频，那即便你配置 hasAudio: true 也是不可能有声音的。

播放器实例创建之后，接下来就是三步走：

- `挂载元素`：flvPlayer.attachMediaElement(videoEl)
- `加载流`：flvPlayer.load()
- `播放流`：flvPlayer.play()

基础实现流程就这么多，下面再说一下处理过程中的细节和要点。

## 细节处理要点

上面说了基本的用法，下面说一下实践中的关键问题。

### 暂停与播放

点播中的暂停与播放很容易，播放器下面会有一个播放/暂停按键，想什么时候暂停都可以，再点播放的时候会接着上次暂停的地方继续播放。但是直播中就不一样了。

正常情况下直播应该是没有播放/暂停按钮以及进度条的。因为我们看的是实时信息，你暂停了视频，再点播放的时候是不能从暂停的地方继续播放的。为啥？因为你是实时的嘛，再点播放的时候应该是获取最新的实时流，播放最新的视频。

具体到技术细节，前端的 video 标签默认是带有进度条和暂停按钮的，flv.js 将直播流输出到 video 标签，此时如果点击暂停按钮，视频也是会停住的，这与点播逻辑一致。但是如果你再点播放，视频还是会从暂停处继续播放，这就不对了。

那么我们换个角度，重新审视一下直播的播放/暂停逻辑。

直播为什么需要暂停？拿我们视频监控来说，一个页面会放好几个摄像头的监控视频，如果每个播放器一直与服务器保持连接，持续拉流，这会造成大量的连接和消耗，流失的都是白花花的银子。

那我们是不是可以这样：进去网页的时候，找到想看的摄像头，点击播放再拉流。当你不想看的时候，点击暂停，播放器断开连接，这样是不是就会节省无用的流量消耗。

因此，**直播中的播放/暂停，核心逻辑是拉流/断流**。

理解到这里，那我们的方案应该是隐藏 video 的暂停/播放按钮，然后自己实现播放和暂停的逻辑。

还是以上述代码为例，播放器实例（上面的 flvPlayer 变量）不用变，播放/暂停代码如下：

```javascript
const onClick = (isplay) => {
  // 参数 isplay 表示当前是否正在播放
  if (isplay) {
    // 在播放，断流
    player.unload();
    player.detachMediaElement();
  } else {
    // 已断流，重新拉流播放
    player.attachMediaElement(videoEl.current);
    player.load();
    player.play();
  }
};
```

### 异常处理

用 flv.js 接入直播流的过程会遇到各种问题，有的是后端数据流的问题，有的是前端处理逻辑的问题。因为流是实时获取，flv 也是实时转化输出，因此一旦发生错误，浏览器控制台会循环连续的打印异常。

如果你用 react 和 ts，满屏异常，你都无法开发下去了。再有直播流本来就可能发生许多异常，因此错处理非常关键。

官方对异常处理的说明不太明显，我简单总结一下：

首先，flv.js 的异常分为两个级别，可以看作是 `一级异常` 和 `二级异常`。

再有，flv.js 有一个特殊之处，它的 `事件` 和 `错误` 都是用枚举来表示，如下：

- `flvjs.Events`：表示事件
- `flvjs.ErrorTypes`：表示一级异常
- `flvjs.ErrorDetails`：表示二级异常

下面介绍的异常和事件，都是基于上述枚举，你可以理解为是枚举下的一个 `key` 值。

一级异常有三类：

- `NETWORK_ERROR`：网络错误，表示连接问题
- `MEDIA_ERROR`：媒体错误，格式或解码问题
- `OTHER_ERROR`：其他错误

二级级异常常用的有三类：

- `NETWORK_STATUS_CODE_INVALID`：HTTP 状态码错误，说明 url 地址有误
- `NETWORK_TIMEOUT`：连接超时，网络或后台问题
- `MEDIA_FORMAT_UNSUPPORTED`：媒体格式不支持，一般是流数据不是 flv 的格式

了解这些之后，我们在播放器实例上监听异常：

```javascript
// 监听错误事件
flvPlayer.on(flvjs.Events.ERROR, (err, errdet) => {
  // 参数 err 是一级异常，errdet 是二级异常
  if (err == flvjs.ErrorTypes.MEDIA_ERROR) {
    console.log('媒体错误')
    if(errdet == flvjs.ErrorDetails.MEDIA_FORMAT_UNSUPPORTED) {
      console.log('媒体格式不支持')
    }
  }
  if (err == flvjs.ErrorTypes.NETWORK_ERROR) {
    console.log('网络错误')
    if(errdet == flvjs.ErrorDetails.NETWORK_STATUS_CODE_INVALID) {
      console.log('http状态码异常')
    }
  }
  if(err == flvjs.ErrorTypes.OTHER_ERROR) {
    console.log('其他异常：', errdet)
  }
}
```

除此之外，自定义播放/暂停逻辑，还需要知道加载状态。可以通过以下方法监听视频流加载完成：

```javascript
player.on(flvjs.Events.METADATA_ARRIVED, () => {
  console.log('视频加载完成');
});
```

### 样式定制

为什么会有样式定制？前面我们说了，直播流的播放/暂停逻辑与点播不同，因此我们要隐藏 `video` 的操作栏元素，通过自定义元素来实现相关功能。

首先要隐藏播放/暂停按钮，进度条，以及音量按钮，用 css 实现即可：

```css
/* 所有控件 */
video::-webkit-media-controls-enclosure {
  display: none;
}
/* 进度条 */
video::-webkit-media-controls-timeline {
  display: none;
}
video::-webkit-media-controls-current-time-display {
  display: none;
}
/* 音量按钮 */
video::-webkit-media-controls-mute-button {
  display: none;
}
video::-webkit-media-controls-toggle-closed-captions-button {
  display: none;
}
/* 音量的控制条 */
video::-webkit-media-controls-volume-slider {
  display: none;
}
/*  播放按钮 */
video::-webkit-media-controls-play-button {
  display: none;
}
```

播放和暂停的逻辑上面讲了，样式这边自定义一个按钮即可。除此之外我们还可能需要一个全屏按钮，看一下全屏的逻辑怎么写：

```javascript
const fullPage = () => {
  let dom = document.querySelector('.video');
  if (dom.requestFullscreen) {
    dom.requestFullscreen();
  } else if (dom.webkitRequestFullScreen) {
    dom.webkitRequestFullScreen();
  }
};
```

其他自定义样式，比如你要做弹幕，在 video 上面盖一层元素自行实现就可以了。

## 我的公众号

本文首发于微信公众号 [前端砍柴人]，这个公众号承诺不接广告，并会长期输出前端工程与架构方向的文章，篇篇经过实践与斟酌，一如既往的保证质量。

如果本文对你有启发，请左手一个**赞**，右手一个**在看**，祝你脱单不脱发，早日成为技术专家～

如对文中细节有疑问，欢迎加微信咨询～
