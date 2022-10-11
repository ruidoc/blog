# php 扩展

Docker 中的 PHP 容器安装扩展的方式有

- pecl 方式安装
- php 容器自带命令安装

这里，我们主要讨论的是第二种方案。这种方案也可以在 Dockerfile 中的 RUN 命令中进行使用。

PHP 中安装扩展有几个特殊的命令：

- docker-php-source
- docker-php-ext-install
- docker-php-ext-enable
- docker-php-ext-configure

这四个命令，要进入 php-fpm 容器中运行。

### docker-php-source

实际上就是在 PHP 容器中创建一个 `/usr/src/php` 的目录，用于存放扩展源码，一般比较少用，知道即可。

### docker-php-ext-install

用来安装并启动 PHP 扩展。

```sh
# 命令格式
docker-php-ext-install “扩展名”
```

比如要安装 redis 扩展：

```sh
# 查询是否有该扩展
php -m | grep redis

# 如果没有，安装
docker-php-ext-install redis
```

### docker-php-ext-enable

用来启动 **PHP 扩展** 的。使用 pecl 安装 PHP 扩展后，默认不会启动，必须要在 php.ini 中配置一下。

这个命令相当于自动配置 php.ini。

```sh
docker-php-ext-enable redis
```

### docker-php-ext-configure

需要跟 docker-php-ext-install 搭配使用，作用是安装扩展的时候，进行自定义配置。
