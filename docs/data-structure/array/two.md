---
title: 数组迭代
order: 2
---

# 数组迭代

大家好，我是杨成功。

上一篇我们认识了数据结构中的数组，并且总结了 JavaScript 中数组的基本操作，包括初始化数组，添加，修改，删除数组项等，还总结了 JavaScript 内置的数组操作函数。

这一篇我们介绍数组的迭代，以及 ES6 新增的数组能力。

## 数组迭代器

数组是一个由一组数据组成的集合，每个元素被称为数组项。如果我们想连续对每个数组项执行一些操作，那么就会用到数组的迭代，也叫遍历，`for` 循环是最基础的遍历。

假设现在有一个数组 `cities` 如下：

```js
var cities = ['北京', '上海', '杭州', '深圳'];
```

我们要通过遍历数组，每个数组项前面加上 `中国-` 这个前缀，用基本的 `for` 循环实现如下：

```js
for (var i = 0; i < cities.length; i++) {
  cities[i] = '中国-' + cities[i];
}
// cities = ['中国-北京', '中国-上海', '中国-杭州', '中国-深圳']
```

这是最基础的实现，JavaScript 在此基础上实现了许多原生的迭代器函数。

比如上面的循环可以用 `forEach` 替代：

```js
cities.forEach((item, i) => {
  cities[i] = '中国-' + item;
});
// cities = ['中国-北京', '中国-上海', '中国-杭州', '中国-深圳']
```

**forEach** 的参数是一个回调函数，有两个参数，第一个参数 item 表示当前数组项，第二个参数表示索引，遍历的每一项都会执行这个函数。下面几个迭代器的参数也是这个回调函数：

- map
- filter
- find
- findIndex
- some
- every

我们再用 `map` 实现上面的逻辑：

```js
cities = cities.map((item) => '中国-' + item);
// cities：['中国-北京', '中国-上海', '中国-杭州', '中国-深圳']
```

看到 forEach 与 map 的区别了吧。forEach 是直接遍历，纯粹的执行回调函数。而 map 是在回调函数中返回新值，最终在执行完毕后返回新的数组。

其他函数使用如下：

```js
// 1. filter
let arr = cities.filter((item, i) => i == 2 || i == 3);
// arr：['上海', '杭州']

// 2. find
let row = cities.find((item) => item == '杭州');
// row：'杭州'

// 3. findIndex
let index = cities.findIndex((item) => item == '杭州');
// index：2
```

`some` 与 `every` 函数用来检测数组是否满足某种条件，返回布尔值。

```js
// 4. some：检测数组中是否有一项满足条件
let bool = cities.some((item) => item == '杭州');
// bool：true

// 4. some：检测数组中是否所有项都满足条件
let bool = cities.every((item) => item == '杭州');
// bool：false
```

这里要提一个特殊的迭代函数 `reduce`，它的回调函数与上述的有些区别，但是功能很强大。

reduce 是一个函数累加器，可以把数组项中的值累加起来，常用与计算数值的总和，或者拼接字符串。我们看如何用 reduce 把上面的 cities 数组起来，用逗号分隔：

```js
let str = cities.reduce((total, item) => total + ',' + item);
// str：'北京,上海,杭州,深圳'
```

再举一个数字累加的例子。假设有一组数字如下：

```js
let arr = [12.4, 16.7, 29.4, 45.2, 52, 72, 66.4];
let sums = arr.reduce((total, item) => total + item);
// sums：294.1
```

数组项是基本类型比较简单，再看一个对象数组的例子：

```js
let arr = [
  { key: 'd', val: 13 },
  { key: 'e', val: 14 },
  { key: 'f', val: 15 },
];
let sums = arr.reduce((total, item) => {
  return total + item.val;
}, 0);
// sums：42
```

可以看到，reduce 的回调函数，第一个参数 total 是已经累加的总和，第二个参数 item 才是当前数组项，累加直到循环结束，算出最终值。

> 注意：上面 reduce 方法中第二个参数为 0，这个 0 是必填的，表示初始化值。如果不填，则回调函数第一次执行时，total 为数组第一项，item 为数组第二项；如果传值，则 total 为该值，item 为数组第一项。

## 其他数组方法

还有很多 ES6 新增的数组方法，下面一起看看。

**1. join**

join 用于将所有数组项当作字符串连接起来，默认用逗号分隔。上面我们用 reduce 方法实现了数组项连接，其实用 `join` 实现更简单：

```js
let str = cities.join(',');
// str：'北京,上海,杭州,深圳'
```

**2.slice**

slice 方法非常有用，用于筛选一段连续的子数组项。它的参数有两个，第一个 `start` 表示开始下标，第二个参数 `end` 表示结束下标。筛选规则是包含 start 不包含 end。

```js
let arr = cities.slice(2, 4);
// arr：['杭州, 深圳']
```

**3. includes**

includes 方法可以快速判断一个数组当中是否有指定值。如：

```js
let bool = cities.includes('上海');
// bool：true
let bool = cities.includes('西安');
// bool：false
```

**4. fill**

fill 方法可以用一个固定值，来替换已有数组中的某几项。它有三个参数，第一个参数 value 是替换的值，第二个参数 start 是开始替换的索引，第三个参数 end 是结束替换的索引。

比如将数组 `cities` 中的第三和第四个数组项替换成 `红旗`，实现如下：

```js
cities.fill('上海', 2, 4);
// cities：['北京', '上海', '红旗', '红旗']
```

注意：fill 方法直接改变原数组。

**5. from**

from 方法可以将有 length 属性的数据类型，以及可迭代的对象转换为一个数组，最常见的就是将 Set 类型的数据转换为数组：

```js
var set = new Set(['北京', '上海', '北京', '上海']);
let arr = Array.form(set);
// arr：['北京', '上海']
```

上面的操作被称为数组去重。from 方法还可以将字符串分隔为数组：

```js
let arr = Array.form('JavaScript最强');
// arr：['J', 'a', 'v', 'a', 'S', 'c', 'r', 'i', 'p', 't', '最', '强']
```

**6. copyWithin**

copyWithin 方法也很强大，主要作用是用两个下标选择一段数组项，然后从指定位置开始，替换成这些数组项。

听着拗口，直接上代码。copyWithin 有三个参数，参数一 target 是从哪个位置开始替换；参数二 start 是筛选的起始位置，参数三 end 是筛选的结束位置。将 start-end 筛选的数组项，从参数 target 处开始替换。如下：

```js
let arr = [1, 2, 3, 4, 5];
arr.copyWithin(3, 0, 2);
// arr：[1, 2, 3, 1, 2]
```

这个方法有点 `slice + fill` 的意思哈哈。

## 数组小结

通过两篇对 JavaScript 数组的回顾和整理，我们了解了这个最常用的数据结构——数组是怎么回事。这个也是后面学习其他数据结构和算法的基础。

下一章，我们将开始学习第二个数据结构：栈。

## 加入学习群

本文来源公众号：[**程序员成功**](https://link.juejin.cn/?target=https%3A%2F%2Fwww.ruims.top%2Fstatic%2Fwxpub.png 'https://www.ruims.top/static/wxpub.png')。这是学习 JavaScript 数据结构与算法的第 1 篇，本系列会连续更新一个月，欢迎关注公众号，点击“**加群**”一起加入我和小伙伴们的学习队伍吧～
