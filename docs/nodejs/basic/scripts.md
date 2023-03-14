# 脚本 Script

命令行那一节讲过，node 命令后跟一个脚本文件名，就会执行该脚本。

node 脚本就是 Node.js 的可执行文件。

### 退出程序

在控制台中，可以使用 ctrl+c 退出程序。

在脚本文件中，则可以通过 `process.exit()` 方法退出程序。

当 node.js 执行到该方法时，进程会被立即强制终止，任何正在处理的任务都会被强制中断。

可以传入一个整数，表示退出码：

```sh
process.exit(1)
```

默认情况下，即程序执行完毕正常退出，退出码为 `0`。这里可以通过非 0 的退出码表示特定的异常。

### 读取环境变量

通过 `process.env` 可以获取所有的环境变量。

我们常用的环境变量 _NODE_ENV_，其默认存在，且默认值为 `development`

```sh
process.env.NODE_ENV # "development"
```

当然也可以修改环境变量：

```sh
process.env.NODE_ENV = "production"
```

### 获取参数

在 node 中通过 `process.argv` 来获取传来的参数值，它返回一个数组。

第一个数组项是 node 命令的完整路径。

第二个数组项是被执行文件的完整路径。

从第三个数组项开始才是真正上面传递的参数值，所以获取参数值的方式是：

```js
const args = process.argv.slice(2);

console.log(args); // ['atg1','arg2']
```

如上所示，args 是参数集合，通过下标来获取参数。

但是下标对键值对的获取不太友好，可以借助 `minimist` 库获取参数。

如：传一个 name 参数，参数名前加双破折号：

```sh
node app.js --name=ruims
```

那么就可以这样获取参数值：

```js
const mm = require('minimist');
const args = mm(process.argv.slice(2));

args['name']; //ruims
```

更强大的 node 命令行解决方案，可使用 `commander` 库。
