# 空镜像

docker 使用一段时间后，查看镜像列表常常会看到一些 `<none>:<none>` 的镜像，这些无 name 无 tag 的镜像是怎么产生的？我们来探索一下。

docker 官方文档中将这类镜像称作 `dangling images`。

经过查询，空镜像大致分两类，一类有用，一类无用。

### 同版本镜像

正常情况下，代码更新发布，构建镜像就要用一个新的镜像版本（tag）

然而还有一种场景，比如某个属性名写错了，修复后要更新代码。但是这个更新是一个极小的更新，再打包一个新版本的镜像显然不值得。

我们期望的是，直接更新当前版本的镜像，发布后更新服务即可。

然而默认的 `docker service update` 并不支持这种操作。因为服务默认会把 `<image>:<tag>` 当成一个镜像 ID，相同版本镜像更新服务是检测不到的。

那怎么办呢？

其实很简单，更新服务时加一个 `--with-registry-auth` 参数。

```sh
$ docker service update --with-registry-auth
```

但要明白，加上这个参数后，镜像会有什么变化？

默认情况下的服务的镜像名是这样的：

```sh
localhost:5000/react-test:1.0.2
```

加了参数更新后，镜像名会变成这样：

```sh
localhost:5000/react-test:1.0.2@sha256:b9044a6....
```

很明显，在原有镜像名后面加一个 sha256 字符（官方叫 digest）做唯一标识，这样的目的是即使镜像名重复，也可以用 digest 来判断镜像唯一性。

### 删除停止的镜像

根据容器的状态，删除 Exited 状态的容器

```sh
$ docker rm $(docker ps -qf status=exited)
```

Docker 1.13 提供了新的命令，删除所有停止的容器（推荐）。

```sh
$ docker container prune
```

默认会询问是否删除全部已停止的容器。跳过询问加 `-f` 参数即可。
