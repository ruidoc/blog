---
order: 4
---

# 双向循环链表

大家好，我是杨成功。

前两篇我们详细介绍了链表，我们知道链表是元素互相独立，但是又互相连接的一个有序集合。当我们查询某一个元素的时候，必须从表头开始，一级一级向后查找。

双向链表其实就是在链表的基础上，增加了一个“从后往前”查询的功能。因为链表只能从表头查起，一直向后查。而双向链表允许从最后一个元素查起，一直往前查。

所以双向链表中的元素有两个引用，一个指向前一个元素，另一个指向下一个元素。

## 实现双向链表

双向链表是链表的一种类型，基础功能还是链表提供的。所以实现双向链表，直接在原有的链表方法上面拓展即可。

我们用 ES6 中 class 继承的方式，实现双向链表。

```js
class DoubLinkedList extends LinkedList {
  constructor(equalFn) {
    super(equalFn);
    this.tail = undefined;
  }
}
```

上面的基本代码，是在 linkedList 的基础上增加了一个 `tail` 属性，表示尾部的元素引用。其中 `super` 方法的作用是调用 **LinkedList** 的构造函数，从而实现完整的继承。

构造函数这样改造即可，还有在链表元素当中，也要增加一个 `prev` 属性指向前一个元素，所以同样用继承的方法实现：

```js
class DoubNode extends Node {
  constructor(value) {
    super(value);
    this.prev = undefined;
  }
}
```

下面我们看双向链表如何添加和删除元素。

## 升级 insert 方法

链表篇的 insert 方法，只需要为新元素添加 next 引用；而双向链表插入时还需要提供 `prev` 引用。我们基于链表篇的 insert 方法进行一次升级改造。

```js
insert(item, index) {
  if(index >= 0 && index <= this.count) {
    let node = new DoubNode(item)
    let current = this.head;
    if(index == 0) {
      // 1. 首位添加逻辑
      if(!this.head) {
        this.head = node
        this.tail = node
      } else {
        node.next = current
        current.prev = node
        this.head = node
      }
    } else if(index === this.count) {
      // 2. 末尾添加逻辑
      current = this.tail
      current.next = node
      node.prev = current
      this.tail = node
    } else {
      // 3. 中间位置添加逻辑
      let previous = this.getItemAt(index - 1)
      current = previous.next
      previous.next = node
      node.prev = previous
      node.next = current
      current.prev = node
    }
    this.count++;
    return true;
  }
  return false;
}
```

说明一下，代码中的 `current` 变量表示索引位置的元素。

代码中注释的部分就是要改造的部分，总共三个部分，我们一一来说。

### 首位添加

首位添加就是添加第一个元素，这个时候要分情况。如果是空链表，那么将 `head` 和 `tail` 属性赋值为新元素即可。因为新元素既是表头也是表尾。

如果链表不为空，则说明表头表尾已存在，我们要新元素的 `next` 赋值为表头，再将表头的 `prev` 赋值为新元素，最后再将新元素设置为新的表头即可。

### 末尾添加

末尾添加主要改变的是 `tail` 属性。首先要将表尾的 next 赋值为新元素，然后将新元素的 prev 再指向表尾，最后将新元素赋值为新的表尾。

### 中间位置添加

中间位置添加是指，插入的位置不是第一个，也不是最后一个。这种情况下意味着表头和表尾都不需要动，只要将新元素与前后元素关联即可。

首先，获取索引位置的前一个元素 `previous`；然后再拿到索引位置的元素 `current`，也就是 previous.next。接下来将新元素放到它们两之间。

方法就是逐个设置 prev 和 next 属性。

## 升级 removeAt 方法

removeAt 方法与上面的 insert 方法改造原则一致，功能不变，只需要将删除对象前后的元素对应的 prev 和 next 属性修改，并且涉及到表尾时修改 `tail` 属性即可。

```js
removeAt(index) {
  if (index >= 0 && index < this.count) {
    let current = this.head;
    if (index === 0) {
      // 1. 首位删除逻辑
      if (!current) {
        return undefined;
      }
      this.head = current.next;
      if (this.count === 1) {
        this.tail = undefined;
      } else {
        this.head.prev = undefined;
      }
      this.head = current.next;
    } else if (index === this.count) {
      // 2. 末尾删除逻辑
      current = this.tail;
      this.tail = current.prev;
      this.tail.next = undefined;
    } else {
      // 3. 中间位置删除逻辑
      current = this.getItemAt(index);
      let previous = current.prev;
      previous.next = current.next;
      current.next.prev = previous;
    }
    this.count--;
    return current.value;
  }
  return undefined;
}
```

代码中注释的部分就是要改造的部分，具体如下。

### 首位删除

首位删除就是删除第一个元素，这个时候要分情况。

如果是空链表，删除没有意义，直接返回 undefined；如果只有一个元素，删除后会变成空链表，所以要把 `head` 和 `tail` 属性全都置为 undefined。如果链表长度大于 1，则只需要将表头向后挪动一位，并且将远离啊的 prev 置为 undefined 即可。

### 末尾删除

这个比较简单，主要改变的是 `tail` 属性。

将表尾设置为当前元素 `current`，然后将表尾向前挪动一位，并且将新表尾的 prev 设置为 undefined 即可。

### 中间位置删除

中间位置删除不需要考虑表头表尾的情况。直接通过类方法 `getItemAt` 获取索引位置的元素，再通过 `current.prev` 获取到前一个元素。

此时改变前一个元素的 next 属性和后一个元素的 prev 属性，将当前索引位置的元素绕过即可。

## 使用双向链表

上面写的两个方法，我们来实验一下：

```js
var doublinked = new DoubLinkedList();
doublinked.insert('北京', 0);
doublinked.insert('上海', 1);
doublinked.insert('成都', 2);
console.log(doublinked.toString()); // 北京,上海,成都
```

这样看是可以的，然后获取中间的元素：

```js
let node = doublinked.getItemAt(1);
console.log(node.value); // 上海
console.log(node.prev.value); // 北京
console.log(node.next.value); // 成都
```

测试结果正确，大功告成！

## 总结

本篇介绍了双向链表的概念，然后使用了 class 继承，在链表类的基础上实现了双向链表的 `insert` 和 `removeAt` 两个方法。

虽然只写了两个方法，不过其他方法与这两个方法的改造方式都一样，只是对链表操作 `tail` 和链表元素操作 `prev`，别无差别。

本文来源公众号：**程序员成功**。这是学习 JavaScript 数据结构与算法的第 11 篇，本系列会连续更新一个月。

欢迎关注公众号，点击“**加群**”一起加入我们的学习队伍～
