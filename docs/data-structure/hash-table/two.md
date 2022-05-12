---
order: 2
---

# 解决 hash 冲突

大家好，我是杨成功。

上一篇我们学习了新的数据结构 —— 队列。大家也应该明白了队列中“**先进先出**”的原则。这一篇我们要学的是一种特殊的队列，叫做双端队列。

如果还不清楚队列是什么，请阅读上一篇[ 怒肝 JavaScript 数据结构 — 队列篇](https://juejin.cn/post/7083891791782477854)。

## 什么是双端队列

先看队列的概念：队列是遵循**先进先出**（**FIFO**）原则的一组有序集合。队列的规则是在尾部添加新元素，从头部移除最近的元素。

我们还举了一个排队的例子。比如你去买早点，看到前面有人，你肯定要从最后面排队，排在最前面的人先买到早点，然后才能轮到下一个人。

但是你想一下，会不会有这种场景：

1. 我在最后面排着队呢，突然有急事，不得不赶紧离开
2. 我付完钱刚离开，突然发现没拿吸管，赶快跑到最前面拿一根

这两种情况从队列的角度来说，是违反“**先进先出**”的原则的，因为最后入列的新元素，竟然从队列尾部出列了；本该出列的第一个元素，竟然又从队列头部入列了！这就相当于在队列中，又发生了栈的“后进先出”的情况。

其实这就是双端队列，双端队列约等于 **队列+栈**。

现在我们看具体的概念：**双端队列**，英文名 **deque**，是一种允许我们同时从头部和尾部添加和移除元素的特殊队列。可以把它看作是队列和栈相结合的一种数据结构。

双端队列在计算机世界里最常见的应用是——**撤销**。比如你在做文本编辑，每一个操作都被记录在了一个双端队列中。正常情况下，你输入的文字会源源不断从这个队列的尾部插入。当满足某种条件之后，比如最多 1000 字，你可以把最前面的文字从队列头部移除。

但是你突然发现有个字写错了，此时是可以在键盘上用 `ctrl+z` 撤销的，这个撤销操作就是把最后面的文字从队列尾部出列，表示这个文字被移除了。

计算机和现实生活中的双端队列，都同时遵循了“先进先出”和“后进先出”的原则。

## 实现双端队列

结合前面的知识，我们基于 JavaScript 的对象，实现一个双端队列。

```js
const Deque = (() => {
  let _start;
  let _end;
  let _items;
  class Deque {
    constructor() {
      _start = 0;
      _end = 0;
      _items = 0;
    }
  }
  return Deque;
})();
```

如上代码，`items` 属性用来存储双端队列的元素，和上一篇队列的一摸一样。

因为双端队列也是一种队列，队列基本的方法如 `isEmpty`，`clear`，` size` 和 `toString` 与上篇队列介绍的一摸一样，所以就不赘述了。有需要了解的小伙伴可以点文章开头上一篇的链接查阅。

双端队列相比于普通队列有以下几个方法：

- `addFront()`：从双端队列头部添加元素
- `addBack()`：从双端队列尾部添加元素（与队列的 enqueue 方法一样）
- `removeFront()`：从双端队列头部移除元素（与队列的 dequeue 方法一样）
- `removeBack()`：从双端队列尾部移除元素（与栈的 pop 方法一样）
- `peekFront()`：返回双端队列的第一个元素（与队列的 peek 方法一样）
- `peekBack()`：返回双端队列的最后一个元素（与栈的 peek 方法一样）

这些方法只有 `addFront()` 是双端队列独有的，其他方法都能在栈和队列的实现中找到。那么就看下这个独有的方法怎么实现：

```js
addFront(item) {
  if(this.isEmpty()) {
    return this.addBack(item)
  }
  if(_start>0) {
    _start--;
    _items[_start] = item
  } else {
    for(let i = 0; i<_end; i++) {
      _items[i+1] = _items[i]
    }
    _end++;
    _start = 0;
    _items[0] = item
  }
}
```

如上代码，实现在双端队列头部入列，分三种情况。

**情况一：队列为空**

如果队列为空，则从队列的头部和尾部插入元素是一样的。所以这种情况我们直接调用从尾部插入元素的方法即可。

**情况二：start 的值大于 0**

start 的值大于 0 表示该双端队列已经有元素出列，这种情况下，我们只需要把新添加的元素放到最后出列的元素的位置即可。这个位置的 key 值就时 `start - 1`。

**情况三：start 的值等于 0**

start 的值等于 0 表示双端队列中没有元素出列。此时要在头部新添加一个元素，那么就将队列中所有元素的 key 值往后挪一位，也就是 +1。让新元素的 key 值为 0。

其他方法都在栈和队列的文章里介绍过，完整代码如下：

```js
const Deque = (() => {
  let _start;
  let _end;
  let _items;
  class Deque {
    constructor() {
      _start = 0;
      _end = 0;
      _items = 0;
    }
    // 头部入列
    addFront(item) {
      if (this.isEmpty()) {
        return this.addBack(item);
      }
      if (_start > 0) {
        _start--;
        _items[_start] = item;
      } else {
        for (let i = 0; i < _end; i++) {
          _items[i + 1] = _items[i];
        }
        _end++;
        _start = 0;
        _items[0] = item;
      }
    }
    // 尾部入列
    addBack(item) {
      _items[_end] = item;
      _end++;
    }
    // 头部出列
    removeFront() {
      if (this.isEmpty()) {
        return undefind;
      }
      let item = _items[_start];
      delete _items[_start];
      _start++;
      return item;
    }
    // 尾部出列
    removeBack() {
      if (this.isEmpty()) {
        return undefined;
      }
      _end--;
      let item = _items[_end];
      delete _items[_end];
      return item;
    }
    // 头部第一个元素
    peekFront() {
      if (this.isEmpty()) {
        return undefined;
      }
      return _items[_start];
    }
    // 尾部第一个元素
    peekBack() {
      if (this.isEmpty()) {
        return undefined;
      }
      return _items[_end];
    }
    size() {
      return _end - _start;
    }
    isEmpty() {
      return _end - _start === 0;
    }
    clear() {
      _items = {};
      _start = 0;
      _end = 0;
    }
    toString() {
      let arr = Object.values(_items);
      return arr.toString();
    }
  }
  return Deque;
})();
```

## 使用双端队列

前面的完整代码比较长，我们先试一下好不好使：

```js
// 实例化
var deque = new Deque();
console.log(deque.isEmpty()); // true
```

首先试一下头部入列的结果：

```js
deque.addFront('北京');
deque.addFront('上海');
console.log(deque.size()); // 2
console.log(deque.toString()); // 上海,北京
```

看打印结果没问题，我们再试尾部入列：

```js
deque.addBack('杭州');
deque.addBack('南京');
console.log(deque.size()); // 4
console.log(deque.toString()); // 上海,北京,杭州,南京
```

尾部入列也如预期，最后再看看出列：

```js
// 头部出列
console.log(deque.removeFront()); // 上海
// 尾部出列
console.log(deque.removeBack()); // 南京
console.log(deque.size()); // 2
console.log(deque.toString()); // 北京,杭州
```

嗯嗯，一切完美打完收工。

## 总结

本篇介绍了双端队列的概念，以及手动实现了一个双端队列。不知道你学会了没有？

如果发现有些方法看不懂，请点击文章顶部的话题 `数据结构`，查看该系列的前几篇文章。

本文来源公众号：[**程序员成功**](https://link.juejin.cn/?target=https%3A%2F%2Fwww.ruims.top%2Fstatic%2Fwxpub.png)。这是学习 JavaScript 数据结构与算法的第 7 篇，本系列会连续更新一个月。

欢迎关注公众号，点击“**加群**”一起加入我们的学习队伍～
