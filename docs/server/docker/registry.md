# 私有仓库（registry）

使用 Docker 拉取镜像时，默认会从 Docker Hub 这个公共仓库拉取。

Docker Hub 也可以上传自己的镜像。不过，上传后会对所有人开放，这对于私有镜像来说显然是不够友好的。

为此，Docker 官方提供了工具 `registry` 来帮助搭建私有仓库。

### 安装运行

首先在你要搭建私有仓库的服务器上，安装好 Docker，并拉取 `registry` 镜像：

```sh
$ docker pull registry
```

然后，建立要存储私有镜像的目录，如 `/data/docker/registry`

建好后，创建容器：

```sh
$ docker run -d \
  -p 5000:5000 \
  --restart=always \
  --name registry \
  -v /data/docker/registry:/var/lib/registry \
  registry
```

运行成功后，测试连接情况：

```sh
$ curl http://localhost:5000/v2/_catalog
```

如果返回：

```sh
{"repositories":[]}
```

表示仓库创建成功，此时仓库内没有镜像。

最后，再用 nginx 转发 5000 端口即可。

### 上传镜像

服务端配置好之后，现在来到客户端操作，客户端也需要装好 Docker 环境。

刚才服务端配置简便，没有登录上传的功能，所以客户端要绕过权限验证，直接上传镜像。

绕过权限验证，需要客户端的 Docker 做以下配置：

```sh
$ vim /etc/docker/daemon.json
```

写入你的服务器域名，不加 http 前缀：

```json
{
  "insecure-registries": ["docker.xxx.com"]
}
```

保存后，重启 docker

```sh
systemctl restart docker
```

### 登录授权

上一部分我们搭好私有仓库，但是没有登录验证，所以上传镜像时，要在客户端做绕过授权的配置。

实际在服务器上部署仓库时，必须是有账户密码的用户才能推送镜像。

在数据目录下新建 auth 文件夹，添加一个用户 `testuser`，密码是 `testpass`

```sh
$ mkdir auth
$ docker run \
  --entrypoint htpasswd \
  httpd:2 -Bbn testuser testpass > auth/htpasswd
```

现在创建好了用户，我们先停止之前运行的容器：

```sh
$ docker stop registry
```

然后重新运行：

```sh
$ docker run -d \
  -p 5000:5000 \
  --restart=always \
  --name registry \
  -v /data/docker/registry:/var/lib/registry \
  -v /data/docker/registry/auth:/auth \
  -e "REGISTRY_AUTH=htpasswd" \
  -e "REGISTRY_AUTH_HTPASSWD_REALM=Registry Realm" \
  -e REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd \
  registry:2
```

运行成功后，假设你配置的外网域名是 docker.test.com，在浏览器中访问：

```sh
docker.test.com/v2/_catalog
```

如果弹出登录框，让你输入账号密码，就是添加成功了。

### Web UI

Web UI 是提供一个 web 页面更方便的管理私有仓库中的镜像。

使用 `docker-registry-ui` 这个开源项目来实现页面，demo 在 [这里](https://github.com/Joxit/docker-registry-ui/tree/main/examples/ui-as-proxy)

docker-registry-ui 提供一个 docker 镜像，与 registry 关联在一起。

我们写一个 `registry.yml`，作为 docker-compose 的配置：

```yml
version: '2.0'
services:
  registry:
    image: registry:2
    environment:
      - REGISTRY_AUTH=htpasswd
      - REGISTRY_AUTH_HTPASSWD_REALM=Registry Realm
      - REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd
    volumes:
      - /data/docker/registry:/var/lib/registry
      - /data/docker/registry/auth:/auth
    networks:
      - registry-ui-net

  ui:
    image: joxit/docker-registry-ui:latest
    ports:
      - 5000:80
    environment:
      - REGISTRY_TITLE=My Private Docker Registry
      - NGINX_PROXY_PASS_URL=http://registry:5000
      - SINGLE_REGISTRY=true
    depends_on:
      - registry
    networks:
      - registry-ui-net

networks:
  registry-ui-net:
```

这个配置将 registry 和 UI 两个服务绑成了一个应用容器。

执行启动命令：

```sh
$ docker-compose -f registry.yml -d
```

启动后，通过 5000 端口访问 web 界面，同时 5000 也代理了 registry。也就是说。可以同时使用 5000 端口访问 web 界面和推送/拉取镜像。

> 注意：如过你的服务器是 swarm 集群，使用 docker-compose 只会在当前节点创建容器，而不会扩展到其他节点。推荐方案是 `docker stack deploy`

### 允许删除

默认 registry 的镜像是不允许删除的，registry-ui 也没有提供删除的按钮。

Registry 的配置是一个 YAML 文件，它提供了非常多的默认配置（文档参考[这里](https://docs.docker.com/registry/configuration/)），是否允许删除就是一个配置，默认如下：

```yml
storage:
  delete:
    enabled: false
```

因为我们是用 compose 运行的，没有 registry 配置文件，只有 compose.yml 文件，所以允许删除的配置要在 compose.yml 里定义。

registry 提供了一个配置规则，可以将配置字段大写并且用`_`连接起来，组成一个环境变量，使配置生效。

所以上面的配置转换成环境变量是：

```sh
REGISTRY_STORAGE_DELETE_ENABLED=true
```

将该环境变量写入 compose.yml，即完成了配置。
