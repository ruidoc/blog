# 安装 MongoDB

MongoDB 是最流行的文档数据库，目前最新版本是 7.x，我们用上一个版本 6.x。

![](./imgs/2024-01-27-06-39-00.png)

## 运行容器启动 MongoDB

首先拉取 MongoDB 的官方镜像：

```sh
$ docker pull mongo:6
```

然后在宿主环境中创建两个目录，作为容器数据卷：

```sh
/docker/mongodb/data/    #数据库数据目录
/docker/mongodb/dump/    #备份数据目录
```

然后作为一个容器运行：

```sh
$ docker run --name mongodb \
    --restart=always \
    -p 27017:27017 \
    -v /docker/mongodb/data:/data/db \
    -v /docker/mongodb/dump:/var/dump \
    -d mongo:6 --auth
```

![](./imgs/2024-01-27-07-16-48.png)

运行成功后，我们进入容器：

```sh
$ docker exec -it <container_id>  /bin/bash
$ mongosh  # 进入数据库，不需要用户名
```

![](./imgs/2024-01-27-07-26-53.png)

切换到 admin 数据库（身份验证数据库），创建一个超级用户：

```sh
$ use admin

$ db.createUser({
  user:'root',
  pwd:'mongo_root_pass',
  roles:[{
    role:'root',
    db:'admin'
  }]
})
```

接下来使用这个用户登录 MongoDB，就可以执行“创建数据库、创建用户”等操作了。

## 启动容器并创建用户

上一步我们先启动容器，然后再创建超级用户，实际上这两个步骤可以一次完成。

在运行容器时，如果传入下面的两个环境变量：

- `MONGO_INITDB_ROOT_USERNAME`：用户名
- `MONGO_INITDB_ROOT_PASSWORD`：密码

MongoDB 会自动在 admin 数据库中创建该用户，指定角色为 root，并自动启用身份验证（--auth）。

所以上面的运行容器命令可以优化为这样：

```sh
$ docker run --name mongodb \
    --restart=always \
    -p 27017:27017 \
    -v /docker/mongodb/data:/data/db \
    -v /docker/mongodb/dump:/var/dump \
    -e MONGO_INITDB_ROOT_USERNAME=root \
    -e MONGO_INITDB_ROOT_PASSWORD=mongo_root_pass \
    -d mongo:6
```

这样 MongoDB 启动之后，便自动创建了超级用户。

## 启动时初始化

默认的 admin 数据库用于身份验证。当真正存储数据时，需要创建一个新的数据库。

创建数据库和用户需要权限，一般我们会用超级用户登录到 admin 数据库，然后再创建其他数据库和用户，如下：

```sh
$ docker exec -it <container_id>  /bin/bash # 进入容器
$ mongosh admin --username root --password mongo_root_pass # 登录 admin 数据库
$ use test_db  # 创建/切换数据库
```

然而如果是在 CI（自动化部署）环境中，我们希望 MongoDB 启动后自动创建需要的数据库和用户，而不是每次都要手动创建，这时应该怎么办呢？

这时候要借助一个 Docker 下的特殊目录：`docker-entrypoint-init.d`。

该目录下可以自定义脚本文件，在容器第一次启动时自动执行。`mongo` 镜像可以识别该目录下的 `.sh` 和 `.js` 文件，并按照顺序执行。

那么我们就在 /docker/mongodb 目录下创建一个 `mongo-init.js` 文件，并在运行容器时挂载：

```sh
-v /docker/mongodb/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js
```

现在在该文件中编写初始化逻辑，比如创建一个用户：

```js
// mongo-init.js
db.createUser({
  user: 'test_user',
  pwd: 'test_pass',
  roles: [
    {
      role: 'dbOwner',
      db: 'test_db',
    },
  ],
});
```

> 提示：docker-entrypoint-init.d 目录下的脚本只会在第一次运行容器的时候执行。如果通过 -v 挂载过数据，那么就不是第一次。可以去掉 -v 模拟第一次运行。

上面的 JS 文件中可以访问 `db` 对象，因为它在 `mongosh` 环境下执行。默认情况下，db 代表 “test” 数据库。

如果我们要切换数据库，命令是 `use <db_name>`。然而在 JS 文件中，显然这种语法是不支持的。

关于如何在 JS 文件中切换数据库，我找了很多方法，最终发现可以用 `db.getSiblingDB()` 方法替代。

因此，在 test_db 数据库中创建/切换用户，可以修改如下：

```js
db = db.getSiblingDB('test_db');

db.createUser({
  user: 'test_user',
  pwd: 'test_pass',
  roles: [
    {
      role: 'dbOwner',
      db: 'test_db',
    },
  ],
});
```

通过 `db.getSiblingDB()` 方法，我们可以在 JS 脚本中创建多个数据库和用户。

如果你不想在 JS 代码中创建/切换数据库，也可以用环境变量 `MONGO_INITDB_DATABASE` 指定脚本在某个数据库下执行。

> 提示：

## Docker Compose 运行

如果你觉得运行容器的命令太长，那么使用 Docker Compose 也是一个不错的选择。

首先创建 `compose.yml` 配置文件如下：

```yml
version: '3.1'

services:
  mongodb:
    image: mongo:6
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: mongo_root_pass
      MONGO_INITDB_DATABASE: test_db
    volumes:
      - '/docker/mongodb/data:/data/db'
      - '/docker/mongodb/dump:/var/dump'
      - '/docker/mongodb/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js'
```

然后运行启动命令：

```sh
$ docker compose up -d
```

## 连接到 MongoDB

在启动 MongoDB 时，传入 `--auth` 参数表示开启授权验证，不传则不开启。

如果未开启授权验证，连接 MongoDB 不需要账号密码，连接 URL 如下：

```
mongodb://127.0.0.1:27017
```

如果开启授权验证，则连接 URL 中必须指定数据库、账号、密码，如下：

```
mongodb://user:pass@127.0.0.1:27017/dbname
```
