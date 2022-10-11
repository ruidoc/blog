# docker 相关

这里用来记录 docker 相关的服务需要的 nginx 配置。

### registry 413

在服务器上用 registry 搭建了 docker 私有仓库，在推送镜像时终端报 413 错误：

```
error parsing HTTP 413 response body: invalid character '<' looking for beginning of value: "<html>\r\n<head><title>413 Request Entity Too Large</title></head>\r\n<body>
```

这是一段 html 响应报错，关键信息是 _413 Request Entity Too Large_，意思是上传资源太大。

这是因为你代理 registry 端口的 nginx 限制了上传大小。解决方案也简单，改下 nginx 配置：

修改 `/etc/nginx/nginx.conf` 文件，在 `http` 配置下增加一行：

```sh
client_max_body_size 1024M
```

这个设置最大上传文件为 1G，根据需要配置即可。
