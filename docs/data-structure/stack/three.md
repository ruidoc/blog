---
order: 3
---

# 进制转换

大家好，我是杨成功。

前面两篇我们学习了栈的知识，并且分别用数组和对象实现了栈。那本篇是栈系列的最后一篇，主要是再做一些内部优化，并用栈解决一个进制转换的问题。

## 保护内部属性

上一篇我们实现了用对象模拟栈的操作，但是还是有一个不严谨的地方，就是它内部的变量 count 和 items 可以在外部访问，这不是我们想要的。

count 和 items 本质上来说叫私有变量，私有变量的意思就是内部逻辑使用，外部是不可以访问的。但是 JavaScript 至今没有提供“私有变量”的语法，怎么办呢？

其实还是有方法的，下面介绍一下。

### 下划线命名约定

如果你看过很多 JavaScript 项目的源码，一定见到过 `_` 开头的变量，这其实是开发者的一种约定，并不是标准。开发者用这种命名方式，表示该变量是一个私有变量。

按照这个约定，我们上面的命名应该是这样：

```js
this._count = 0;
this._items = {};
```

但事实上你在外部访问 `_count`，还是可以访问的，所以说这是个约定，只是用于标识这个变量是一个私有变量。

### 闭包助阵

想必你一定熟悉闭包的特性：变量内部访问，外部不可访问，这不就是我们需要的吗？

背了这么久的闭包面试题，终于派上用场了。我们用闭包改造一下 Stack 类：

```js
const Stack = (() => {
  let _count;
  let _items;

  class Stack {
    constructor() {
      _count = 0;
      _items = {};
    }
    push(value) {
      _items[_count] = value;
      _count++;
    }
    pop() {
      if (this.isEmpty()) {
        return undefined;
      }
      _count--;
      let item = _items[_count];
      delete _items[_count];
      return item;
    }
    size() {
      return _count;
    }
    toString() {
      let arr = Object.values(_items);
      return arr.toString();
    }
    isEmpty() {
      return _count === 0;
    }
    peek() {
      if (this.isEmpty()) {
        return undefined;
      }
      return _items[_count - 1];
    }
    clear() {
      _count = 0;
      _items = {};
    }
  }
  return Stack;
})();
```

其实这个改造思路很简单，就是在原来的 class 外包一层立即执行函数，在函数内定义私有变量，然后返回这个类。

如果不熟悉 Stack 类的具体逻辑，请参考上一篇 [怒肝 JavaScript 数据结构 — 栈篇(二)](https://juejin.cn/post/7083140117572878373)

现在我们试一下效果：

```js
var stack = new Stack();

// 入栈
stack.push('北京');
stack.push('上海');
console.log(stack.toString()); // '北京,上海'
console.log(stack.size()); // 2

// 出栈
console.log(stack.pop()); // '上海'
console.log(stack.toString()); // '北京'
```

类的代码逻辑和上面的完全一样，只不过把 `this.count` 替换成了 `_count`，这样的话函数作用域内部代码可以访问变量，但是外部访问不到，这样就实现了私有变量的效果。

## 用栈实现进制转换

上面我们用闭包+class 实现了一个比较完善的栈。其实栈的应用场景有很多，比如我们接下来要介绍的这个，如何用栈实现进制转换？

先来看十进制如何转化成二进制（二进制是满二进一）。通常方法是将十进制数除以 2 并对商取整，记录下余数；如果商不为 0，继续除以 2 取余，直到结果是 0 为止。

举个例子，把十进制的数 10 转化成二进制的数字，过程大概是如下这样：

```js
10 / 2 = 5, 余 0;
5 / 2 = 2,  余 1;
2 / 2 = 1,  余 0;
1 / 2 = 0,  余 1;
```

然后每一次取余之后，将余数入栈，最后栈内的数据应该是这样：

```js
[0, 1, 0, 1];
```

所有余数入栈之后，再全部出栈，最后将输出连接得倒 `1010`，这就是对应的二进制值。

好了，思路有了，我们看代码实现：

```js
const toBinary = (number) => {
  // 栈的实例
  let stack = new Stack();
  // 商
  let value = number;
  // 余数
  let rem;
  let string = '';

  while (value > 0) {
    rem = value % 2;
    stack.push(rem);
    value = Math.floor(value / 2);
  }

  while (!stack.isEmpty()) {
    string += stack.pop();
  }

  return Number(string);
};
```

首先函数的参数是一个十进制整数。然后以`商大于0`为条件循环，执行入栈操作，最后再循环出栈，拼接字符，就得到了二进制的数值。

来测试一下：

```js
console.log(toBinary(10)); // 1010
console.log(toBinary(16)); // 10000
console.log(toBinary(28)); // 11100
```

结果正确，大吉大利！

## 栈的小结

栈是数据结构中很常用的一种，我们先介绍了它的概念和特点，然后分别用数组和对象实现了自定义的栈，最后还用栈实现了进制转换。相信经过这三篇的学习，你已经明白栈是怎么一回事了。

下一篇，我们将开始学习第三个数据结构：队列。

## 加入学习群

本文来源公众号：**程序员成功**。这是学习 JavaScript 数据结构与算法的第 3 篇，本系列会连续更新一个月，

欢迎关注公众号，点击“**加群**”一起加入我们的学习队伍～
