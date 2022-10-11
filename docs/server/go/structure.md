# go 语言结构

还是基于第一节的 **Hello World**，来解析一下基本的 go 语言结构

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
```

### 结构解析

基础组成有这几个部分：

- 包声明
- 引入包
- main 函数
- 标识符

**包声明**

第一行代码 `package main` 定义了包名，类似于 React 的组件类名，是这个文件的标识。

**导入包**

`import "fmt"` 导入一个系统包，类似于 nodeJs 中导入 path 模块。

当然也支持安装和导入第三方包，也有类似 npm 的东西，这个后面会讲。

**main 函数**

`func main()` 是程序第一个执行的函数，是必须声明的，类似于 nodejs 中的入口文件。

**标识符**

标识符包括常量、变量、类型、函数名等

以大写字母开头的标识符表示公共，即外部可用；以小写字母开头的表私有，仅内部可用。类似于面向对象中的 public 和 private。

如：**fmt.Println**，Println 就是公共方法，可被外部使用。
