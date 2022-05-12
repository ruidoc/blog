---
order: 5
---

# 有序链表

大家好，我是杨成功。

上一篇我们介绍了循环链表，这篇是链表的最后一篇，介绍最后一种链表类型 —— 有序链表。

**有序链表** 是指元素按照排序规则有序排列的链表结构。虽然大多数排序是用算法对已有数据排序，其实我们还可以在元素插入链表时，就保证插入位置是符合排序规则的。

下面我们看如何实现。

## 实现有序链表

首先声明一个 `SortedLinkedList` 类：

```js
class SortedLinkedList extends LinkedList {
  constructor(compareFn, equalFn) {
    let defFn = (a, b) => (a !== b ? (a > b ? 1 : -1) : 0);
    super(equalFn);
    this.compareFn = compareFn || defFn;
  }
}
```

这个类继承自 `LinkedList`，它有链表相关的所有属性和方法。不同的是这个类需要通过比较元素来排序，所以还需要声明一个用于比较的函数 `compareFn`。

当然 **compareFn** 是允许自定义的，因为可能不同的数据比较规则不同。同时我们可以提供一个简单类型的比较作为默认函数，如果没有传递自定义函数，则用默认函数比较。

默认的比较规则是：

- `a == b`：返回 0
- `a > b`：返回 1
- `a < b`：返回 -1

基本类实现了，接下来看怎么插入元素：

## 有序插入元素

链表的插入元素，是指在固定索引位置插入一个新元素即可。但是有序插入，要求插入的新元素符合排序的规则。

具体怎么做呢？就是在获取新元素之后，要通过遍历链表将每个元素与新元素两两对比，根据比较结果来决定两个元素的位置是否要互换。这样一级一级比下去，直到找到最终的位置。

因此在写插入方法之前，先写一个获取索引函数，查询一下新元素在哪个位置插入满足排序规则。

```js
getSortedItemIndex(item) {
  let current = this.head;
  let i;
  for(i = 0; i < this.size() && current; i++) {
    if(this.compareFn(item, current.value) < 0) {
      break;
    }
    current = current.next
  }
  return i
}
```

这个函数里设置的规则是 `this.compareFn(item, current.value) < 0`。也就是说，当新元素比链表元素小的时候，会终止循环，然后返回索引。

如果在这个索引处插入新元素，则新元素永远要比链表内的某个元素小，否则就是最后一个元素。这样保证了链表最终是正序排列。

我们来试一下，还是在链表 `insert` 方法的基础上改造：

```js
insert(item) {
  if(this.isEmpty()) {
    return super.insert(item, 0)
  }
  let pos = this.getSortedItemIndex(item)
  return super.insert(item, pos)
}
```

很明显有序插入的 insert 函数不需要传递第二个 `index` 参数，因为插入位置是计算出来的，不用显式传递。

## 使用有序链表

上面写的代码来试一下：

```js
// 测试
var inst = new SortedLinkedList();
inst.insert(3);
inst.insert(8);
inst.insert(4);
inst.insert(6);
console.log(inst.toString());
```

最终的打印结果是：`3,4,6,8`，已经按照从大到小排序了，满足要求！

那我们再自定义一个比较函数，比如我要按照汉字的拼音首字母正序，函数如下：

```js
const compareFn = (a, b) => a.localeCompare(b);
```

然后再用这个比较函数实例化：

```js
var inst = new SortedLinkedList(compareFn);
inst.insert('上海');
inst.insert('南京');
inst.insert('北京');
inst.insert('广州');
console.log(inst.toString());
```

打印结果：`北京,广州,南京,上海`，满足要求！

## 总结

本篇我们学习了有序链表，有序链表其实就是排过序的链表。有序链表主要的逻辑在添加上，添加元素会自动排序，其他逻辑与链表基本功能一致。

链表的介绍就结束了，下一篇我们学习集合。

本文来源公众号：[**程序员成功**](https://www.ruims.top/static/wxpub.png)。这是学习 JavaScript 数据结构与算法的第 13 篇，本系列会连续更新一个月。

欢迎关注公众号，点击“**加群**”一起加入我们的学习队伍～
