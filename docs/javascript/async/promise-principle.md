---
order: 3
---

# Promise 原理

命题角度三条线：

- 考察 Promise 特性（问答题）
- 给出一段 Promise 代码，问输出结果
- 深度考察 Promise 原理（终极版本就是让你手写一个 Promise）

## 一：Promise 特性类问题

**问：说说你理解的 Promise**

答题要点：代理对象、三个状态、状态切换机制

Promise 对象是一个代理对象，他的值是不确定的，可能是成功的值也可能是失败的值

三个状态：

- pending 状态，表示进行中
- fulfilled 状态，表示成功完成
- rejected 状态，表示操作失败、被拒绝

状态是可以改变的，但它只允许被改变一次

**问：Promise 的出现是为了解决什么问题？**

回调地狱，带来的可读性和可维护性被破坏

**问：Promise 常见方法有哪些？各自是干嘛的？**

这道题需要答出 all、race、reject 和 resolve。

### Promise.all

例子：Promise.all([p1, p2, p3])

执行多个 promise，返回一个新的 promise 对象，全部执行成功后触发 then，任意一个失败触发 catch

```javascript
var p1 = Promise.resolve('1号选手');
var p2 = '2号选手';
var p3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, '3号选手');
});
Promise.all([p1, p2, p3]).then((values) => {
  console.log(values); //  ["1号选手", "2号选手", "3号选手"]
});
```

### Promise.race

例子：Promise.race([p1, p2, p3])

执行多个 promise，返回一个新的 promise 对象，任意一个执行成功或失败后，调用对应的 then 或 catch 方法

### Promise.reject

返回一个状态为失败的 Promise 对象

### Promise.resolve

它返回一个 Promise 对象

## 二：看代码说答案类问题

#### 真题 1：

```javascript
const promise = new Promise((resolve, reject) => {
  console.log(1);
  resolve();
  console.log(2);
});

promise.then(() => {
  console.log(3);
});

console.log(4);
```

运行结果：1，2，4，3

#### 真题 2：

```javascript
let promise = new Promise((resolve, reject) => {
  resolve('第 1 次 resolve');
  console.log('resolve后的普通逻辑');
  reject('error');
  resolve('第 2 次 resolve');
});

promise
  .then((res) => {
    console.log('then: ', res);
  })
  .catch((err) => {
    console.log('catch: ', err);
  });
```

运行结果：

```
resolve后的普通逻辑
then:  第 1 次 resolve
```

考点点拨：Promise 对象的状态只能被改变一次。

#### 真题 3：

```javascript
Promise.resolve(1).then(Promise.resolve(2)).then(3).then().then(console.log);
```

运行结果：1

考点点拨：Promise 值穿透问题

then 方法只接受函数为参数，其他值会跳过。

#### 真题 4：

下方的 `result()` 方法，是不是 Promise？

```js
// 示例用法：
const timeout = (time) => new Promise((resolve) => setTimeout(resolve, time));

const result = timeout(time).then(() => console.log(order)));
```

结论：只要返回 `new Promise()` 就是一个 Promise，不管它有没有跟 `.then()` 和 `.catch()`。

```js
const fun = () => new Promise(() => resolve()).then((data) => console.log(data));
// fun 是一个普通方法
// fun() 是一个 Promise
```

### 三：Promise 底层原理考察

终于要手写 promise 了！内容较多，移步下一节。
