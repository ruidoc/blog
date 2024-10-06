---
order: 4
---

# 集群（swarm）

Swarm 是 Docker 内置的集群管理和编排工具。

使用 `Swarm` 集群之前需要了解以下几个概念。

### 节点

运行 Docker 的主机，也就是这台服务器，可以初始化一个 Swarm 集群或者加入一个已存在的 Swarm 集群。

节点分为管理 (manager) 节点和工作 (worker) 节点。

管理节点用于管理 Swarm 集群，可以有多个。但只有一个管理节点可以成为 leader，管理其他所有节点。

工作节点是任务执行节点，管理节点将服务 (service) 下发至工作节点执行。（管理节点默认也作为工作节点）

### 服务和任务

任务（Task）是 Swarm 中的最小的调度单位，目前来说就是一个单一的容器。

服务 （Services） 是指一组任务的集合。

服务通过 `docker service create` 创建。

![services-diagram](../image/services-diagram.png)

### 初始化集群

初始化集群，同时会将这台机器设置为管理节点。

```sh
$ docker swarm init
```

初始化成功后输出如下：

```
To add a worker to this swarm, run the following command:

    docker swarm join --token [token] [ip:port]

To add a manager to this swarm, run 'docker swarm join-token manager' and follow the instructions
```

这里可以记下打印的 `token` 和 `ip`，供后续使用。

初始化集群之后，下面就进入服务的操作了。
