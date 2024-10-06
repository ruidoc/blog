---
title: JavaScript 运算符
---

## Js 运算符

总结一下运算符。

### n++ 与 ++n

`n++` 与 `++n` 的计算效果一样，都是在 n 的基础上 **+1**。

区别是：n++ 返回旧值，++n 返回新值。

```js
var n = 1;

var n_one = n++;
var n_two = ++n;
console.log(n, n_one);
// 2, 1
console.log(n, n_two);
// 2, 2
```

上面例子中，不管 `n++` 还是 `++n`，首先 n 会自增，区别只是执行后的返回结果不同。

### ^ 运算符
