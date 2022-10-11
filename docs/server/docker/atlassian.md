# atlassian 安装

atlassian 有两款产品 `confluence` 和 `jira-software`，是目前最流行的项目管理工具。

但这两款产品是收费的。今天带来的是破解版的 docker 镜像包。

- [confluence](https://hub.docker.com/repository/docker/ruidocs/confluence)
- [jira-software](https://hub.docker.com/repository/docker/ruidocs/jira)

### jira 运行

首先拉取镜像：

```sh
docker pull ruidocs/jira:latest
```

然后运行容器：

```sh
docker run -d --name jira\
  --restart always \
  -p 18009:8080 \
  -e TZ=Asia/Shanghai \
  -m 4096M \
  -v [你的项目目录]:/var/atlassian/jira \
  ruidocs/jira:latest
```

### confluence 运行

首先拉取镜像：

```sh
docker pull ruidocs/confluence:latest
```

然后运行容器：

```sh
docker run -d --name confluence\
  --restart always \
  -p 18010:8090 \
  -e TZ=Asia/Shanghai \
  -v [你的项目目录]:/var/atlassian/confluence \
  ruidocs/confluence:latest
```

### 破解

jira 和 confluence 运行起来后，访问端口就进入了初始化页面。

配置过程中，需要输入购买的 License code，这时候就要我们破解生成了。

首先下载破解包 `atlassian-agent.jar`，下载地址在 [这里](https://gitee.com/pengzhile/atlassian-agent/releases)

然后在 atlassian-agent.jar 的同级目录运行命令：

```sh
java -jar atlassian-agent.jar \
  -d -m [你的邮箱] -n BAT \
  -p conf -o [你的项目url] \
  -s BIIC-T6GG-FMFS-70HU
```

然后在终端就能看到生成的 License code 了。
