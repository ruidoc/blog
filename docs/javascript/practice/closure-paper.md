---
order: 2
---

# 闭包面试真题

主要是循环体系列和复杂作用域系列。闭包与内部函数是否返回无关。

## 循环体系利

```javascript
for (var i = 0; i < 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, 0);
}

console.log(i);
```

输出结果：

```js
5 5 5 5 5 5
```

解析：首先，setTimeout 的第二个参数最小值为 1。其次，从事件循环来看，setTimeout 最后执行。

## “复杂作用域” 系列

解题技巧：`画图 + 定位变量`

上真题：

```JavaScript
var a = 1;
function test(){
    a = 2;
    return function(){
        console.log(a);
    }
    var a = 3;
}
test()(); // a = 2
```

此题的关键是，test 作用域里的变量值，到底是 2 还是 3？

因为 **函数** 和 **变量** 都存在提升。所以 a=3 不会提升在匿名函数之前，此时 a=2。

再看一道：

```js
function test() {
  var num = [];
  var i;
  for (i = 0; i < 10; i++) {
    num[i] = function () {
      console.log(i);
    };
  }
  return num[9];
}
test()(); // 10
```

解析：i 循环完毕之后等于 10，num[9] 与 i 无关。

再看一道：

```js
var test = (function () {
  var num = 0;
  return () => {
    return num++;
  };
})();
for (var i = 0; i < 10; i++) {
  test();
}
console.log(test()); // 10
```

上面这个是典型的闭包，立即执行函数会缓存变量 `num` 的值，会一直递增。

最后 num++ 的返回值为 `10`，此时 `num = 11`。

这个题目不用立即执行函数，另一种普通写法如下：

```js
function fun() {
  var num = 0;
  return () => {
    return num++;
  };
}
var test = fun(); // 返回内置函数
for (var i = 0; i < 10; i++) {
  test();
}
console.log(test()); // 10
```

这里闭包缓存的直接原因是没有重复调用 `fun()` 方法，所以不会重新赋值。如果是这样：

```js
fun()(); // 0
fun()(); // 0
fun()(); // 0
```

这样会重新赋值，即便是闭包，打印值也会一直为 0。

## 其他试题

1. 考察 n++ 和变量提升

```js
var a = 0,
  b = 0;
var A = function (a) {
  A = function (b) {
    alert(a + b++);
  };
  alert(a++);
};
A(1);
A(2);
```

结果：分别弹出 1 和 4。

2. 考察块级作用域

```js
var name = 'xiuyan'; // 全局作用域内的变量
// 函数作用域
function showName() {
  console.log(name);
}
// 块作用域
{
  name = 'BigBear';
}
showName(); // 输出 'BigBear'
```
