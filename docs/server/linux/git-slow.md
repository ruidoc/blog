# git 下载过慢

在 CentOS 服务器上执行 git 克隆，拉取，推送时，超级慢，甚至超时，这里记录下解决方案。

首先，特别慢的原因是 `github.global.ssl.fastly.net` 域名被限制了。思路是找到对应 IP，然后加到 hosts 文件中，最后刷新 DNS 缓存即可。

### 查找 IP

`nslookup` 命令用于获取域名的 IP 地址。

如果没有该命令，则需要安装：

```sh
$ yum -y install bind-utils
```

然后获取 IP 地址，记录下来：

```sh
$ nslookup github.global.ssl.fastly.net
$ nslookup github.com
```

我获取到的 IP 分别是：

```sh
108.160.167.159
13.250.177.223
```

### 修改 hosts 文件

首先编辑 hosts 文件：

```sh
$ sudo vim /etc/hosts
```

然后填入上一步查到的域名和 IP 的映射：

```
# /etc/hosts
108.160.167.159 https://global-ssl.fastly.net
13.250.177.223 https://github.com
```

填完后保存即可。

### 刷新 DNS

上一步修改的 hosts 还未生效，需要刷新 DNS 生效。

这一步用到 `nscd` 命令，没有的话安装：

```sh
$ yum -y install nscd
```

然后执行刷新 dns 的命令：

```sh
$ nscd -i hosts
```

现在再试一下 git clone，你会发现速度飞起～
