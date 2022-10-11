# history 路由

单页面应用有两种路由模式：hash 模式和 history 模式。

hash 模式通用性好，不依赖服务器配置，但是有 `#` 符号总显得不够优雅。相比于 hash 模式来说，history 模式则更加美观。

但是，history 模式也会有问题。当页面刷新时，nginx 会将前端路由认为是文件目录，因此会出现 404 的错误。解决这个问题，就要 nginx 配置解析路径。

配置方法：

```
location / {
  try_files $uri $uri/ /index.html;
}
```
