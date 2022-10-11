# go 变量与常量

变量是储存和访问内存的机制。 go 一般用 var 关键字声明变量

```go
var identifier type
```

多个变量声明：

```go
var identifier1, identifier2 type
```

### 变量声明

#### 情况一：指定类型

```go
var num int8;
num = 124;
```

如果没有初始化，则变量默认为零值。

零值情况：

- 数值类型为 **0**
- 布尔类型为 **false**
- 字符串为 **""**
- 其他情况为 **nil**

#### 情况二：类型推断

```go
var b = true;
var n = 124;
```

#### 简写

简写只能在函数中使用，不能全局使用

```go
var nm string = 'ruims'
// 可以简写为
nm := 'ruims'
```

#### 多变量声明

```go
//非全局变量
var a, b, c int
a, b, c = 1, 2, 3

//简写
var a, b, c = 1, 2, 3
a, b, c := 1, 2, 3

//因式分解声明全局变量
var (
    e int
    f string
)
```

#### 空白标识符

go 中声明的变量必须使用，否则报错

然而在函数中，可能包含多个参数，如果只使用一个，另一个就可以用空白标识符 **\_** 占位。

```go
//只获取函数返回值的后两个
_,numb,strs := numbers()
```

### 值类型和引用类型

这两个概念和 JS 中的概念基本一致。

值类型：int、float、bool，string，变量值存于栈内存中，变量直接指向内存中的值

引用类型：派生类型，变量值存与堆内存中，变量指向堆内存的地址，这个地址被称为**指针**。

### 常量

常量是一个简单值的标识符，运行时不会被修改。且只能是简单类型！

和变量一样，支持显示定义，隐式定义，声明简写，因式分解

```go
const LENGTH int = 10
const WIDTH int = 5
var area int
//多重赋值
const a, b, c = 1, false, "str"
const (
    Unknown = 0
    Female = 1
    Male = 2
)
```

#### iota

特殊常量，可以被编译器修改的常量。

默认为 0，每加一行，iota 自增 1

```go
const(
   a = iota   //0
   b          //1
   c          //2
   d = "ha"   //独立值，iota += 1
   e          //"ha"   iota += 1
   f = 100    //iota +=1
   g          //100  iota +=1
   h = iota   //7, 恢复计数
   i          //8
)
```
