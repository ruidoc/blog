# Node.js

## Node.js 并发

QPS：每秒查询总数，是网站并发量的参考标准，一般通过 ab 压测工具统计。

Node.js 统计 QPS：使用计数器和定时器在 `app.get(‘/’)` 中统计。

> 压测命令：ab -n [请求总数] -c [并发数] [URL]

Socket.io

为什么不用 WebSocket? 原因有三个：

1. 心跳机制，自动重连
2. 发送广播，组播
3. 事件确认机制
