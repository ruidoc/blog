---
group:
  title: 实践
  path: /practice
  order: 2
order: 1
---

# 搭建 HTTP 服务器

前端 er，什么时候，你想写一个 HTTP 服务器？

当你第一次接触工程化的项目时，看到项目控制台正在 building，过一会突然跳出一个 URL 地址，你点开它居然是你刚写好的网页，好神奇。

当你接后端同伴的接口时，你把数据带去，接口竟然给你返回 500 错误；你去找后端，后端说这样传不行，你不知道为啥不行，反正按照他说的改完，返回 200 成功了。

有时候你的请求莫名其妙的就跨域了，后端说让你们自己处理，你就找呀找解决方案。但是为什么会跨域？后端怎么配置的，你也不清楚。

终于有一天，你痛定思痛，决定痛改前非，一定要自己搭一个 HTTP 服务器，彻底理清这里面的弯弯绕绕，从此拒绝被忽悠，拒绝做只听命令的大头兵。

但是话说回来了，怎么入手呢？

别急，这都给您备好啦。写 HTTP 服务器需要后端语言，不用说，自然首选 Node.js。

下面我们基于 Node.js 的 `http` 模块，一起搭建一个的 HTTP 服务器。

## http 模块

一个超简单的 HTTP web 服务器的示例：

```js
const http = require('http');

const server = http.createServer((request, response) => {
  response.statusCode = 200;
  response.end('hello world');
});

server.listen(3000);
```

