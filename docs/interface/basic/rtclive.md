# 直播技术

流程：直播端(RTMP、WebRTC) -> 推流(WebRTC) -> 拉流(FLV、WebRTC)

- mpegts.js：基于 flv.js 改造而来，使用 MSE 实现直播。 jessibuca：因为 iOS 屏蔽了 MSE，所以需要使用 jessibuca 来播放（使用了 WASM 硬解码）
- HLS：优点是兼容性/稳定性/跨平台最好，缺点是延迟太高（30s）

直播中的关键难题：

1. 自定义播放和暂停
2. 错误处理（网络错误/媒体错误/无流）
3. 解决卡顿问题

Flv.js 如何优化：

1. enableStashBuffer：启用 IO 缓存区，追求最小延迟设为 false
2. liveBufferLatencyChasing：启用追帧
3. url：设置 ws 或者 http，常用 http 流式 IO

亮点：

1. 卡顿检测：通过监听解码帧，对比上一次解码帧，一样就表示卡顿
2. 无流检测：无异常，但是解码帧不变

直播优化三种方案：

1. RTMP 推流-> Flv 拉流：满、稳定
2. RTMP 推流-> WebRTC 拉流：较快、推流稳
3. WebRTC 推流-> WebRTC 拉流：快、推流不太稳

## WebRTC

1. 通过 navigator.mediaDevices 获取媒体流（限制：域名是 localhost 或 https）
2. 通过 constraints 参数配置只获取音频或视频，或者音视频同时获取

一个媒体流（MediaStream）会包含多条媒体轨道（MediaStreamTrack），可以单独获取。

```js
let videoTracks = stream.getVideoTracks(); // 视频轨道
let audioTracks = stream.getAudioTracks(); // 音频轨道
stream.getTracks(); // 全部轨道
```

描述 WebRTC 点对点连接过程

1. 创建连接实例（RTCPeerConnection）
2. 通过 navigator.mediaDevices 获取媒体流，并添加到实例
3. 两端互换 SDP(会话描述)，发起端的 SDP 被称为 offer，接收端的 SDP 被称为 answer
4. 将自己和对方的 SDP 分别设置为本地描述（LocalDescription）和远程描述（RemoteDescription）
5. 两端进行 ICE 监听（onicecandidate）候选人连接，获取 candidate 并添加到对方实例中

> 重点：SDP 的目的是协商媒体信息和网络信息；ICE 的目的是穿越 NAT 网络；

总结：两个客户端监听对方的 WebSocket 发送消息，然后接收对方的 SDP，互相设置为远程描述。接收端还要获取 candidate 数据，这样“信令”这个过程就跑通了。

WebRTC 难点：

1. ICE 穿墙：穿不过去，配置服务器
2. 桌面视频和摄像头视频，混合为一路流，传输后在拆为 2 路流
3. 信令服务器搭建

SRS 流媒体服务器

背景：WebRTC 的多对多通信，有三种架构：

1. Mesh：多个终端两两连接，无服务器。
2. MCU：服务器中转方案，服务器负责编解码/混流，压力很大。
3. SFU：服务器中转方案，服务器不处理流，只负责转发，主流流媒体服务器类型（包括 SRS）

运行：docker 本地启动，再通过 OBS 推流，就能在管理面板看到播流了。

SRS 提供了 Web SDK 实现 WebRTC 的推流/拉流。客户端发起一个 HTTP 请求，传递一个 offer，服务器响应一个 answer，连接就建立起来了。

带宽占用较大：原因：拉流端实时拉流，对服务器负载太高

1. 转码和流复制：将源视频流转换为不同码率的流
2. CDN 分发：缓存和分发流，减轻主服务器压力
3. 自适应比特率：提供多种分辨率和比特率的流

注意：码率和比特率是一个东西，表示数据传输的速度。

音视频不同步：原因：一般是网络抖动引起的

1. 优化编码器
2. 同步机制：追帧， RTP 时间戳调整播放位置。
3. 网络优化：监听网络情况。
4. 设置缓冲区：牺牲一点实时性，保证流畅性。

卡顿的原因：

1. 数据包丢帧
2. 缓冲区不足
3. 解码延迟
4. 网络延迟

CDN 失效怎么办？

1. Nginx 侧做负载均衡
2. 服务端应用做限流（限制 IP 在某个时间段的请求次数）
3. 监控告警：及时处理错误
