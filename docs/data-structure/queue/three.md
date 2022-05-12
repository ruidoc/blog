---
order: 3
---

# 队列实战

大家好，我是杨成功。

前面两篇我们学习了两个非常相似的数据结构 —— 队列与双端队列。并且我们在代码中实现了两种数据结构的功能。那今天呢，我们基于实际应用场景，用这两种数据结构进行一次实战。

如果不清楚基本概念，请参阅前面两篇文章：

- [怒肝 JavaScript 数据结构 — 队列篇](https://juejin.cn/post/7083891791782477854)
- [怒肝 JavaScript 数据结构 — 双端队列篇](https://juejin.cn/post/7084261922576531469)

## 击鼓传花游戏

队列经常被应用于生活和计算机当中，针对不同的实际情况，队列也会有比较复杂的应用。

比如要说的这个击鼓传花游戏。这个游戏大家在上学的时候应该都玩过，班级里一个人在讲台上敲黑板，从第一排的同学开始向后传花，当敲击黑板的声音停止，花传到谁的手里，谁就要表演节目。

按照座位顺序传花的同学我们可以看作是一个队列，最终拿到花的同学，我们认为是要出列的元素。每一轮传花都要出列一人，剩余的同学再进行下一轮传花，直到最后剩一个人，这个人就是胜利者。

这种实现被称为`循环队列`。

下面我们看，如何基于队列。实现一个循环队列的方法：

```js
const hotPotato = (students, num) => {
  var queue = new Queue();
  let eliminated = [];

  students.forEach((item) => queue.enqueue(item));

  while (queue.size() > 1) {
    for (let i = 0; i < num; i++) {
      queue.enqueue(queue.dequeue());
    }
    eliminated.push(queue.dequeue());
  }

  return {
    eliminated,
    winner: queue.dequeue(),
  };
};
```

上述代码中，定义了一个 `hotPotato` 方法，第一个参数是所有同学的数组，第二个参数是指敲黑板的次数，给定一个条件值。

代码逻辑中，首先将所有同学的数组塞入队列，然后以队列长度大于 1（至少两个人才有传递的必要） 为条件进行循环。在循环体内，还有一层循环是以参数 `num` 的值为长度对队列进行排序，也就是说花传到谁的手里，谁前面的所有同学都出列，然后再从尾部入列，这样就完成了队列的排序。

排序之后，拿到花的同学称为了队列头部第一个元素，此时进行出列，将该同学移除。其中 `eliminated` 这个数组的作用是保存被移除的同学。

循环结束之后，再进行一次出列，这个最后被出列的同学就是最终的胜利者。

最后，我们将淘汰的和胜利的同学一并返回。

### 尝试结果

上面我们基于队列实现了一个击鼓传花的方法，现在试用一下：

```js
var students = ['赛罗', '欧布', '捷德', '银河', '泰迦', '泽塔', '维克特利'];
var result = hotPotato(students, 4);
console.log(result);
```

最终输出结果如下：

```js
{
  eliminated: [
    '泰迦', '捷德', '欧布', '银河', '维克特利', '赛罗'
  ],
  winner: '泽塔'
}
```

看来泽塔是最终胜利者，哈哈哈。

## 回文检查器

上面击鼓传花游戏是队列的应用，回文检查器则是双端队列的应用。

回文是啥？其实很简单，就是正反都能读得通的词句。比如 `12321`，`racecar` 这样，从左到右和从右到左读是一样的，看起来是一段对称的文字。

下面我们就利用双端队列，写一个函数，检测一个字符串是否是回文。

```js
const checkStr = (str) => {
  if (typeof str !== 'string' || !str) {
    return false;
  }
  let deque = new Deque();
  let is_equal = true;
  let str_arr = str.split('');

  for (let i = 0; i < str_arr.length; i++) {
    deque.addBack(str_arr[i]);
  }
  while (deque.size() > 1 && is_equal) {
    let first = deque.removeFront();
    let last = deque.removeBack();
    if (first !== last) {
      is_equal = false;
    }
  }
  return is_equal;
};
```

上述代码，函数的参数是一个字符串，首先检测参数是否是是字符串并且不为空。接下来将字符串参数分隔为数组，添加到双端队列中。

其中 `is_equal` 变量表示字符串参数的左右两边是否相等，默认为 true。然后在一个循环中从左边和右边分别取出一个值，逐个比较是否相等。如果有不相等的情况，则设置 is_equal 为 `false`表示字符串参数不是回文。

左右两边取值的方法也很简单，就是分别执行双端队列的 `removeFront` 和 `removeBack` 方法，让双端队列的首尾两端出列，并比较出列的值。

最后将 is_equal 返回，表示字符串是否是回文。

### 尝试结果

试用一下这个方法，打印结果如下：

```js
console.log(checkStr('人为我为人')); // true
console.log(checkStr('嘚嘚咦嘚徳')); // true
console.log(checkStr('我是杨成功')); // false
```

看来检测回文函数是有效的。

## 加入学习群

本文来源公众号：**程序员成功**。这是学习 JavaScript 数据结构与算法的第 3 篇，本系列会连续更新一个月，

欢迎关注公众号，点击“**加群**”一起加入我们的学习队伍～
