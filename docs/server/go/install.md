# go 安装环境

上一节在终端运行的 **go** 命令，是要在安装 go 语言环境之后才能运行成功的。

如果你的终端提示 go 命令找不到，那么先来装环境吧~

### 地址

官方下载地址：[https://golang.org/dl/](https://golang.org/dl/)

如果官方地址打不开，可以用国内地址：

国内下载地址：[https://golang.google.cn/dl/](https://golang.google.cn/dl/)

找到和你系统对应的安装文件：

- Windows：\*.msi
- Linux：\*.tar.gz
- Mac：\*.pkg

除此之外，还有一个源码文件：

- 源码包：\*.src.tar.gz

源码文件不管，找到对应平台的安装文件然后下载。

### Linux 安装

假设已下载二进制包 _go1.17.linux-amd64.tar.gz_

第一步：解压到 **/usr/local** 目录：

```sh
tar -C /usr/local -xzf go1.17.linux-amd64.tar.gz
```

第二步：将 /usr/local/go/bin 目录添加至 PATH 环境变量：

```
export PATH=$PATH:/usr/local/go/bin
```

### 设置中文代理

运行 `go env` 查看所有环境变量

其中默认的两个变量是:

```bash
GO111MODULE=""
GOPROXY="https://proxy.golang.org,direct"
```

因为存在被墙的可能，所以设置一下七牛云的代理：

```bash
$ go env -w GO111MODULE=on
$ go env -w GOPROXY=https://goproxy.cn,direct
```
