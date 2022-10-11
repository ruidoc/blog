---
title: 02 闭包与应用
order: 2
---

# 闭包与应用

这一节来理解闭包的概念和应用。

### 闭包概念

先来看一个例子：

```javascript
function addABC() {
  var a = 1,
    b = 2;

  function add() {
    return a + b + c;
  }
  return add;
}

var c = 3;

var globalAdd = addABC();

console.log(globalAdd()); // 6
```

像 a、b、c 这样`在函数中被使用`，但它既不是`函数参数`、也不是`函数的局部变量`，叫做`自由变量`。而像 add 这样引用了自由变量的`函数`，就叫闭包。

不过我们通常理解的闭包，是**引用了其他函数内部变量的一个函数**，即“函数内部的函数“，不包括全局作用域下的函数。

### 模拟私有变量的实现

私有变量：在类（函数）内部可访问，外部不可访问的变量（属性）

比如 java 中的`private`修饰的变量，就是私有变量

依据这个概念，函数内部访问外部不可访问，不就是`函数作用域`的特点吗？

所以我们的思路就是把私有变量用函数作用域来保护起来，形成一个闭包！

上代码：

```javascript
const User = (function () {
  // 定义私有变量_password
  let _password;

  class User {
    constructor(username, password) {
      // 初始化私有变量_password
      _password = password;
      this.username = username;
    }

    login() {
      // 这里我们增加一行 console，为了验证 login 里仍可以顺利拿到密码
      console.log(this.username, _password);
      // 使用 fetch 进行登录请求，同上，此处省略
    }
  }

  return User;
})();

var user = new User();
```

上图的实现方式是，在类的外面包一层立即执行函数，将私有变量定义到这个函数里，然后在类中读写这个变量

### 偏函数与柯里化

#### 柯里化

柯里化是把接受 n 个参数的 1 个函数，改造为只接受 1 个参数的 n 个互相嵌套的函数的过程

看一个例子：一个组合商品名称的函数

```javascript
function generateName(prefix, type, itemName) {
  return prefix + type + itemName;
}

// 添加一个分类
generateName('美团网', '美食', '火锅');

// 如果我想在美食下再加一个烧烤
generateName('美团网', '美食', '烧烤');
```

前两个参数是相同的，只是第三个参数在变，那有没有只传一个参数的方法呢？

方法就是`柯里化`，改造如下：

```Javascript
function generateName(prefix) {
    return function(type) {
        return function (itemName) {
            return prefix + type + itemName
        }
    }
}

// 返回含有美团网属性的函数
var salesName = generateName('美团网')

// 返回含有美团网-美食属性的函数
var salesBabyName = salesName('美食')

salesBabyName == generateName('美团网')('美食') // true

// 输出 '美团网-美食-火锅'
salesBabyName('火锅')
// 输出 '美团网-美食-烧烤'
vegFreshName('烧烤')
```

#### 偏函数

和柯里化一样，区别只是参数数量。柯里化只传一个参数，偏函数传多个参数

相同：动机就是为了 “记住” 函数的一部分参数，实现思路就是走闭包。