这里引入了 [http](http://nodejs.cn/api/http.html) 模块，提供了 `createServer` 方法，传入一个回调函数，创建了一个服务器。

现在把代码写进 `index.js` ，再超简单的把它运行起来：

```sh
$ node index.js
```

打开浏览器，输入 `http://localhost:3000`，就能看到网页显示的 `hello world` 了。

### 代码剖析

**http.createServer** 方法的参数是一个回调函数，这个回调函数有两个参数 —— 它们是 HTTP 服务器的核心。

第一个参数是请求对象 `request`，第二个参数是响应对象 `response`。你可以把它们看作两个袋子，一个袋子里装着请求相关的数据，一个袋子里装着响应相关的操作。

`request` 包含了详细的请求数据，也就是我们前端调接口传递过来的数据。通过它可以获取请求头，请求参数，请求方法等等。

`response` 主要用于响应相关的设置和操作。什么是响应？就是我收到了客户端的请求，我可以设置状态码为 200 并返给前端数据；或者设置状态码为 500 并返给前端错误。

总之一句话，调用接口返回什么，是由 `response` 决定的。

事实上，createServer 返回的是一个 [EventEmitter](http://nodejs.cn/api/events.html)，因此上面的写法等同于这样：

```js
const server = http.createServer();

server.on('request', (request, response) => {
  response.statusCode = 200;
  response.end('hello world');
});
```

## request 解析

用户发起请求的相关数据，都包含在 request 对象中。

这些数据包含常用的请求方法，请求头，url，请求体等等数据。

```js
const { method, url, headers } = request;
```

method 表示请求方法可直接使用，headers 返回请求头对象，使用也比较简便：

```js
const { headers } = request;
const userAgent = headers['user-agent']; // 请求头全是小写字母
```

唯独 url 字符串不好解析，里面包含了协议，hostname，path，query 等等。

所幸 Node.js 提供了 `url` 和 `querystring` 两个模块解析 url 字符串。

### URL 解析

先看一个 url 模块的例子：

```js
const url = require('url'); // 解析url字符串
var string = 'http://localhost:8888/start?foo=bar&hello=world';

var url_object = url.parse(string);
// { protocol: 'http:', host:'localhost:8888', pathname: '/start', query: 'foo=bar&hello=world' }
```

看到了吧，`url` 模块可以将一个完整的 URL 地址字符串，拆分成一个包含各部分属性的对象。

但是美中不足，其他部分都解析出来了，唯独 query 还是一个字符串。

`query` 需要二次解析。怎么办呢？这时候第二个模块 `querystring` 出场了：

```js
const querystring = require('querystring'); // 解析query字符串
var string = 'http://localhost:8888/start?foo=bar&hello=world';

var url_object = url.parse(string); // { query: 'foo=bar&hello=world' }
var query_object = querystring.parse(url_object.query);
// { foo: 'bar', hello: 'world' }
```

这下就完美了。用 url + querystring 组合，可以完整解析你的 URL。

### 请求体解析

对于 `POST` 或者 `PUT` 请求，我们需要接收请求体的数据。

这里请求体比较特殊，它不是一次性传过来的数据，而是通过 `Stream` 流的方式流式传递来的，因此要通过监听 **data** 和 **end** 事件一点点的接收。

获取方法如下：

```js
let body = [];
request.on('data', (chunk) => {
  // 这里的 chunk 是一个 Buffer
  body.push(chunk);
});
request.on('end', () => {
  body = Buffer.concat(body);
});
```

## response 设置

服务器收到客户端请求，要通过 response 设置如何响应给客户端。

响应设置，主要就是状态码，响应头，响应体三部分。

首先是**状态码**，比如 404：

```js
response.statusCode = 404;
```

再有是**响应头**：

```js
response.setHeader('Content-Type', 'text/plain');
```

最后是**响应体**：

```js
response.end('找不到数据');
```

这三部分也可以合在一起：

```js
response
  .writeHead(404, {
    'Content-Type': 'text/plain',
    'Content-Length': 49,
  })
  .end('找不到数据');
```

## 发送 http 请求

http 模块除了接受客户端的请求，还可以作为客户端去发送请求。

发送 http 请求是指，在 Node.js 中请求其他接口获取数据。

发送请求主要通过 `http.request` 方法来实现。

### GET

下面是一个发送 GET 请求的简单示例：

```js
const http = require('http');
const options = {
  hostname: 'nodejs.cn',
  port: 80,
  path: '/learn',
  method: 'GET',
};

const req = http.request(options, (res) => {
  console.log(`状态码: ${res.statusCode}`);
  res.on('data', (d) => {
    process.stdout.write(d);
  });
  res.on('end', () => {});
});

req.on('error', (error) => {
  console.error(error);
});

req.end();
```

使用 http.request 发送请求后，必须显示调用 `req.end()` 来表示完成请求发送。

### POST

与上面 GET 请求基本一致，区别是看**请求体怎么传**：

```js
const http = require('http');
const options = {
  hostname: 'nodejs.cn',
  port: 80,
  path: '/learn',
  method: 'POST',
};

const body = {
  sex: 'man',
  name: 'ruims',
};

const req = http.request(options, (res) => {
  console.log(`状态码: ${res.statusCode}`);
  res.on('data', (d) => {
    process.stdout.write(d);
  });
  res.on('end', () => {});
});

req.on('error', (error) => {
  console.error(error);
});

req.write(JSON.stringify(body)); // 传递 body 参数写法

req.end();
```

## 诡异之处

看到这里，如果你对 nodejs 理解不深，可能会发现几处诡异的地方。

比如，正常情况下 POST 请求传递 `body` 参数可能是这样的：

```js
var body = { desc: '请求体参数' };
var req = http.request({
  path: '/',
  method: 'POST',
  data: body,
});
```

而上面说到的正确姿势是这样的：

```js
var body = { desc: '请求体参数' };
var req = http.request({
  path: '/',
  method: 'POST',
});
req.write(JSON.stringify(body));
```

还有上面获取请求体也是如此，不能直接通过 `res.body` 获取，非得监听事件，然后拼接数据。

这几处应该是大家理解 http 模块最困惑的地方。其实刨根问底，这不属于 http 的难点，而是 Node.js 中 `Stream` 流的特有语法。

事实上，http 模块的核心 ——— `request` 和 `response` 都属于 `Stream`，一个是可读流，一个是可写流。

因此，彻底理解 http 模块，还需要深入了解 `Stream` 流的相关知识。

## 总结

本篇基于最基础的 http 模块搭建了简单的 HTTP 服务器，并且实现了简单的**接收请求**和**发送请求**。

不过呢，真正的应用场景一般不会这么搭。社区有成熟稳定的 [express](https://expressjs.com/) 框架更适合写 Node.js 服务；发送请求，可以用我们最熟悉的 [axios](https://axios-http.com/) ——— 没错，axios 也可以在 Node.js 中使用。

但是你可能不知道，express 和 axios 的核心功能，都是基于 http 模块。

因此，基础很重要。地基不牢，地动山摇。当你在 express 中见到 `Stream`  的用法时，也不至于不明所以。

这篇就到这里，下一篇我们继续探索 `Stream` 流，记得关注我哦。

> 本文来自我的专栏 [前端砍柴人](https://juejin.cn/column/7034157511779287070)，如果对您有帮助，不妨点个赞鼓励一下哈，成功我再接再厉～
