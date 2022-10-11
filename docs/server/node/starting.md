# 初识 node

Node.js 是一个开源与跨平台的 JavaScript 运行时环境。

Node 运行于 V8 引擎，单进程，单线程，通过异步非阻塞 IO，在并发处理上有极大的优势。

在浏览器中对新的 ECMAScript 语法会有兼容问题，但是在 node 中完全无此顾虑，可以放心的使用新语法。

### Node 与浏览器的区别

浏览器和 Node 均使用 JavaScript 作为开发语言。

在浏览器中有，node 中没有的功能：

- DOM
- Window
- Document

在 node 中有，浏览器中没有的功能：

- fs 文件操作
- http 服务器
- 其他服务器相关功能

模块系统也不同：

Node 使用 CommonJS，浏览器使用 ES 模块标准。

这意味着在 Node 中使用 `require()`，在浏览器中则使用 `import`
