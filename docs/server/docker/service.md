# 服务（service）

上节集群说过，任务（task）是一个容器，服务（service）则是一组容器。

集群初始化完成后，我们首先新建一个服务：

```sh
$ docker service create --name sev-test -p 80:80 nginx:1.13.7
```

根据这条命令来看，创建一个服务也是要基于一个镜像，然后起一个服务名称，基本操作和创建容器有点相似。

创建之后，可以查看服务：

```sh
$ docker service ls
```

也可以查看某个服务的详情：

```sh
$ docker service ps sev-test
```

也可以查看某个服务的运行日志：

```sh
$ docker service logs sev-test
```

不想要了，删除服务：

```sh
$ docker service rm sev-test
```

注意：删除服务，正在运行的所有容器都会被删除掉！

### 滚动升级

为什么要使用服务，而不是直接使用容器？最重要的一个原因是服务提供了滚动升级的功能。

也就是说，当你的新镜像要部署时，使用服务的滚动升级更顺滑，而容器的 stop-remove-start 流程太过繁琐，不利于自动更新。

滚动升级分两步：

**第一步：拉取镜像**

滚动升级前，肯定要构建一个新的镜像。所以第一步是要将新构建的镜像拉下来。

**第二步：升级镜像**

比如当前镜像是 `test:1.0.0`，新拉取的镜像是 `test:1.0.1`，则升级命令如下：

```sh
$ docker service update --image test:1.0.1 [service-name]
```

等几秒钟，镜像就升级成功了，相关的容器也会基于新镜像重新启动，实现升级。

但是滚动升级有个问题，就是会产生很多**垃圾镜像**和**垃圾容器**。

进行升级后，执行 `docker ps -a` 会查看到很多已停止但是未清除的容器，就是滚动升级时创建的垃圾容器。

因为每次升级要拉取新镜像，版本多了后镜像也会越来越多，因此造成了垃圾镜像。

关于垃圾镜像和容器的清理需要一个合理的机制，我还没想好，想好的话会再出一章笔记记录。

### 快速回滚

除了升级，还有一个重要功能是**回滚**。

回滚命令比较简单，传一个服务名称即可：

```sh
$ docker service rollback [service-name]
```

回滚会直接回到升级前的镜像版本。特别是在新镜像出问题的情况下，回滚非常有用。

注意一点：**回滚是回到服务升级前的镜像版本，而不是镜像的上一个版本**。

啥意思呢？比如说你依次发布了 3 个镜像，分别为 `image:0.1`，`image:0.2`，`image:0.3`

当前的服务运行的镜像版本是 `image:0.3`。此时我们进行一次回滚，成功后，服务的镜像版本变成了 `image:0.2`。

如果此时我们再进行一次回滚的话，服务的镜像会变成哪个版本？

如果你认为是 `image:0.1`，那就大错特错了！此时服务的镜像会变成 `image:0.3`。

为什么？请再看一遍上面加粗的那句话。

此时服务的镜像版本是 `image:0.2`，虽然镜像的上一个版本是 `image:0.1`，但是服务升级前运行的镜像版本是 `image:0.3`，所以再次回滚后镜像变成了 `image:0.3`。

也就是说，如果你不断回滚，则镜像会在最近的两个版本之间来回切换。