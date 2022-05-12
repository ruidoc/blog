---
order: 3
---

# 线性探查法

大家好，我是杨成功。

前两篇我们分别介绍了什么是散列表，如何动手实现一个散列表，并且用“分离链接法”解决了散列表中散列值冲突的问题。这一篇我们介绍另一个方案：**线性探查法**。

如果你还不清楚散列表，请先阅读前两篇：

- [怒肝 JavaScript 数据结构 — 散列表篇(一)](https://juejin.cn/post/7088713508560306206)
- [怒肝 JavaScript 数据结构 — 散列表篇(二)](https://juejin.cn/post/7089073729308901389)

线性探查法比分离链接法更优雅一些，也不会额外占用内存。

## 线性探查法

在计算机世界中，某个值的**放缩或叠加**被称为线性。顾名思义，线性探查法是指当散列值重复的时候，试着将散列值叠加，直到其变成唯一的值。

比如你得到一个 `hash` 值，你想以这个值为 key 向散列表中添加新元素。如果这个 key 在散列表中已存在，那么你可以尝试 `hash + 1`；如果依然存在，继续尝试 `hash + 2`，直到这个值变成唯一的 key 再进行添加。

如下图，索引值（key）与散列值（hash）的关系如下：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ac4b864ada8d44548188d47d0bb82166~tplv-k3u1fbpfcp-watermark.image?)

理论就是这样，具体到实现方式，有两种：

- 软删除
- 移动元素

软删除并不是真的删除，只是将 key 对应的 value 标记为已删除，这样的好处是重要数据被保存了下来，为后期使用或恢复提供了可能。坏处么也显而易见，散列表中会堆积越来越多的 key 值，数量庞大时查询效率就会变低。

移动元素的方法会直接删除某个键值对，但是这样会造成 hash 值断开，产生空位置。那么就要再下一次添加的时候，将新的键值对填充到这个空位置。

我们这里只介绍第二种 `移动元素` 方案的实现代码。

首先是创建基本的类结构，继承  `HashMap`  类：

```js
class HashTableLinearProbing extends HashMap {
  constructor() {
    super();
    this.table = {};
  }
}
```

依然是重写三个方法。

### put 方法

put 方法用来添加元素，重写如下：

```js
put(key, value) {
  if(key && value) {
    let pos = this.hashCode(key);
    while(this.table[pos]) {
      pos++;
    }
    this.table[pos] = new ValuePair(key, value);
    return true;
  }
  return undefined;
}
```

这个代码里检测 hash 值是否已经是对象的 key 值，并将其作为循环条件。如果 key 已存在则自增一，直到 hash 值变成对象唯一的 key，我们再创建键值对。

这样一来，我们相当于“跳过”了已存在的 key，添加元素时就避免了覆盖已有的值。

### get 方法

上一个方法插入了元素，那么接下来用 get 方法获取它吧。

```js
get(key) {
  let pos = this.hashCode(key);
  if(this.table[pos]) {
    if(this.table[pos].key === key) {
      return this.table[pos].value
    }
    let index = pos + 1;
    while(this.table[index] && this.table[index].key !== key) {
      index++;
    }
    if(this.table[index] && this.table[index].key === key) {
      return this.table[index].value
    }
  }
  return undefined;
}
```

这个方法中，首先获取 key 的 hash 值，然后检测对象中是否存在这个属性，不存在直接返回 undefined。

如果存在的话，就会匹配到一个键值对，此时还要分**两种情况**。

如果键值对的 key 和参数 key 的值一样，那就说明找准了，直接返回键值对的 value 即可。

如果不一样，那就说名参数 key 对应的这条数据在创建时遇到了 hash 重复的情况，将 hash 进行了自增后才创建的数据，所以我们匹配到的数据不准确。

那怎么办呢？自然也是将解析到的 hash 自增，逐渐向后查找数据，直到找到两个 key 相匹配的那个键值对，这就是我们要找的数据。

> 注意：在 hash 递增时，必须确保每次的新索引在散列表中都有匹配的数据，否则会终止循环，直接返回 undefined

### remove 方法

remove 方法与 get 方法基本相同，核心都是找到某个元素。只不过 get 方法找到之后会返回，remove 方法则会删除。

```js
remove(key) {
  let pos = this.hashCode(key);
  if(this.table[pos]) {
    if(this.table[pos].key === key) {
      delete this.table[pos]
      this.verifyRemoveSideEffect(key, pos)
      return true
    }
    let index = pos + 1;
    while(this.table[index] && this.table[index].key !== key) {
      index++;
    }
    if(this.table[index] && this.table[index].key === key) {
      delete this.table[index]
      this.verifyRemoveSideEffect(key, index)
      return true
    }
  }
  return false;
}
```

上述代码中有一处需要特别说明，就是在删除完成之后，调用一个 `verifyRemoveSideEffect` 方法，这是为什么呢？

我们在上面写过一个注意事项，在索引递增时必须确保新索引在散列表中有对应的数据，否则影响 key 的查询。

这就要求在删除元素之后，如果在这个位置的后面有另一个元素 **小于等于** 被删元素的 hash 值，我们得把这个元素移动到被删除的位置，避免出现空位。

为什么？因为在被删位置之后，小于等于被删元素 hash 的其他元素在被检索时，会将 hash 值不断递增，因此必然会经过被删除的位置，此时该位置是一个空位，因为被删了嘛，所以检索会返回 undefined，事实上那个元素是存在的，只不过查询时被空位截断了。

所以我们要通过这个函数在必要时移动元素的位置：

```js
verifyRemoveSideEffect(key, pos) {
  const hash = this.hashCode(key);
  let index = pos + 1; // {2}
  while (this.table[index] != null) { // {3}
    const posHash = this.hashCode(this.table[index].key); // {4}
    if (posHash <= hash || posHash <= pos) { // {5}
      this.table[pos] = this.table[index]; // {6}
      delete this.table[index];
      pos = index;
    }
    index++;
  }
}
```

`verifyRemoveSideEffect` 方法接收两个参数：被删除元素的 key 和被删除的位置 pos。

首先，因为 key 对应的位置已经被删除了，所以在我们在 **{2}** 处将 pos 加一，用于获取被删位置的下一个位置的索引。

接下来判断 index 处是否有元素。如果有，则获取这个元素的 hash 值 `posHash`，如果 posHash 小于等于被删元素的 hash，或者小于等于被删位置（递增后的 hash），则进行位置移动，即填充新位置，删除旧位置。

将这个过程循环，使被删元素之后满足条件的元素全部前移一位，就解决了空位的问题。

## 使用线性探查

上面重写了三个方法后，我们来使用这个 `HashTableLinearProbing` 类：

```js
var hashtable = new HashTableLinearProbing();
hashtable.put('name', '杨成功');
hashtable.put('mane', '成功杨');
console.log(hashtable.table);
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78e8caec2edb4ce39fdbcd796dca6a64~tplv-k3u1fbpfcp-watermark.image?)

你看，`name` 和 `mane` 这两个字符串的 hash 都是 **21**，冲突时后面的自然递增。

数据存储没有问题，我们再看数据获取结果如何：

```js
hashtable.get('name');
hashtable.get('mane');
hashtable.get('sex');
```

结果如下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/15c067513b094518bc6720f6072c8724~tplv-k3u1fbpfcp-watermark.image?)

不错，也没问题。最后一步我们删除 `name` 这条数据，看对结构和查询有什么影响：

```js
hashtable.remove('name');
console.log(hashtable.table);
hashtable.get('mane');
```

结果如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb122c8cbe2a47aea2b37ad6526b3346~tplv-k3u1fbpfcp-watermark.image?)

看结果，删除 name 之后，`mane` 这条数据的 key 从 22 变成了 21，说明已经移动到了被删除的位置。最后一步查询也正常，说明删除逻辑没问题。

## 总结

本篇介绍了如何用**线性探查法**解决 hash 冲突的问题，并附上了实现代码。经过三篇的反复学习，相信你对散列表已经娴熟于心了。

下一篇，我们介绍一个运算基础 —— 递归。

本文来源公众号：**程序员成功**。这是学习 JavaScript 数据结构与算法的第 19 篇，本系列会连续更新一个月。

欢迎关注公众号，点击“**加群**”一起加入我们的学习队伍～
