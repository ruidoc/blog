---
order: 2
---

# 解决 hash 冲突

大家好，我是杨成功。

上一篇我们介绍了什么是散列表，并且用通俗的语言解析了散列表的存储结构，最后动手实现了一个散列表，相信大家对散列表已经不陌生了。

如果还不清楚散列表，请先阅读上一篇：[怒肝 JavaScript 数据结构 — 散列表篇(一)](https://juejin.cn/post/7088713508560306206)

上篇末尾我们遗留了一个问题，就是将字符串转化为**散列值**后可能出现重复。当以散列值（hash 值）为 key 存储数据时，就会有覆盖已有数据的风险。

本篇我们看如何处理散列值冲突的问题，并实现更完美的散列表。

## 处理散列值冲突

有时候一些键会有相同的散列值。比如 `aab` 和 `baa`，从字符串的角度来说它们是不同的值，但是按照我们的散列函数逻辑，将每个字母的 Unicode 码累加得出的散列值，一定是一样的。

我们知道在 JavaScript 对象当中，如果赋值时指定的 key 已存在，那么就会覆盖原有的值，比如这个例子：

```js
var json = { 18: '雷欧' };
json[18] = '欧布';
console.log(json); // { 18: '欧布' }
```

为了避免上述代码中出现的风险，我们需要想办法处理，如何使 `key != key`，则 `hash != hash`？

目前可靠的方法有两个，分别是：`分离链接` 和 `线性探查`。

## 分离链接

分离链接法是指在散列表存储数据时，value 部分用 `链表` 来代替之前的 `键值对`。键值对只能存储一个，而链表可以存储多个键值对。如果遇到相同的散列值，则在已有的链表中添加一个键值对即可。

具体的实现方法，首先继承 `HashMap` 类，然后重写 put、get 和 remove 方法。基本的类结构如下：

```js
class HashTableSeparateChaining extends HashMap {
  constructor() {
    super();
    this.table = {};
  }
}
```

有了基本结构，首先重写 `put` 方法：

```js
put(key, value) {
  if(key !== null && value !== null) {
    let pos = this.hashCode(key)
    if(!this.table[pos]) {
      this.table[pos] = new LinkedList()
    }
    this.table[pos].push(new ValuePair(key, value))
    return true;
  }
  return false;
}
```

> LinkedList 类是标准的链表类，在链表篇讲过如何实现，这里直接使用

对比上篇的散列表 put 方法，你会发现差别不大，变化的部分如下：

```js
// 变化前
this.table[pos] = new ValuePair(key, value);

// 变化后
if (!this.table[pos]) {
  this.table[pos] = new LinkedList();
}
this.table[pos].push(new ValuePair(key, value));
```

优化后的逻辑是，在存储数据时，将键值对存在一个链表里。如果有相同的 `hash` 值，则向已有的链表中添加一个键值对，这样就避免了覆盖。

不过这种方式也有弊端，每添加一个键值对就要创建一个链表，会增加额外的内存空间。

我们再看 `get` 方法：

```js
get(key) {
  let linkedList = this.table[this.hashCode(key)]
  if(linkedList && !linkedList.isEmpty()) {
    let current = linkedList.getItemAt(0);
    while(current) {
      if(current.value.key === key) {
        return current.value.value
      }
      current = current.next
    }
  }
  return undefined;
}
```

新的 get 方法明显比之前的复杂了许多。主要逻辑是根据 key 找到一个链表，然后再遍历链表找到与参数 key 相匹配的键值对，最后返回找到的值。

> while 循环中使用 return 可以直接中止当前函数

添加和获取实现之后，我们看最后一个用于删除的 `remove` 方法。

remove 方法和之前的差异比较大。之前的删除逻辑是通过 hash 找到数组直接删除即可。而这里的删除是通过 hash 找到了一个链表，删除的是链表当中的某一项，仅有一项时才会删除整个链表。

```js
remove(key) {
  let pos = this.hashCode(key)
  let linkedList = this.table[pos]
  if(linkedList && !linkedList.isEmpty()) {
    let index = 0;
    let current = linkedList.getItemAt(index);
    while(current) {
      if(current.value.key === key) {
        linkedList.removeAt(index)
        if(linkedList.isEmpty()) {
          delete this.table[pos]
        }
        return true;
      }
      current = current.next;
      index++;
    }
  }
  return false;
}
```

其实这个方法和查找元素的方法逻辑相似，在找到链表中的某个键值对之后，将之删除。

## 使用分离链接

上面重写了三个方法后，我们来使用这个 `HashTableSeparateChaining` 类：

```js
var hashtable = new HashTableSeparateChaining();
hashtable.put('name', '杨成功');
hashtable.put('mane', '成功杨');
console.log(hashtable.table);
```

打印结果如下截图：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6cf985e38f194f20a84d3129cb342005~tplv-k3u1fbpfcp-watermark.image?)

由图可知，两个字符传 `name` 和 `mane` 解析成 hash 之后都是 `21`，因此 21 对应链表中保存了两个元素，就是我们添加的 key->value 键值对，显然数据没有被覆盖。

数据存储没有问题，我们再看数据获取结果如何：

```js
console.log(hashtable.get('name')); // 杨成功
console.log(hashtable.get('mane')); // 成功杨
console.log(hashtable.get('sex')); // undefined
```

也没问题，最后看一下删除功能：

```js
console.log(hashtable.remove('name')); // true
console.log(hashtable.remove('name')); // false
console.log(hashtable.table);
```

打印删除后的结果：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c3a2efd2e4a04ac1b2e006c45341bba3~tplv-k3u1fbpfcp-watermark.image?)

经过测试，这个类解决了我们 hash 冲突的问题。

## 总结

本篇介绍了如何用**分离链接法**解决 hash 冲突的问题，并附上了实现代码。下一篇我们介绍第二种方案 —— 线性探查法。

本文来源公众号：[**程序员成功**](https://link.juejin.cn/?target=https%3A%2F%2Fwww.ruims.top%2Fstatic%2Fwxpub.png)。这是学习 JavaScript 数据结构与算法的第 7 篇，本系列会连续更新一个月。

欢迎关注公众号，点击“**加群**”一起加入我们的学习队伍～
