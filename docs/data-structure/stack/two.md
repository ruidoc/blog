---
order: 2
---

# 对象实现栈

大家好，我是杨成功。

上一篇我们学习了解了什么是栈，以及用类和数组实现了一个栈。如果不清楚“栈”的相关概念，请移步上一篇：[怒肝 JavaScript 数据结构 — 栈篇(一)](https://juejin.cn/post/7082776327400456228)。

在上一篇的最后我们讲到，用数组实现栈有一个问题，就是当数据量大的时候，数组查询时很耗时，性能会非常低。那么本篇我们就用 JavaScript 对象实现一个栈。

## 用对象实现一个栈

首先还是 `Stack` 类，初始化如下：

```js
class Stack {
  constructor() {
    this.count = 0; // 代表数量
    this.items = {};
  }
}
```

依然按照 **LIFO** 原则，在这个类中创建和上一篇一样的方法，如下：

- `push()`：添加新元素到栈顶
- `pop()`：移除栈顶的新元素
- `peek()`：返回栈顶的元素
- `isEmpty()`：判断栈里是否有元素，没有则返回 true
- `clear()`：清除栈里的所有元素
- `size()`：返回栈里元素的数量

动手之前先来梳理一下，在数组中，默认会有下标和数组长度，所以只需要存储一个值就可以了。现在换成对象，一种 key->value 的格式，我们是不是可以模拟数组的访问形式，将 `key` 设为索引，`value` 设为值。

那么索引从哪来呢？其实就是初始化时定义的 `count` 属性。

count 属性不仅能表示栈的元素数量，还可以表示对象 `items` 的 key 值。当 count 为 0 时，items 就是一个空对象；当 count 为 1 时，items 就表示已经有一个键值对，以此类推。

所以先实现最简单的 `isEmpty` 和 `size` 方法：

```js
size() {
  return this.count;
}
isEmpty() {
  return this.count == 0;
}
```

接着实现添加元素的 push 方法：

```js
push(value) {
  this.items[this.count] = value;
  this.count++;
}
```

push 方法为对象添加新的键值对，并且 count 的值递增，以此实现了“入栈”的操作。

下面再看“出栈”的 `pop` 方法怎么写：

```js
pop() {
  if(this.isEmpty()) {
    return undefined;
  }
  this.count--;
  let item = this.items[this.count];
  delete this.items[this.count];
  return item;
}
```

pop 方法需要说一说。首先要判空，如果空对象就不执行出栈，直接返回 `undefind`；如果不为空，将 count 减一，一来能匹配到对象的最后一个属性，二来删除成功后需要减一。

接着再找到最后一个属性的值，用一个变量暂存起来，然后删除这个属性，最后将删除的值返回，大功告成。

我们试一下好不好使：

```js
var stack = new Stack();
stack.push('北京');
stack.push('上海');
```

此时 stack 的值如下：

```js
{
   count: 2,
   items: {
     0: '北京', 
     1: '上海'
   }
}
```

然后再执行两次出栈：

```js
console.log(stack.pop()); // '上海'
console.log(stack.pop()); // '北京'
console.log(stack.pop()); // undefined
console.log(stack);
// {count: 0, items: {}}
```

从测试结果来看，上面写的方法是没有问题的。然后补充一下剩余的两个方法：

```js
peek() {
  if(this.isEmpty()) {
    return undefined;
  }
  return this.items[this.count - 1]
}
clear() {
  this.count = 0;
  this.items = {};
}
```

## 实现 toString 方法

数组默认是有 `toString` 方法的，当我们想用字符串的形式展现数组的时候，直接调用 `arr.toString()` 方法，数组会变成用逗号分隔的字符串。

```js
var arr = ['北京', '上海'];
console.log(arr.toString()); // '北京,上海'
```

但是对象不行，对象的 toString 方法返回都是`'[object Object]'`。所以我们还要定义一个 toString 方法，按照数组的格式返回。

ES6 的 `Object.values` 方法可以直接将对象的值转换成数组，实现起来很简单：

```js
toString() {
  let arr = Object.values(this.items);
  return arr.toString();
}
```

完整的 `Stack` 类代码如下：

```js
class Stack {
  constructor() {
    this.count = 0;
    this.items = {};
  }
  push(value) {
    this.items[this.count] = value;
    this.count++;
  }
  pop() {
    if (this.isEmpty()) {
      return undefined;
    }
    this.count--;
    let item = this.items[this.count];
    delete this.items[this.count];
    return item;
  }
  size() {
    return this.count;
  }
  isEmpty() {
    return this.count == 0;
  }
  peek() {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[this.count - 1];
  }
  clear() {
    this.count = 0;
    this.items = {};
  }
  toString() {
    let arr = Object.values(this.items);
    return arr.toString();
  }
}
```

到这里，用对象实现栈的方法基本结束了，你学会了吗？

## 加入学习群

本文来源公众号：**程序员成功**。这是学习 JavaScript 数据结构与算法的第 3 篇，本系列会连续更新一个月，

欢迎关注公众号，点击“**加群**”一起加入我们的学习队伍～
