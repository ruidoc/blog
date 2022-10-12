---
group:
  title: 实践
  path: /practice
title: 数据类型转换
order: 1
---

# 数据类型转换

JS 中的数据类型有两种转换方式：`显示转换`和`隐式转换`。

主要是 `number`，`string`，`boolean` 这三种类型的转换。

### 显式转换

#### 转为字符串

转换为字符串，主要用 `String()` 方法

```js
String(null); // "null"
String(1); // "1"
String(true); // "true"
String(undefined); // "undefined"
```

String() 方法和 `.toString()` 方法效果一致。

```js
String(true); // true
true.toString(); // true
```

这里注意：不是所有类型都有 .toString() 方法，**null 和 undefined 没有**！

除此之外，**number 对象调用 toString() 会报错**：

```js
123.toString(); // SyntaxError
// 正确用法
123..toString(); // '123', 注意是两个点！
(123).toString(); // '123'
```

数组和对象不能通过 toString() 转为字符串：

```js
({ name: 'ruims' }
  .toString() // "[object Object]"
  [(1, 2)].toString()); // "1,2"
```

上面代码可见：`[].toString()` == `[].join()`

那数组和对象如何装换字符串呢？

当然是 `JSON.stringify()` 啦！

#### 转为数字

转换为数字，主要用 `Number()` 方法

```js
Number('3.14'); // 返回 3.14
Number(' '); // 返回 0
Number(''); // 返回 0
Number(false); // 返回 0
Number(true); // 返回 1
Number(['5']); // 返回 5。首先会变成 '5', 然后再变成数字 5
Number('其他'); // 返回 NaN
```

其他方法：

1. parseInt()：转换为整数
2. parseFloat()：转换为浮点数
3. 一元运算符 +

这里重点说一下 一元运算符 **+** 号：

语法：`+n == Number(n)`

```js
+'5' + // 5
  true + // 1
  new Date(); // 1614868133693
Number(new Date()); // 1614868133693
```

转换失败的结果是 `NaN`，且 `NaN != NaN`

#### 判断空数组和空对象

空数组：

```js
Array.isArray([]) && ![].join();
```

空对象：

```js
JSON.stringify({}) === '{}';
Object.prototype.toString.call({}) == '[object Object]' && Object.keys({}).length === 0;
```

### 隐式转换（Implicit conversion）

来一张经典图片

![xgE7zB8](../image/xgE7zB8.png)

#### 二元算术运算

加法两边自动转换字符串：num + ''

```js
6 + ''      // 6
[] + 1      // 1
```

减法、乘法、除法，取余，两边自动转换数字：str - 0

```js
'6' - 1; // 5
'2' - true; // 1
'3' * true; // 3
'7' * false; // 0
```

#### a == b

记住几条规则：

1. string 和 number 比较，先将 string 转换为 number 类型。
2. boolean 和其他任何类型比较，boolean 首先被转换为 number 类型
3. null == undefined，除此之外，null 和 undefined 与其他任何值比都是 false.

#### a === b

严格等于，比较类型，避免了隐式转换的问题。

### 参考文章

这篇写的不错：[这里](https://chinese.freecodecamp.org/news/javascript-implicit-type-conversion/)
