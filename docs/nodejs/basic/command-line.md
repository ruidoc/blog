# 命令行

运行 node 程序的方法是，在命令行中运行 `node` 命令（已安装 Node.js）并跟一个要执行的文件的名称。

比如要执行一个 node 脚本文件是 app.js，则可以这样调用：

```sh
node app.js
```

## REPL

node 命令后跟文件名，是运行 node.js 脚本文件。

如果省略文件名，则进入 REPL 模式。

```sh
$ node
>
```

REPL（Read Eval Print Loop）是交互式解析器。在该模式下，`>` 后面是等待用户输入的内容。

输入一行打印代码，回车执行：

```sh
> console.log('测试')
测试
undefined
>
```

"测试" 是打印的输出，"undefined" 是函数执行的返回值。

## 传递参数

命令行可以传递任意数量参数。

传参方式可以是键值对，也可以独立传参：

```sh
# 独立传参
node app.js ruims

# 键值对
node app.js name=ruims
```

不过为了统一，参数如果是键值对，一般都会在参数名前加 `--`，如：

```sh
node app.js --name=ruims
```

如果是短参数，一般加 `-`，如：

```sh
node app.js -v
```

更完整的解决方案参考 `commander` 这个库。

### 交互式

所谓交互式，就是等待用户输入，然后执行下一步。

比如 vue-cli 等脚手架，至少需要输入项目名称后，才会执行创建的步骤。

从版本 7 开始，node 提供了 readline 模块来执行交互：

```js
const readline = require('readline');

const line = createInterface({
  input: process.stdin,
  output: process.stdout,
});

line.question(`你叫什么名字?`, (name) => {
  console.log(`你好 ${name}!`);
  line.close();
});
```

这个模块是基础实现。更强大的方式是使用 `inquirer` 库，它提供了更完整、更抽象的解决方案。

```js
const inquirer = require('inquirer');

var questions = [
  {
    type: 'input',
    name: 'name',
    message: '你叫什么名字?',
  },
];

inquirer.prompt(questions).then((answers) => {
  console.log(`你好 ${answers['name']}!`);
});
```

inquirer 可以执行许多操作，例如询问多项选择、展示单选按钮、确认等。

### 打印信息

控制台打印使用 console 模块，与浏览器的打印用法基本相似。

最常用的方法就是 `console.log()`：

```sh
const x = 'x'
const y = 'y'
console.log(x, y)
```

除此之外，也可以传入变量和格式说明符，举个例子：

```sh
> console.log('我的%s已经%d岁了', '猫', 2)
我的猫已经2岁了
```

`%s` 作为变量取了第 2 个参数；`%d` 作为变量取了第 3 个参数。

格式化变量的参数有：

- `%s` 会格式化变量为字符串
- `%d` 会格式化变量为数字
- `%i` 会格式化变量为其整数部分
- `%o` 会格式化变量为对象

**清空控制台**

console.clear() 会清除当前控制台

**元素计数**

console.count() 方法，记录某个变量打印了多少次。

```js
const name = 'ruims';
console.count(name); // ruims: 1
console.count(name); // ruims: 2
```

**打印堆栈踪迹**

在多层函数调用的情况下，打印函数调用栈很有用。

使用 console.trace() 实现：

```js
const fun2 = () => console.trace();
const fun1 = () => fun2();

fun1();
```

则会打印以下内容：

```sh
Trace
  at function2 (repl:1:33)
  at function1 (repl:1:25)
  at repl:1:1
  ...
```

**计算耗时**

使用 time() 和 timeEnd() 轻松地计算函数执行的时间：

```sh
const fun = () => console.log('函数执行--')
const execTimes = fn => {
  console.time(fn.name)
  fn()
  console.timeEnd(fn.name)
}
```

执行计时函数：

```sh
> execTimes(fun)
函数执行--
fun: 0.261ms
```

**stdout 和 stderr**

使用 console.log 打印消息，就是标准输出（stdout）打印。

使用 console.error 打印是标准错误（stderr）打印，它不会打印到控制台，而是直接写入错误日志中。

**其他**

可以使用 chalk 库为打印信息着色：

```sh
const chalk = require('chalk')
console.log(chalk.yellow('你好'))
```

可以使用 progress 库创建进度条：

```js
const ProgressBar = require('progress');
const bar = new ProgressBar(':bar', { total: 10 });

const timer = setInterval(() => {
  bar.tick();
  if (bar.complete) {
    clearInterval(timer);
  }
}, 100);
```
