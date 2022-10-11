# go 语言第一课

go 语言是新兴的后端开发语言，被称为云时代的 c 语言，适合搭建分布式集群服务。

它有三大特色：

- 并行
- 编译迅速
- 性能堪比 C

目前 go 语言开发的两大杀器：`Docker`，`Kubernetes`，成为了云平台和大规模集群的标配。

### Hello World

任何一门编程语言都是从 Hello World 开始的。

我们来看 go 语言：

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
```

在命令行运行 `go run`：

```bash
$ go run hello.go
Hello, World!
```

接下来我们从安装到实践，一步步揭开 go 语言的神秘面纱。

一个不错的 demo [示例](https://github.com/xinliangnote/go-gin-api)
