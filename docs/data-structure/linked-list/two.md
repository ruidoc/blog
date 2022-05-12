---
order: 2
---

# 完善链表

大家好，我是杨成功。

上一篇我们介绍了链表的概念，然后动手实现了 `push`  和  `removeAt`  两个方法。这两个方法虽然只是基础的功能，但是实现思路非常关键。因为理解了这两个方法的原理，才能理解链表是如何实现“有序集合”的。

如果你还感觉有一点晕，请先读上一篇：[怒肝 JavaScript 数据结构 — 链表篇(一)](https://juejin.cn/post/7085374698971742221)

上篇已实现的代码如下：

```js
class Node {
  constructor(value) {
    this.value = value;
    this.next = undefined;
  }
}

class LinkedList {
  constructor() {
    this.count = 0;
    this.head = undefined;
  }
  push(item) {
    // 向末尾添加元素
  }
  removeAt(index) {
    // 移除指定位置的元素
  }
}
```

下面我们接着这部分，继续完善链表功能。

## 完善链表方法

链表中还需要实现的方法如下：

- `getItemAt`：获取链表特定位置的元素
- `insert`：向链表特定位置插入一个元素
- `indexOf`：返回元素在链表中的索引
- `remove`：从链表移除一个元素
- `isEmpty`：判断链表是否为空
- `size`：判断链表的长度
- `toString`：返回链表所有元素的字符串

### getItemAt 方法

getItemAt 方法是获取链表中某个索引下的元素。它有一个参数 `index` 表示索引。

其中  `index`  的值是一个数值，但是取值范围必须大于等于零，且小于等于链表的长度，这样索引才能是链表之内有效的索引。

其实这个方法还比较简单，只要循环遍历直到找到目标元素即可。

```js
getItemAt(index) {
  if(index >= 0 && index <= this.count) {
    let current = this.head
    for(let i = 0; i < index; i++) {
      current = current.next
    }
    return current
  }
  return undefined;
}
```

如果找不到元素，直接返回 undefined。

### insert 方法

insert 方法的作用是在链表的任意一个位置插入元素。它有两个参数，第一个参数 `item` 表示要插入的元素，第二个参数 `index` 表示元素插入的位置。

这里的 `index` 和上面的 getItemAt 方法中的 index 是一样的，判断逻辑也一致，要确保索引参数在有效的范围之内。

实现代码如下：

```js
insert(item, index) {
  if(index >= 0 && index <= this.count) {
    let node = new Node(item)
    let current = this.head;
    if(index == 0) {
      node.next = current
      this.head = node
    } else {
      let previous = this.getItemAt(index - 1)
      current = previous.next
      node.next = current
      previous.next = node
    }
    this.count++;
    return true;
  }
  return false;
}
```

代码中，发现和上一篇的 `removeAt` 方法有一个共同点，就是先要判断 index 是否为 0，然后再分情况处理。

如果为零，则只需要新建一个元素，将新元素的 next 指向原来的表头，然后再将 `head` 属性赋值为新元素即可。

如果大于零，则需要获取当前元素 `current` 和前一个元素 `previous`。前一个元素直接用上面写的 getItemAt 方法获取即可。

接着将新元素的 next 指向索引位置的元素，再将前一个元素的 next 属性指向新元素，这样就在两个元素 previous 和 current 之间链接了新元素。

最后，再将表示链表长度的 count 属性自增一。

### indexOf 方法

indexOf 方法与数组的同名方法作用是一样的，参数是一个元素，然后在链表中寻找这个元素的位置，找到就返回索引，找不到返回 **-1**。

这里有一个关键点：元素参数要与链表中的参数做对比，判断是否相等。如果元素是基本类型，那直接判断等于即可。如果元素是引用类型，则不同数据的判断方式不同，就要自定义判断的方法了。

所以我们要修改下 **linkedList** 类，添加一个自定义方法，接受类初始化时的传参：

```js
class LinkedList {
  constructor(equalFn) {
    let defFn = (value, next) => value === next;
    this.equalFn = equalFn || defFn;
  }
}
```

这里的参数 `equalFn` 就是一个自定义的对比元素的函数。

有了 `equalFn` 属性，indexOf 方法就好实现了：

```js
indexOf(item) {
  let current = this.head;
  for(let i = 0; i < this.count; i++) {
    if(this.equalFn(item, current.value)) {
      return i;
    }
    current = current.next;
  }
  return -1;
}
```

循环便利，用自定义的方法判断两个元素是否相等，相等则终止循环返回索引。

### remove 方法

remove 方法的作用是删除一个元素，参数直接是这个元素，需要我们在链表中找到并删除。

有了上面的 indexOf 方法，remove 方法实现起来就更简单了：

```js
remove(item) {
  let index = this.indexOf(item);
  return this.removeAt(index)
}
```

### isEmpty, size 方法

这几个方法更简单：

```js
isEmpty() {
  return this.count == 0
}
size() {
  return this.count;
}
```

### toString 方法

toString 方法与数组的同名方法一样，将所有元素放进一个字符串然后用逗号分隔。

下面是代码实现：

```js
toString() {
  if (!this.head) {
    return "";
  }
  let string = this.head.value;
  let current = this.head.next;
  for (let i = 1; i < this.count && current; i++) {
    string += `,${current.value}`;
    current = current.next;
  }
  return string;
}
```

其实逻辑也是循环链表的长度，然后拼接字符串即可。

## 使用链表

首先实例化，添加两个元素：

```js
let linked = new LinkedList();
linked.push('北京');
linked.push('上海');
console.log(linked.toString()); // 北京,上海
```

然后在索引 `1` 的位置插入深圳：

```js
linked.insert('深圳', 1);
console.log(linked.toString()); // 北京,深圳,上海
```

再查看元素的索引：

```js
console.log(linked.indexOf('上海')); // 2
console.log(linked.indexOf('武汉')); // -1
```

最后移除元素：

```js
linked.remove('深圳');
console.log(linked.toString()); // 北京,上海
```

结果完美，大功告成！

## 总结

看完本篇，基础链表的相关内容就结束了。其实学完链表以后，我们以前遇到的数组的性能问题，链表就是一个非常好的替代方案。

建议大家文中贴的代码一定手敲一遍，掌握精髓。

本文来源公众号：**程序员成功**。这是学习 JavaScript 数据结构与算法的第 10 篇，本系列会连续更新一个月。

欢迎关注公众号，点击“**加群**”一起加入我们的学习队伍～
