# 网络知识

## 三次握手、四次握手、四次挥手

TCP 连接：

1. client->server
2. server->client
3. client->server

TCP 断开：

1. client->server
2. server->client
3. server->client
4. client->server

## SSL/TLS 握手过程

1. 客户端问候 (Client Hello)
2. 服务器问候 (Server Hello)
3. 服务器发送证书 (包含公钥)
4. 服务器问候完成
5. 客户端生成密钥（使用公钥加密）
6. 变更密码规范（双方发送，表示之后信息加密）
7. 完成握手（互相发送一个加密的 Finished 消息）

## TCP 与 UDP

TCP 协议下，连接的建立需要三次握手，这是为了确保传输稳定。因此 TCP 又被称为“面向连接的可靠传输”。

UDP 则恰恰相反，它的世界里没有握手、没有知情同意，是一个非常随性的协议。又被称为是“无连接的不可靠传输”。

## 四层 TCP/IP 模型

- 数据链路层：数据帧。
- 网络层：IP 寻址、子网掩码。
- 传输层：TCP、UDP、定义端口
- 应用层：FTP、HTTP

## HTTP 协议的发展

- `HTTP1.0`：每次请求，都要走 TCP 三次连接，请求量大时，消耗非常高。
- `HTTP1.1`：实现长连接，可以在握手成功后，发送多个 HTTP 请求。
- `HTTP2.0`：改进性能，比如二进制分帧、服务端推送。
