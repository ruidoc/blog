# verdaccio

verdaccio 是一款自部署的 npm 私有仓库工具。

### docker 安装

首先，拉取镜像，最新是 5.x 的版本。

```sh
$ docker pull verdaccio/verdaccio
```

然后，建一个存放数据和配置的文件夹：

```sh
$ mkdir /docker/verdaccio/ && cd /docker/verdaccio/
$ mkdir conf storage plugins
```

完成后，直接运行容器：

```sh
# V_PATH 是你的宿主环境目录
V_PATH=/data/docker/verdaccio; docker run -it --name verdaccio \
  -p 4873:4873 \
  -v $V_PATH/conf:/verdaccio/conf \
  -v $V_PATH/storage:/verdaccio/storage \
  -v $V_PATH/plugins:/verdaccio/plugins \
  --restart=always \
  -d verdaccio/verdaccio
```

这样就运行起来了，nginx 转发 4873 端口即可。
