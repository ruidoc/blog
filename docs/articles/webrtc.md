# WebRTC

WebRTC (Web Real-Time Communications) ，看名字就知道是一项实时通讯技术。

提到实时通讯，我们可能首先会想到 WebSocket，那么它与 WebRTC 有什么区别呢？

最大的区别如下：

1. WebSocket：客户端与服务端实时通讯
2. WebRTC：客户端与客户端实时通讯

WebRTC 可以实现客户端之间直接通讯，而不是传统方案：需要一个中间服务去分发通信数据。

WebRTC 主要应用场景是实现视频流，音频流，或者其他任意数据的传输。且不需要任何第三方支持。

下面开始探索 WebRTC。

## 信令（Signaling）

WebRTC 是通过 `信令` 来实现多个设备连接。

信令可以认为是一种多设备通信的身份认证，它的作用就是让多个设备之间带上通用标识，可以互相定位彼此，进而实现互相通信。因为多个设备之间网络可能不同，因此还需要一个单独的 `信令服务器` 来让不同网络的设备之间可以完成信令连接。

这里注意，信令并不是 WebRTC 的一部分，WebRTC 也没有规定如何传递信令。

因此传递信令可以通过 WebSocket，也可以是 HTTP。重要的是信令服务器不需要加密/机密数据，也不需要做任何特殊处理，它只是一个中转站，将信令数据从一端带到另一端。

在实时音视频通信的过程中，我们主要用到以下三个：

- getUserMedia：获取音频和视频流（MediaStream）
- RTCPeerConnection：点对点通信
- RTCDataChannel：数据通信

## 获取客户端流

端到端通信的第一步，就是获取输出端电脑本地的媒体流。

浏览器的 `navigator.mediaDevices` API 用于获取本地媒体设备，然后提供了两种方法获取媒体流：

1. `navigator.mediaDevices.getUserMedia`：获取麦克风和摄像头的流
2. `navigator.mediaDevices.getDisplayMedia`：获取屏幕的流

### constraints

**constraints** 是 getUserMedia 和 getDisplayMedia 两个方法的参数，值为一个对象，用来指定如何获取媒体流。

最简单的，音视频都获取：

```javascript
{ audio: true, video: true }
```

获取流之后，然后直接扔给 video 标签播放就可以了。

```javascript
let video = document.querySelector('#video')
video.srcObject = stream
```

指定视频流的宽高等：

```javascript
{
  audio: true,
  video: {
    width: 1280,
    height: 720
  }
}
```

## RTCPeerConnection

RTCPeerConnection 接口代表一个由`本地计算机`到远程的 WebRTC 连接。该接口提供了创建，保持，监控，关闭连接的方法。

两个客户端建立连接，第一步是各自实例化一个 RTCPeerConnection 对象，然后通过该对象来交换 `Session Description` 数据。具体的方式是输出端（直播的电脑）发送一个 offer(请求)，输入端（看直播的电脑）发出一个 answer（应答），两方的请求和应答都正常的话，两个端就会建立连接。

上面说的 offer 和 answer 都属于 `Session Description` 数据，他们是需要两个客户端互相传递的数据。这里注意，SD 元数据并不是媒体流本身。

## NAT

NAT 是 **Net Address Translation** 的缩写，即网络地址转换。

NAT 部署在网络出口的位置，也就是连接公网的地方。有 NAT 的地方一般都有一个局域网，比如我们的 WIFI 就是一个局域网。然后这个局域网（内网）想要访问公网，那么 NAT 就把你局域网的内网地址转为公网 IP，这样你就可以愉快的追剧刷抖音了。

对应到我们家里的 WIFI 这个局域网，NAT 就装在你的路由器里面。

如何识别内网地址呢？只要 IP 在下面三个网段之内：

- 10.0.0.0-10.255.255.255;
- 172.16.0.0-172.31.255.255;
- 192.168.0.0-192.168.255.255;

不在以上网段内的，统统是外网。

NAT 还有一个非常重要的知识点：`打洞`。

什么意思呢？就是 NAT 有一个访问规则，内网可以通过 NAT 转换访问到外网，但是外网却不能够访问到内网。当外网访问内网地址时，会直接被 NAT 拦下，并把这个不守规矩的网络包丢掉。

但是外网任何情况下都访问不到内网吗？却也不是。

假设我们称一个局域网为 `A`，公网为 `B`。当 A 主动通过 NAT 访问 B 的时候，NAT 会打开 A 和 B 连接的通道。此时如果机智的 B 向 A 发送消息，B 会惊喜的发现竟然可以发送成功！这就相当于 A 主动访问 B 时在 NAT 上打了一个洞，这个洞可以供 AB 互相通信，B 也可以访问 A 了。

了解了什么是 “打洞”，再以 A,B 为例，看看 NAT 对这个 “洞的大小” 做了什么规定。

NAT 有 4 种不同的类型：

- `Full Cone NAT`：完全透明 NAT。**任意**外网 IP 都可以访问内网 A
- `Restricted Cone`：受限 NAT。外网 B 的**任意端口**可以访问内网 A
- `Port Restricted Cone`：端口受限 NAT。外网 B 的**指定端口**可以访问内网 A

不同类型的 NAT 决定了打洞时 “洞的大小”。

## ICE

ICE 是指交互式连接设施（Interactive Connectivity Establishment）是一个允许`你的浏览器`和`对端浏览器`建立连接的协议框架。

首先我们要搞懂，为什么需要 ICE？

在实际的网络中，有很多原因会导致从 A 端到 B 端直连失败，比如防火墙阻隔，或者路由器不允许主机直连，关键原因还是局域网内的设备没有一个唯一的公网地址，因此两端难以通信。

ICE 提供了上述各种不能连接的解决方案，主要有两个：

- `STUN`：作为服务器，用于私网设备获取自己的唯一公网 IP，和所在路由器是否允许对外连接
- `TURN`：如果路由器严格限制对外连接，

## 疑难杂症

不知道为什么，TS 竟然不认识 `getDisplayMedia` 这个属性，获取屏幕流时会报错：

[WX20211221](./images/WX20211221.png)

经过排查应该是 TS 版本太低，我从 4.1 升级到 4.5 就可以了。
