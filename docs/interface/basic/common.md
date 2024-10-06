# 基础面试题

## 输入 URL 到页面渲染发生了什么？

1. DNS 解析：将域名转换成 IP 地址（缓存判断 + 查询 IP 地址）
2. 建立 TCP 连接：三次握手建立 TCP 连接。
3. SSL/TLS 四次握手（只有 https 才有这一步）
4. 发送 HTTP 请求：向服务器发送 HTTP 请求，获取资源包。
5. 服务器处理请求，返回 HTTP 响应：返回数据或者静态文件。
6. 浏览器解析资源，渲染引擎开始工作。
7. 加载资源：加载图片等静态资源。
8. 执行 JavaScript：调用 JS 引擎。
9. 断开连接：TCP 四次挥手

## 浏览器

浏览器是`多进程架构`、它为每个标签页、插件、扩展等分配独立的进程。

- **Browser 进程（主进程）**：负责管理用户界面（UI），如菜单栏、工具栏等，并且管理其他进程。
- **Render 进程（渲染进程）**：每个标签页都有自己的渲染进程，负责页面的渲染、脚本执行等。这是渲染引擎实际工作的进程。
- **GPU 进程**：专门处理图形相关的工作，如合成图层、加速 2D/3D 绘图等。
- **Plugin 进程**：处理如 Flash 等插件的内容。

渲染进程中的多线程：

- `UI线程`：负责页面的渲染和脚本执行。JavaScript 代码在这个线程上运行，这意味着 JavaScript 的执行会阻塞 UI 更新。
- `渲染线程`：负责绘制页面到屏幕上。
- `JavaScript 执行`：尽管 JavaScript 本身是单线程的，现代浏览器实现了 Web Workers API，使得可以在后台线程上运行 JavaScript 脚本。
- `网络请求`：浏览器会使用多线程来处理网络请求，以便更快地加载资源。

## 跨域的方案

跨域是浏览器的同源策略，在客户端请求其他域名下的资源，会被拦截。

- JSONP：仅限 GET 请求，动态创建 `<script>` 标签，设置 `src` 并传递回调函数名，在服务端调用回调函数，将数据作为参数传递。
- CORS：服务端设置 `Access-Control-Allow-Origin: *`
- 反向代理：比如 Vite 的开发服务器。
- Service Worker：浏览器后台进程，可作为代理服务器，拦截并处理 HTTP 请求。