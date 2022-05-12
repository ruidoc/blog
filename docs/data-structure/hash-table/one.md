---
group:
  title: 散列表篇
  path: /hash-table
  order: 7
order: 1
---

# 实现散列表

大家好，我是杨成功。

上一篇我们一篇搞定了字典，这篇呢我们学习一个与字典非常相似的数据结构 —— 散列表。散列表与字典基本一致，区别是字典存储的 key 是字符串，而散列表是一个数值（哈希值）。

到底如何理解散列表呢？下面进入正题。

## 什么是散列表

散列表，也叫做哈希表，可以根据键（Key）直接访问数据在内存中存储的位置。

简单来说，散列表就是字典的另一种实现，它的优势是比字典能更快地找到一个值。在常规的字典操作中，使用`get()`方法获得一个值，需要遍历整个数据结构，这样明显会比较慢。

散列表为了让查找提速，使用了一个叫**散列函数**的方法，将 key 转换成一个由 Unicode 码组合而成的数值，这个数值被称为**散列值**。

最终在**散列表**中存储数据的结构是：散列值为 key，数据值为 value。这样查找数据时，就可以通过散列值直接定位位置，就好比数组下标一样直接定位元素，免去了整个数据结构的遍历，因此比字典的字符串定位要快上许多。

上述的概念如果比较难理解，看一张图你就明白了：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a143ca7ba48f43b4bded864aafe551ad~tplv-k3u1fbpfcp-watermark.image?)

散列表还可以用来做数据库的索引。在关系型数据库如 MySQL 中，当你新建一张表并创建好了字段，你还可以为某些字段设置索引。设置索引是在散列表中存储了索引值和对应记录的引用，以便快速的找到数据。

当然了散列表还有其他应用，比如我们 JavaScript 当中的对象，那就是一个妥妥的散列表。

## 创建散列表

和字典类 Dictionary 一样，用一个对象来存储所有键值对。

```js
class HashMap {
  constructor() {
    this.table = {};
  }
}
```

然后给类添加方法，主要是这三个：

- `put`：向散列表增加/更新一个项
- `remove`：根据键名移除键值
- `get`：根据键名获取键值

当然还需要和上一篇一样的转换字符串函数：

```js
function keyToString(item) {
  if (item === null) {
    return 'NULL';
  }
  if (item === undefined) {
    return 'UNDEFINED';
  }
  if (item instanceof String) {
    return `${item}`;
  }
  return item.toString();
}
```

### 创建散列函数

散列函数就是开头说到的，将字符串转换为散列值的函数。

```js
hashCode(key) {
  if(typeof key === 'number') {
    return key;
  }
  let tableKey = keyToString(key)
  let hash = 0;
  for(let i = 0; i < tableKey.length; i++) {
    hash += tableKey.charCodeAt(i)
  }
  return Math.ceil(hash / 20);
}
```

上述代码中，`hashCode` 接受一个 key 值，首先判断参数 key 是否是一个数值，如果是则直接返回。否则的话将 key 值转换为字符串。

结下来的逻辑是，定义一个 `hash` 变量为 0，然后循环字符串的长度。在循环体内通过 `charCodeAt` 方法获取每个字母对应的 `Unicode 编码`，并将结果累加。

最后一行，返回 `Math.ceil(hash / 20)` 的值，这是什么意思呢？

其实作用非常简单，就是为了避免 hash 值过大，然后才将它除以一个数值然后取整。这里用的 20，你也可以根据你的是实际情况决定数值范围，改用其他数值。

### put 方法

现在我们有了自己的 hashCode 函数，下面来实现 put 方法。

```js
put(key, value) {
  if(key !== null && value !== null) {
    let pos = this.hashCode(key)
    this.table[pos] = new ValuePair(key, value)
    return true;
  }
  return false;
}
```

put 方法与字典的 set 方法几乎一样，区别只是 table 的属性从 `key` 变成了 `hash`。这也是散列表与字典的不同之处，只需要确保 hash 唯一即可。

> ValuePair 是上篇介绍的类，用来存储键值对。

### get 方法

从散列表中获取一个值也很简单。

```js
get(key) {
  let valuePair = this.table[this.hashCode(key)]
  return valuePair ? valuePair.value : undefined;
}
```

首先通过前面创建的 `hashCode` 方法获取到 key 的 hash 值，然后在 table 中获取这个 hash 有没有匹配的 value。如果有则返回 value，无则返回 undefined。

### delete 方法

最后一个方法是从散列表中删除一个项：

```js
remove(key) {
  let hash = this.hashCode(key)
  if(this.table[hash]) {
    delete this.table[hash]
    return true;
  }
  return false;
}
```

以上就是散列表的全部实现，下面我们来使用。

## 使用散列表

首先添加几个键值对：

```js
var hashmap = new HashMap();
hashmap.put('name', '捷德');
hashmap.put('color', '红黑');
hashmap.put('father', '贝利亚');

console.log('name：', hashmap.hashCode('name')); // name：21
console.log('father：', hashmap.hashCode('father')); // father：32
```

我们用 hashCode 方法获取了 key 的 hash 值，是两个两位数的数字。

接着我们根据 key 获取 value：

```js
console.log(hashmap.get('name')); // 捷德
console.log(hashmap.get('color')); // 红黑
console.log(hashmap.get('size')); // undefined
```

然后再删除一个 key：

```js
console.log(hashmap.remove('color')); // true
console.log(hashmap.remove('size')); // false
console.log(hashmap.get('color')); // undefined
```

你看这三个方法在使用的过程中，和字典的效果几乎一致。我们在类内部实现的 hash 值，在使用类方法的时候是无感知的，只是内部数据存储的结构不同。

## 总结

本篇介绍了很常用的散列表数据结构，你学会了吗？散列表与字典很相似，了解他们的区别非常关键。

不过本篇实现的散列表还有一个异常情况，就是生成的散列值可能重复，这样就会出现覆盖的情况。下一篇，我们介绍如何处理散列值的冲突。

本文来源公众号：[**程序员成功**](https://www.ruims.top/static/wxpub.png)。这是学习 JavaScript 数据结构与算法的第 17 篇，本系列会连续更新一个月。

欢迎关注公众号，点击“**加群**”一起加入我们的学习队伍～
