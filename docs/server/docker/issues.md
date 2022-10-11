# docker 踩坑记录

这里记录使用 docker 踩过的坑。

### 容器/服务启动失败

在本地电脑生成镜像，推送时报错：

> The requested image's platform (linux/arm64/v8) does not match the detected host platform (linux/amd64) and no specific platform was requested

啥意思呢？镜像的适用平台于服务器平台不符。

最后找到原因：MacBook M1 构建的镜像，直接推到服务器上是不兼容的！坑！

### 同版本镜像升级失败

docker service 升级时，更新相同版本的镜像，会出错。报错信息如下：

> could not be accessed on a registry to record its digest.

解决方案时加 `--with-registry-auth` 参数。

加这个参数后，镜像的唯一标识不再是版本号，而是一个 hash 值，也就是说允许相同版本号的多个镜像存在。

当然，这个仅限于你的 docker 私有仓库是 registry 搭建的。

### 阿里云端口突然堵塞

服务器上运行的两个 nginx 镜像，突然就访问不了了，报 504 错误。

登录服务器，netstate 查看端口映射正常，但是用 curl 访问时堵塞了，一直卡在哪里，重新启动镜像又好了，过几天又堵塞了。

网上查了半天，找到原因是阿里云内网 `eth0` 的网段,正好跟 Docker 的虚拟网卡 `docker0` 都是 172 网段，有冲突，解决方案是更换 docker 网段。

编辑 `/etc/docker/daemon.json`，没有该文件则创建，加一行：

```json
{
  "bip": "192.168.1.5/24"
}
```

然后重启 docker，再次运行 ifconfig，发现 docker0 网段已经变成 192 了，这样完美解决问题。
