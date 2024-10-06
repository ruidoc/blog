---
group:
  order: 2
order: 1
---

# location 配置

location 是对服务器路由解析规则的配置。

### location 表达式类型

~ 表示执行一个正则匹配，区分大小写 ~\* 表示执行一个正则匹配，不区分大小写 ^~ 表示普通字符匹配。使用前缀匹配。如果匹配成功，则不再匹配其他 location。 = 进行普通字符精确匹配。也就是完全匹配。 @ "@" 定义一个命名的 location，使用在内部定向时，例如 error_page, try_files

### location 优先级说明

以下是按优先级排列说明：第一优先级：等号类型（=）的优先级最高。一旦匹配成功，则不再查找其他匹配项。第二优先级：^~类型表达式。一旦匹配成功，则不再查找其他匹配项。第三优先级：正则表达式类型（~ ~\*）的优先级次之。如果有多个 location 的正则能匹配的话，则使用正则表达式最长的那个。第四优先级：常规字符串匹配类型。按前缀匹配。

### location 优先级配置项如下:

```nginx
location = / {
    # 仅仅匹配请求 /
    [ configuration A ]
}
location / {
    # 匹配所有以 / 开头的请求。
    [ configuration B ]
}
location /documents/ {
    # 匹配所有以 /documents/ 开头的请求。
    [ configuration C ]
}
location ^~ /images/ {
    # 匹配所有以 /images/ 开头的表达式
    [ configuration D ]
}
location ~* \.(gif|jpg|jpeg)$ {
    # 匹配所有以 gif jpg jpeg结尾的请求
    [ configuration E ]
}
```
