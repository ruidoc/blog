# openvpn 安装笔记

记录一下 openVpn 的踩坑笔记。

## Docker 安装运行

1. 设置 $OVPN_DATA 变量，值为 openvpn 配置文件的绝对路径：

```sh
$ OVPN_DATA="/data/docker/openvpn/ovpn-data-focusone"
$ echo $OVPN_DATA; # 测试
```

2. 初始化配置文件

执行以下命令，将 `IP_ADDRESS` 替换为当前部署服务器的公网 IP 地址。

```sh
$ docker run -v $OVPN_DATA:/etc/openvpn --rm kylemanna/openvpn ovpn_genconfig -u udp://IP_ADDRESS
```

3. 初始化 PKI 并创建根证书

执行以下命令初始化 **PKI（Public Key Infrastructure，公钥基础设施）**，生成的配置会存储在 `kpi` 目录下。

```sh
$ docker run -v $OVPN_DATA:/etc/openvpn --rm -it kylemanna/openvpn ovpn_initpki
```

此命令执行后会自动创建 **CA（Certificate Authority，证书颁发机构）** 的根证书（公钥证书），会要求输入一个根证书密码。请牢记该密码，后面生成客户端证书签名时要用。

3. 通过 Docker 启动 OpenVPN 服务

```sh
$ docker run -v $OVPN_DATA:/etc/openvpn -d --name openvpn -p 1194:1194/udp --cap-add=NET_ADMIN kylemanna/openvpn
```

## 创建与删除客户端证书

1. 创建客户端证书

执行以下命令，将 `USERNAME` 替换为用户名称：

```sh
$ docker run -v $OVPN_DATA:/etc/openvpn --rm -it kylemanna/openvpn easyrsa build-client-full $USERNAME nopass
```

其中 `nopass` 可选，表示生成不带密码的客户端证书，与带密码的证书在功能上没有区别。

命令执行后，如果未设置免密，会要求输入两次客户端证书密码，最后输入根证书密码签名。

2. 删除客户端证书

```sh
# 1. 删除用户证书
$ docker run -v $OVPN_DATA:/etc/openvpn --rm -it kylemanna/openvpn easyrsa revoke $USERNAME
# 2. 更新证书数据库
docker run -v $OVPN_DATA:/etc/openvpn --rm -it kylemanna/openvpn easyrsa gen-crl update-db
```

3. 将 openvpn 容器重启

```sh
$ docker restart openvpn
```
