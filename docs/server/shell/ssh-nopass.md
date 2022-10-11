# ssh 免密登录

之前在做持续部署的时候，需要做 ssh 免密登录，记一下以免忘记。

首先，免密登录的大致原理，就是在客户端 `client` 生成一对密钥（包括公钥和私钥），然后将公钥传到服务器 `server`。当 client 通过 ssh 登录 server 时，不用再输入密码就能直接登进去，这就是 ssh 免密登录。

### client 操作

在客户端，生成密钥方式如下：

```
ssh-keygen -t rsa
```

然后, `cd ~/.ssh` ，会看到两个文件：

- id_rsa（私钥）
- id_rsa.pub（公钥）

~/.ssh 就是生成密钥的目录。

然后复制 id_rsa.pub 的内容，准备放到 server。

### server 操作

登录 server 后，同样进到 ~/.ssh 目录，看看有没有 `authorized_keys` 这个文件

如果没有，新建一个，必须是这个名字。然后随便建一个文件 pub_cp，把上一部拷贝的公钥内容放进去，保存

接下来执行：

```shell
cat ./pub_cp >> ./authorized_keys
```

这一步是把 pub_cp 的内容追加到 authorized_keys 的末尾。为什么这么做呢？因为 当不同的客户端配免密登录的时候，authorized_keys 里可能会存多个公钥，所以新的公钥要追加而不是覆盖。

这样就搞定了。

#### 注意事项

生成的这对公私钥，是可以在多个项目复用的，不必为每个项目都生成一对。

但是如果有的项目对生成方式有要求，那么就应该单独生成一套。

### ssh-deploy

基于 GitHub Action 的自动部署到私有服务器，需要配置 ssh，用于免密传输生成的文件。

action 地址：https://github.com/easingthemes/ssh-deploy

这个 action 需要生成 PEM 格式的公私钥，方式如下：

```sh
ssh-keygen -m PEM -t rsa -b 4096
```

生成的这对私钥用于在容器环境，上传文件到私有服务器，所以生成的时候不必覆盖我们电脑本地的私钥

```sh
Enter file in which to save the key (/Users/yangrui/.ssh/id_rsa): ./my_rsa
```

这样生成了 `my_rsa` 和 `my_rsa.pub`，复制使用就好。
