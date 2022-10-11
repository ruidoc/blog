# 容器（container）

镜像（Image）和容器（Container）的关系，可以理解为面向对象中的 `类` 和 `实例`。

容器的实质是进程，是真正运行起来的服务。

### 数据卷

已 node 为例，数据卷命令：

```sh
$ docker run -v /date/myroot:/node/path
```

**注意**！数据卷的映射是：`[宿主path]:[容器path]`，端口映射也是这个规则，不要搞反了！
