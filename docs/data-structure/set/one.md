---
group:
  title: 集合篇
  path: /set
  order: 5
order: 1
---

# 认识集合

大家好，我是杨成功。

上一篇的链表已经更完了，今天我们来学习一个新的数据结构 —— 集合。

**集合**这个词应该比较耳熟，大多数人没接触代码前就学过了。回想一下你的高一数学课本上是不是出现过这个词，就在第一章，概念如下：

> 一般地，我们把研究的对象统称为元素，把一些元素组成的总体叫作集合。

你看，**集合**，**元素**，是不是与今天我们学习的数据结构相通呢？

今天，我们就从程序的角度，再来认识这个学生时代的老朋友。

## 什么是集合

集合是由一组无序且唯一（不能重复）的元素组成。数据结构中的集合，对应的是数学概念当中的**有限集合**。

在数学中，比如要展示一个城市集合，我们是这么写的：

```
N = {北京, 上海, 深圳, 广州}
```

那对应到 JavaScript 当中，就是一个简单的数组了：

```js
var cities = ['北京', '上海', '深圳', '广州'];
```

数学中还有一个 **空集** 的概念，用 `{}` 表示，也就是 JavaScript 中的空数组 `[]`。

集合的不同之处在于，我们前面学习的栈，队列，链表，都是**有序集合**。而集合是比较少见的**无序集合**的数据结构。

因为集合是唯一且无序的，所以我们不能像有序的数据结构一样，用下标来定位元素。无序集合的唯一标识就是元素本身的值。

JavaScript 在 ES6 中也提供了对标集合的数据类型 [Set](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set)。Set 允许存储唯一的任意类型的值，其实就是集合的实现。

在数学中，集合也有**交集，并集，差集**等基本运算，本篇我们也会实现。

下面我们参照 ES6 Set 的语法，自己动手实现一个 Set。

## 创建集合类

我们依然用 class 语法来创建基本结构：

```js
class Set {
  constructor() {
    this.items = {};
  }
}
```

与栈，队列的原则一致，用一个对象来存储集合的元素最为合适。再者因为元素的唯一性，对于基本类型元素，我们可以直接以元素的值作为对象 Key 值，而不是 `0,1,2...`。

下面就是我们需要声明的方法：

- `add`：向集合添加新元素
- `delete`：从集合中删除一个元素
- `has`：检测元素是否在集合中
- `clear`：清空集合
- `size`：返回集合的长度
- `values`：返回包含集合中所有元素的数组

### has 方法

首先实现 has 方法，因为它会被 **add，delete** 等方法调用。

这个方法用来检测某一个元素是否在集合中，存在则返回 `true`，否则返回 `false`。

```js
has(item) {
  return item in this.items;
}
```

我们在开头部分说了，直接用元素本身的值作为对象的 key，因此可以直接用 JavaScript ES6 提供的 `in` 运算符来检测属性是否在对象当中。

还有一种传统的方式如下，与上面效果一致：

```js
has(item) {
  return Object.prototype.hasOwnProperty.call(this.items, item);
}
```

### add 方法

有了 has 方法，add 方法的实现就比较简单：

```js
add(item) {
  if(this.has(item)) {
    return false;
  }
  this.items[item] = item
  return true
}
```

因为要保持元素唯一性，所以在添加元素前先判断当前元素是否在，存在则不添加，不存在才添加。

### delete 和 clear 方法

这两个方法都是删除元素，前者删除一个元素，后者删除所有元素。

```js
// 删除
delete(item) {
  if(this.has(item)) {
    delete this.items[item]
    return true
  }
  return false
}
// 清空
clear(item) {
  this.item = {}
}
```

删除也比较简单，删除或清空对象对属性即可。

### size 方法

size 方法对作用就是返回集合的长度（有多少个元素），实现这个方法有多种方式。

**方式一**：和之前的栈，队列，链表的实现方式一样，用一个属性 `count` 来表示长度，在添加和删除的时候更新这个属性的值。

**方式二**：直接使用 ES6 的 `Object.keys` 方法来获取属性的数组，获取数组的长度：

```js
size() {
  return Object.keys(this.items).length
}
```

还是第二种方法简单，就选这个。

### values 方法

和上面的 size 方法一样，也可以直接获取对象属性值的数组：

```js
values() {
  return Object.values(this.items)
}
```

## 使用集合

上面我们手动实现了集合类，这里来使用一下：

```js
var set = new Set();
set.add('北京');
set.add('北京');
set.add('上海');
set.add('上海');
// 打印结果
console.log(set.size()); // 2
console.log(set.values()); // ['北京','上海']
```

添加的检测没问题，再看删除：

```js
console.log(set.has('上海')); // true
console.log(set.has('成都')); // false
set.delete('上海');
console.log(set.values());
['北京'];
console.log(set.has('上海')); // false
```

删除也没问题，完美实现！

## 总结

本篇我们手动实现了集合的基本功能，下一节我们在此基础上，实现集合的基本运算。

本文来源公众号：[**程序员成功**](https://www.ruims.top/static/wxpub.png)。这是学习 JavaScript 数据结构与算法的第 14 篇，本系列会连续更新一个月。

欢迎关注公众号，点击“**加群**”一起加入我们的学习队伍～
