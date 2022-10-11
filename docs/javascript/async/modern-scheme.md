---
order: 2
---

# 现代方案

广大开发者苦回调地狱已久，早就想翻身了。这节一口气说完三个现代异步方案：

Promise —> Generator —> async/await。

### Promise

模拟一个网络请求的过程

```javascript
const https = require('https');

function httpPromise(url) {
  return new Promise(function (resolve, reject) {
    https
      .get(url, (res) => {
        resolve(data);
      })
      .on('error', (err) => {
        reject(error);
      });
  });
}

httpPromise('...')
  .then(function (data) {
    // 处理成功后返回的 data
  })
  .catch(function (error) {
    // 处理失败后返回的 error
  });
```

Promise 的方案是：接收一个匿名函数，返回一个 Promise 函数实例。在函数体中写异步任务，这个任务会立即执行。

执行过程中会有 3 种状态：

- pending 状态，表示进行中
- fulfilled 状态，表示成功完成
- rejected 状态，表示操作失败、被拒绝

匿名函数有两个参数：**resolve**, **reject**

函数体内执行 resolve()，会将状态设置为 fulfilled，逻辑会走到 then 中去；执行 rejected()，状态设置为 rejected，逻辑则走到 catch 中；

单个 promise 看似也需要回调，那我们对比之前的”回调地狱“，看看链式调用的写法：

```javascript
httpPromise(url1)
    .then(res => {
        console.log(res);
        return httpPromise(url2);
    })
    .then(res => {
        console.log(res);
        return httpPromise(url3);
    })
    .then(res => {
      console.log(res);
      return httpPromise(url4);
    })
    .then(res => console.log(res));。
```

清新脱俗有木有！

明白了原理，试试手动实现一个 Promise：[模拟 Promise](./write-promise.md)

### Generator

Generator 函数不同于普通函数，它会返回一个遍历器对象，循环遍历函数体内的状态

那么怎样和普通函数区别开来？怎样定义状态？这里要介绍 Generator 的两个特征：

- function 关键字与函数名之间有一个星号
- 函数体内使用 yield 关键字定义状态

```javascript
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

var hw = helloWorldGenerator();
```

例子中，内部有两个状态（hello 和 world），以及 return 的状态（ending），共 3 个状态

函数调用，返回 hw。这个 hw 并不是函数执行结果，事实上函数并没有执行，返回的是一个遍历器对象，用于遍历内部状态的指针

所有上面代码可以这么写：

```javascript
function* httpGenerator() {
  let res1 = yield httpPromise(url1);
  console.log(res);
  let res2 = yield httpPromise(url2);
  console.log(res);
}
var it = httpGenerator();
```

由于只返回了迭代器，函数体的代码并未执行，所以我们执行的方式只有一个，调用 it 的 `next`方法

但是也不能一直手动调 next 方法，我们需要写一个函数让它自动调用完所有的 next 返回结果：

```javascript
function runGenerator(gen) {
  var it = gen(),
    ret;

  // 创造一个立即执行的递归函数
  (function iterate(val) {
    ret = it.next(val);

    if (!ret.done) {
      // 如果能拿到一个 promise 实例
      if ('then' in ret.value) {
        // 就在它的 then 方法里递归调用 iterate
        ret.value.then(iterate);
      }
    }
  })();
}

runGenerator(httpGenerator);
```

这个 runGenerator 只是一个雏形，体现的就是自动执行的思想。而这个雏形最典型的完整版，就是大名鼎鼎的 `co`模块，你一定用过吧~

```javascript
const co = require('co');
co(httpGenerator());
```

### Async/Await

终极异步处理方案，两个关键字，就可以实现同步方式写异步代码

它的用法非常简单，写一个请求案例：

```javascript
async function httpRequest() {
  let res1 = await httpPromise(url1);
  console.log(res1);
}
```

其实，async/await 本身是 generator 异步方案的语法糖，但是语法上更直观

注：Promise 的错误需要通过回调函数捕获，try catch 是行不通的。而 async/await 和 generator 允许 try/catch。
