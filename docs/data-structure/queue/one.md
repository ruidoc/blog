---
group:
  title: 队列篇
  path: /queue
  order: 3
order: 1
---

# 基础队列

大家好，我是杨成功。

前几篇我们学习了俩个数据结构 —— 数组和栈。今天要学习的数据结构叫做队列。队列与栈其实非常相似，区别是栈遵循“**后进先出**”原则，而队列正好相反，规则是“**先进先出**”。

## 什么是队列

队列是遵循**先进先出**（**FIFO**，也称为**先来先服务**）原则的一组有序集合。队列与栈一样，本质上都是数组。

队列是在尾部添加新元素，从顶部移除最近的元素。新添加的元素必须排在队列的末尾，而读取元素必须从队列最前面开始。添加与读取可以同时进行互不影响。

在生活中，我们最常见的也是最典型的例子就是排队。排队大家很熟，排在前面的先办事，办完事就能走。后面来的人只能排在最后面，等前面的人办完事才能轮到他，这就是“先来先服务”原则。

当然，也有不守规矩的人插队，这样会被大家谴责甚至挨揍，队列同样也不允许你插队，必须按照顺序，因此队列是一个“**有序集合**”。

在程序开发中，我们听的比较多的就是“**任务对列**”。任务对列就是一组计算机任务排队等待 CPU 执行。新来的任务会从底部添加到队列中，CPU 执行时则会从顶部取出任务。这样一端添加任务，另一端执行任务，公平的很。

## 实现一个队列

同样的，我们基于 JavaScript 当中的对象，实现一个队列。

```js
const Queue = (() => {
  let _start;
  let _end;
  let _items;

  class Queue {
    constructor() {
      _start = 0;
      _end = 0;
      _items = {};
  }
  return Queue;
}
```

上面代码中声明了一个名为 `Queue` 的类，其中 `items` 属性就是存储队列元素的对象。我们后续操作队列基本上就是在操作这个对象。

其实这里用数组实现更简单。但是我们在栈的那一篇说过，当数组非常大的时候，数据操作的性能就会变得很低。因此为了实现一个更高效的数据结构，我们直接用对象来实现。

另外的两个属性含义如下：

- `start`：表示队列第一个元素的 key 值
- `end`：表示队列最后一个元素的 key 值

有了属性之后，按照 **FIFO** 原则，我们还需要在这个类中创建一些方法，来指定队列的添加/移除操作。具体方法如下：

- `enqueue()`：向队列尾部添加新元素
- `dequeue()`：移除队列的第一项
- `peek()`：返回队列的第一个元素
- `isEmpty()`：判断队列里是否有元素，没有则返回 true
- `clear()`：清除队列里的所有元素
- `size()`：返回队列里元素的数量

先看如何向队列添加元素（入列）:

```js
enqueue(item) {
  _items[_end] = item;
  _end++;
}
```

因为元素要添加在末尾，所以我们将 `end` 属性作为 items 对象的 key，然后赋值为传递的参数 item，最后再将 end 属性的值加一。

end 属性是参照数组的 `.length` 属性实现的，不过在队列中，end 属性不会因为队列中元素的删除而变化，就是说只要有新元素加入队列，end 永远会加一。

接着再看如何从队列中移除元素（出列）：

```js
dequeue() {
  if(this.isEmpty()) {
    return undefind;
  }
  let item = _items[_start]
  delete _items[_start]
  _start++;
  return item;
}
```

这个代码也好理解，首先判空，然后获取第一个元素，删除这个元素，此时还不能忘记给 start 属性自增一，最后返回被删除的元素。

所以 **start** 和 **end** 属性，会在队列进行出列和入列操作时，**分别自增一**。

理解了这些，剩余的几个方法就比较简单了：

```js
size() {
  return _end - _start;
}
isEmpty() {
  return _end - _start === 0;
}
peek() {
  if(this.isEmpty()) {
    return undefind;
  }
  return _items[_start]
}
clear() {
  _items = {}
  _start = 0
  _end = 0
}
```

还需要一个 `toString` 方法。因为对象转换为字符串后的值是 **[object Object]**，我们希望的是类似于数组那样的效果，输出所有元素以逗号分隔的字符串。

我们看如何实现：

```js
toString() {
  let arr = Object.values(_items)
  return arr.toString();
}
```

最终代码如下：

```js
const Queue = (() => {
  let _start;
  let _end;
  let _items;
  class Queue {
    constructor() {
      _start = 0;
      _end = 0;
      _items = {};
    }
    enqueue(item) {
      _items[_end] = item;
      _end++;
    }
    dequeue() {
      if (this.isEmpty()) {
        return undefined;
      }
      let item = _items[_start];
      delete _items[_start];
      _start++;
      return item;
    }
    size() {
      return _end - _start;
    }
    isEmpty() {
      return _end - _start === 0;
    }
    peek() {
      if (this.isEmpty()) {
        return undefined;
      }
      return _items[_start];
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
  return Queue;
})();
```

## 使用队列

上面实现了一个表示队列的类，现在用一下好不好使：

```js
var queue = new Queue();
console.log(queue.isEmpty()); // true
```

首先执行入列操作，添加`北京,上海`两个元素。

```js
queue.enqueue('北京');
queue.enqueue('上海');
console.log(queue.size()); // 2
console.log(queue.toString()); // '北京,上海'
```

通过打印结果来看，是完全符合预期的。我们再看出列操作的效果：

```js
console.log(queue.dequeue()); // 北京
console.log(queue.dequeue()); // 上海
console.log(queue.dequeue()); // undefined
console.log(queue.size()); // 0
console.log(queue.toString()); // ''
```

上面几步从队列的头部开始，逐渐将元素移出，直到队列被清空。我们可以看出队列确实是遵循了**先进先出**的原则。

队列就介绍完了，你学会了吗？下一篇我们介绍双端队列～
