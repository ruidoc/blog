# Netstat

Netstat 命令用于显示各种网络相关信息，如网络连接，路由表，接口状态 (Interface Statistics)，masquerade 连接，多播成员 (Multicast Memberships) 等等。

Netstat 命令一般要配合参数使用，展示你需要的信息。

### 常见参数

- -a (all)显示所有选项，默认不显示 LISTEN 相关
- -t (tcp)仅显示 tcp 相关选项
- -u (udp)仅显示 udp 相关选项
- -n 拒绝显示别名，能显示数字的全部转化成数字。
- -l 仅列出有在 Listen (监听) 的服務状态
- -p 显示建立相关链接的程序名
- -r 显示路由信息，路由表
- -e 显示扩展信息，例如 uid 等
- -s 按各个协议进行统计
- -c 每隔一个固定时间，执行该 netstat 命令。

提示：`LISTEN` 和 `LISTENING` 的状态只有用 -a 或者 -l 才能看到
