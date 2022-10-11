# 前端为什么要学 shell?

Shell 是 操作 Linux 系统的桥梁。

对于前端同学来说，几乎不需要和服务器打交道，为什么要学习 shell 呢？

其实从目前工程化的前端来看，至少有 3 个方面会用得到 shell。

1. webpack 编译配置
2. 服务器部署配置
3. 为服务器操作提供 GUI 界面

下面一一细说这三个方面的用处。

### webpack 编译配置

webpack 的打包命令 `npm run dev` 就是在执行一个 shell 命令。

它会从 `package.json` 文件里的 `script` 字段下去寻找 `dev` 这个 key，对应的值就是实际执行的 shell。比如这个例子：

```json
{
  "script": {
    "dev": "webpack src/index.js dist/bundle.js"
  }
}
```

具体执行的 shell 就是：

```sh
webpack src/index.js dist/bundle.js
```

基于这条命令，可以定制更多功能。比如说设置一个自定义环境变量：

```sh
APP_ENV=staging webpack src/index.js dist/bundle.js
```

再复杂一些，每次打包生成不同名字的文件夹，名字是 `${timestring}_build`：

```sh
version=$(date "+%s")_build && webpack src/index.js dist/$version/bundle.js
```

如果你不懂 shell，你会认为这是 webpack 自带的功能，你就不会从 shell 的角度去思考如何解决问题。

### 服务器部署配置

前端项目打包后要部署到服务器，整个部署流程几乎都要用到 shell。因为只要涉及到服务器，不懂 shell 命令是走不下去的。

#### 普通部署

将打包后的文件上传到服务器，需要 rsync 命令：

```sh
rsync -avz ./dist/* root@yourip:/home/project_name
```

上传服务器之后，有两种部署方式：

1. nginx 静态部署
2. nodejs + pm2 部署

这两种方式，就要懂基本 shell 命令和 nginx 和 node 相关操作。

#### 自动部署

自动部署，也就是常说的 CI/CD，自动部署对 shell 的熟练度要求更高。

常用的 3 中部署方式：

1. Git 远程仓库
2. GitHub Action
3. Docker 镜像

这 3 种方式对编写 shell 是基本要求，否则很难编写 .yml 配置和 Dockerfile。 所以说前端的自动部署和部署过程中的问题排查，要求前端同学必须懂 shell。

### 为服务器操作提供 GUI 界面

举个例子：vue-cli3 的图形化界面。

在这个界面上可以控制项目的创建，安装，启动，停止，删除等。结合本文开头的图，可以知道每个操作其实都是在执行一条 shell 命令。

当然了，大多数前端是调用接口操作数据，很少直接操作系统信息。但是一些提升效率的小工具，需要操作系统信息。

比如 宝塔 Linux 面板，比如阿里云。

学习 shell，是迈向高级前端的重要一步。
