# mongodb

mongodb 是最流行的文档数据库，目前最新版本是 5.0，我们用上一个版本 4.4

### 容器运行

首先拉取 mongodb 的官方镜像：

```sh
$ docker pull mongo:4.4
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
    -v /data/docker/mongodb/data:/data/db \
    -v /data/docker/mongodb/dump:/var/dump \
    -d mongo:4.4 --auth
```

运行成功后，我们进入容器：

```sh
$ docker exec -it <container_id>  /bin/bash
$ mongo  # 进入数据库，不需要用户名
```

切换到 admin 数据库，并创建用户：

```sh
use admin

db.createUser({
  user:'root',
  pwd:'bigger_frontend_mongo',
  roles:[{
    role:'root',
    db:'admin'
  }]
})
```

接下来就可以用这个账户连接数据库了。

### stack 运行

新建 `stack.yml`：

```yml
version: '3.1'

services:
  mongo:
    image: mongo:4.4
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: bigger_frontend_mongo

  mongo-express:
    image: mongo-express
    restart: always
    ports:
      - 8081:8081
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: admin_mongo
      ME_CONFIG_MONGODB_ADMINPASSWORD: bigger_mongo_pass
      ME_CONFIG_MONGODB_URL: mongodb://root:bigger_frontend_mongo@mongo:27017/
```

### 使用

未开启授权验证时连接 mongodb 的 url 是：

```
mongodb://127.0.0.1:27017
```

开启之后的 url 是：

```
mongodb://user:pass@127.0.0.1:27017/dbname
```
