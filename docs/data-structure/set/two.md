---
order: 2
---

# 集合运算

大家好，我是杨成功。

上一篇我们介绍了什么是集合，并且手动实现了一个集合的类。简单总结，集合就是一组元素唯一，并且没有顺序的数据集，关键是元素唯一。

ES6 提供了原生的集合支持，就是新增的 **Set** 数据类型。其实在上篇我们几乎已经实现了 **Set** 的所有功能，如果还不了解集合，请看上篇：[怒肝 JavaScript 数据结构 — 集合篇(一)](https://juejin.cn/post/7087231173553815583)

但是我们也说到，**Set** 的基本功能中不包含数学运算如 **交集，并集，差集**，事实上这也是集合的一部分。本篇我们就要介绍这类集合的运算。

## 集合运算

集合在计算机世界中主要的应用之一就是**数据库**。比如在一个关系型数据库当中，我们常用的查询，基本都是对一个或多个数据集合进行筛选，合并，过滤等运算。

比如你写一条 SQL 语句，它可能是要获取表中的所有数据，也可能是根据条件获取一部分数据，还有可能是关联查询，要一次性获取多个表的数据。

根据不同的需求来决定集合如何处理，这在 SQL 中叫做`联接`。SQL 联接的基础就是集合运算。

我们对集合的元算包含如下几个：

- `并集`：给定两个集合，返回包含两个集合中所有元素的新集合
- `交集`：给定两个集合，返回包含共有元素的新集合
- `差集`：给定两个集合，返回第一个集合有，第二个集合没有的元素的新集合
- `子集`：验证一个集合是否是另一个集合的子集（一部分）

我们看相应的如何实现。

### 并集

并集说白了就是包含两个集合的所有元素但是不重复的集合。

其实也很好理解，我们在 Set 类的基础上实现一个 `union` 方法。

```js
union(otherSet) {
  let unionSet = new Set()
  this.values().forEach(value=> unionSet.add(value))
  otherSet.values().forEach(value=> unionSet.add(value))
  return unionSet;
}
```

如上的实现方式，首先实例化一个新集合，然后分别将两个集合的全部元素加入到新集合。因为集合在添加元素时会做重复校验，所以全部添加后新集合包含了所有元素，且不重复。

### 交集

交集就是两个集合共有的元素组成的一个新集合，这个集合肯定是两个集合的子集。

我们来实现 `intersection` 方法：

```js
intersection(otherSet) {
  let inters = new Set()
  let values = this.values()
  for(let i = 0; i < values.length; i++) {
    if(otherSet.has(values[i])) {
      inters.add(values[i])
    }
  }
  return inters;
}
```

这个实现方式和并集一样，首先定义新的集合。只不过是在一个集合元素的遍历中，判断元素是否在另一个集合中，如果在则添加到新集合，这样新集合就是一个交集。

**改进交集**

功能实现了，我们再看另外一种情况。假设两个集合如下：

- 集合 A：[1, 2, 3, 4, 5, 6, 7]
- 集合 B：[4, 7]

如果按照上面的方式，我们需要循环七次，才能得到交集。那有没有办法选择长度更小的集合循环，并实现功能呢？

有啊，假设遍历集合 B，只需要循环两次。我们看如何改进：

```js
intersection(otherSet) {
  let inters = new Set();
  let bigvals = this.values()
  let lessvals = otherSet.values();
  if(bigvals.length < lessvals.length) {
    bigvals = otherSet.values();
    lessvals =  this.values()
  }
  for(let i = 0; i < lessvals.length; i++) {
    if(bigvals.includes(lessvals[i])) {
      inters.add(lessvals[i])
    }
  }
  return inters;
}
```

这种方式是先判断哪个集合的长度更短，然后遍历更短的那个集合，再判断元素是否在另一个集合里，这样就避免了多余的循环。

### 差集

差集是指元素存在于集合 A 中，但不存在于集合 B 中，也就是计算 `A - B` 的部分。

我们来实现 Set 类的 `different` 方法：

```js
different(otherSet) {
  let diffSet = new Set();
  this.values().forEach(value=> {
    if(!otherSet.has(value)) {
      diffSet.add(value)
    }
  })
  return diffSet;
}
```

从代码中能看出来，差集与交集的实现逻辑正好相反。

### 子集

在数学概念中，如果集合 A 包含于集合 B，也就是说集合 A 中所有的元素集合 B 中都存在，那我们认为集合 A 是集合 B 的子集。

从程序的角度来看，集合 A 是从集合 B 中过滤出来的一部分，那么集合 A 就是一个子集。

我们来实现子集的 `isSubsetOf` 方法：

```js
isSubsetOf(otherSet) {
  let isSubset = true
  let values = otherSet.values()
  for(let i = 0; i < values.length; i++) {
    if(!this.has(values[i])) {
      isSubset = false; break;
    }
  }
  return isSubset;
}
```

这个方法是检测参数集合中，是否每个元素都在实例集合中存在。如果有一个不存在，则表示参数集合不是子集，终止循环并返回结果。

其实还有更简单的方法：

```js
isSubsetOf(otherSet) {
  return otherSet.values().every(value=> this.has(value))
}
```

`every` 方法可以判断是否每个元素是否都符合条件。如果符合就返回 `true`，否则返回 `false`。

## 使用集合运算

上面完成了集合基本运算的实现，现在我们来使用一下吧：

```js
let setA = new Set();
setA.add('北京');
setA.add('上海');
setA.add('广州');

let setB = new Set();
setB.add('北京');
setB.add('南京');
setB.add('武汉');
```

首先添加了两个集合，然后用它们来测试基本元算：

```js
let sets = setA.union(setB);
console.log(sets.values()); // ['北京', '上海', '广州', '南京', '武汉']

let inters = setA.intersection(setB);
console.log(inters.values()); // ['北京']

let diffs = setA.different(setB);
console.log(diffs.values()); // ['上海', '广州']
```

最后再测试一下子集：

```js
let issub = setA.isSubsetOf(setB);
console.log(issub); // false

let setC = new Set();
setC.add('上海');
issub = setA.isSubsetOf(setC);
console.log(issub); // true
```

测试通过，完美实现！

## 总结

通过两篇文章介绍了集合的相关知识，你学会了吗？虽然 ES6 提供了原生支持，但是对于我们学习者来说，手动实现一次更有助于了解原理。

下一篇，我们介绍新的数据结构 —— 字典。

本文来源公众号：[**程序员成功**](https://www.ruims.top/static/wxpub.png)。这是学习 JavaScript 数据结构与算法的第 15 篇，本系列会连续更新一个月，欢迎关注公众号，点击“**加群**”一起加入我们的学习队伍～
