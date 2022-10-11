# nginx 重定向

项目部署时可能有这样的情况：多个项目（前端或后端）部署在同一个域名下。这样的话就需要为每个项目单独指定 path，不同的 path 重定向到不同的项目。

重定向配置主要用到两个字段：`alias`，`rewrite`。

### alias

`alias` 译为别名，具体怎么重定向，我们来对比 `root` 看例子。

比如说，一个前端的地址是：`www.test.com`，配置如下：

```nginx
location / {
　　root /home/demo;
}
```

现在我们要做一个配置，当请求 `www.test.com/page2` 时，访问另一个前端项目 `/home/demo2`。

先看 root 配置：

```nginx
location /page2 {
　　root /home/demo2;
}
```

这样配的话，当请求 `/page2`，其实会访问到 `/home/demo2/page2`。因为 root 关键字的匹配规则是 root 的值（`/home/demo2`） + path（`/page2`）。

这可能不符合实际需求。我们想要的是请求 `/page2` 时直接访问 `/home/demo2`。

怎么办呢？其实 alias 就可以实现：

```nginx
location /page2 {
  alias /home/demo2;
}
```

此时请求 `/page2`，会正常访问到 `/home/demo2`。

如果是 vue 或 react 工程项目部署，光这样还不行，还要在 `package.json` 下配置：

```json
{
  "homepage": "/page2"
}
```

这样部署后才能正常解析。

### rewrite

`rewrite` 用来实现 URL 的重写，可以在 server 或 location 中配置，语法如下：

```nginx
rewrite [regex] [replacement] [flag]
```

比如要将 `/my-api/*` 重定向到 `/*`，配置如下：

```nginx
location /my-api/ {
  rewrite ^/my-api/(.*)$ /$1 break;
}
```

上面配置中的 `$1` 代表前面正则表达式中第一个括号匹配的值，`break` 是一个 flag，表示中止后面的匹配；

flag 有如下值：

- **last**: 本条规则匹配完成，继续向下匹配。
- **break**: 本条规则匹配完成即终止，不再向下匹配。
- **redirect**: 返回 302 临时重定向，浏览器会跳转新的 URL。
- **permanent**: 返回 301 永久重定向，浏览器会跳转新的 URL。

> 注意：break 只会终止后面的匹配，无论写在哪个位置，都会允许当前匹配执行完成。

rewrite 规则相关指令还有很多，如 if、rewrite、set、return、break 等，例子：

```nginx
server {
  listen 8080;
  break;
  return 200 "ok";
  location = /testbreak {
    break;
    return 200 $request_uri;
    proxy_pass http://127.0.0.1:8080/other;
  }
  location /testif {
    set $variable "0";
    if ($variable) {
      # 不会执行，因为 "0" 为 false
      break;
    }
    if (!-f $filename) {
      break;
    }
  }
}
```

下面说一下例子中的指令：

**return**

- 格式：**return code [text/url]**;
- 含义：中止后面的处理，向客户端返回指定 code 码和信息；

如果返回 text，即普通文本，则会响应该文本；  
如果返回 url，则会重定向到该 url；

**set**

- 格式：**set \$[var_name]**;
- 含义：设置变量；

下面列一下，做规则判断时可以用到的全局变量：

- **\$args**：请求行中的参数，同\$query_string
- **\$content_type**：请求头中的 Content-Type 字段。
- **\$document_root**：当前请求在 root 指令中指定的值。
- **\$host**：请求主机头字段，否则为服务器名称。
- **\$http_user_agent**：客户端 agent 信息
- **\$http_cookie**：客户端 cookie 信息
- **\$limit_rate**：这个变量可以限制连接速率。
- **\$request_method**：客户端请求方法，如 GET，POST。
- **\$remote_addr**：客户端的 IP 地址。
- **\$remote_port**：客户端的端口。
- **\$remote_user**：已经经过 Auth Basic Module 验证的用户名。
- **\$request_filename**：当前请求的文件路径，由 root 或 alias 指令与 URI 请求生成。
- **\$scheme**：HTTP 方法（如 http，https）。
- **\$server_protocol**：请求使用的协议，通常是 HTTP/1.0 或 HTTP/1.1。
- **\$server_addr**：服务器地址，在完成一次系统调用后可以确定这个值。
- **\$server_name**：服务器名称。
- **\$server_port**：请求到达服务器的端口号。
- **\$request_uri**：包含请求参数的原始 URI，如：”/foo/bar.php?arg=baz”。
- **\$uri**：不带请求参数的当前 URI，如”/foo/bar.html”。
- **\$document_uri**：与\$uri 相同。
