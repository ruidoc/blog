---
order: 3
---

# 多容器（Compose）

Docker Compose 是 Docker 官方编排工具，负责实现对多个 Docker 容器快速编排。

我们知道，`Dockerfile` 用于定义单个容器。但有时一个应用常常需要多个容器相互关联协调，比如说前端应用部署需要 `nodejs + nginx`，此时单独使用 Dockerfile 无法满足，于是出现了 Docker Compose。

Docker Compose 通过一个单独的 `docker-compose.yml` 配置文件进行多个容器的关联配置。

### 版本说明

Docker Compose 目前广泛使用的有两个版本：其中 `1.x` 版本是一个单独的包，提供了 `docker-compose` 命令。

最新的 Docker 官方用 GO 语言重写了 Docker Compose，将其作为了 Docker CLI 的子命令，称为 `Compose V2`，用 `docker compose` 命令替换了 `docker-compose`。

经过实践 Compose V2 的多容器配置启动操作更优雅，建议直接使用 V2 版本。

### 安装

> 注意：本部分仅针对 Compose V1 的安装方式，V2 由 Docker 自带不需要安装。

Docker Compose 有两种安装方式：第一种是直接下载二进制包，第二种是通过 Python 的包管理工具 pip 进行安装，两种方式都介绍一下。

**二进制包**

Linux 系统下，切换目录至 `/usr/local/src`，这个目录是简历的源文件下载目录。

```sh
$ sudo curl -L https://github.com/docker/compose/releases/download/1.29.2/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose

$ sudo chmod +x /usr/local/bin/docker-compose
```

然后就可以使用 `docker-compose` 命令了。

**PIP 安装**

一般情况下，建议使用下载二进制包的方式安装。PIP 安装适用于如树莓派这样的应用。

执行安装命令：

```sh
$ sudo pip install -U docker-compose
```

### 基本使用

执行 `docker compose` 命令的目录，需要有 `docker-compose.yml` 或者 `compose.yml` 配置文件。

首先是运行服务：

```sh
$ docker compose up
```

查看运行的服务：

```sh
$ docker compose ps
```

停止运行的服务：

```sh
$ docker compose stop
```

删除已经停止的服务：

```sh
$ docker compose rm
```

如果没有上述说的配置文件，也可以指定其他的 `.yml` 配置文件，如：

```sh
$ docker compose -f mycustom.yml up -d
```

这行命令 `-f` 参数表示指定一个 `.yml` 配置文件，`-d` 参数表示后台运行。

### 实践经验

Docker Compose 可以用于构建镜像，也可以用于批量管理容器的生命周期（启动、停止、销毁等）。最常用的是使用配置文件指定多个容器运行的配置，然后一键运行。

比如我要同时运行 node 和 nginx 两个容器，并指定端口，compose.yml 配置如下：

```yaml
version: '3'
services:
  frontend:
    ports:
      - '8880:80'
    image: 'nginx:1.25.1-alpine'
  server:
    ports:
      - '8900:80'
    image: 'node:16-alpine'
```

然后在该目录执行运行命令即可：

```sh
$ docker compose up -d
```

执行命令后会自动下载镜像并批量启动容器，之后可用上面介绍的命令批量停止和移除。
