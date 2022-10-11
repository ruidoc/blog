---
order: 2
---

# 手写 Promise

不手动撸一个 Promise，永远不能彻底了解它的运作原理。

再来复习下 Promise 的组成要素：

**1. 三种状态**

- pending 状态，表示进行中
- fulfilled 状态，表示成功完成
- rejected 状态，表示操作失败、被拒绝

**2. 两个参数**

resolve, reject，都是函数

执行 resolve()，状态设置为 fulfilled，逻辑走到 then 中去；执行 rejected()，状态设置为 rejected，逻辑走到 catch 中去；

注意，**状态只能改变一次**，只能由 pending 变成 fulfilled 或 rejected，不可逆。

了解了这些，开始动手。

### 代码实操

首先实现一个简易版 Promise，涵盖了核心概念。

```js
class Promise1 {
  constructor(executor) {
    // executor是实例化传过来的函数

    // 1. 定义resolve和reject函数，第2部会用到
    var resolve = (value) => {
      if (this.status !== 'pending') return;
      this.status = 'fulfilled';
      if (this.thenCallback) {
        this.thenCallback(value);
      }
    };
    var reject = (error) => {
      if (this.status !== 'pending') return;
      this.status = 'rejected';
      if (this.errorCallback) {
        this.errorCallback(error);
      }
    };
    // 2. 调用executor执行函数体内的逻辑。同时，再把定义好的resolve，reject函数传回去，等待函数体内调用。
    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  status = 'pending';
  thenCallback = null;
  errorCallback = null;

  then(fn, errFn) {
    // 将传来的函数暂存，等待resolve或reject调用
    if (this.status == 'pending') {
      this.thenCallback = fn;
      this.errorCallback = errFn || null;
    }
  }

  catch(fn) {
    this.errorCallback = fn;
  }
}
```

使用方法：

```js
function getAsync(val) {
  return new Promise1(function (resolve, reject) {
    setTimeout(() => {
      resolve(val);
    }, 1000);
  });
}
getAsync('data')
  .then((val) => {
    console.log(val);
  })
  .catch((e) => {
    console.log(e);
  });
```

这个简易版 Promise 已经可以使用了。

但为什么说是简易版？因为还缺少一个核心功能：**链式调用**

### 链式调用

链式调用是这样的：

```js
getAsync('data')
  .then((val) => {
    console.log(val); // data
    return getAsync('data2');
  })
  .then((val) => {
    console.log(val); // data2
  })
  .catch((e) => {
    console.log(e);
  });
```

看出来了吗，这里多了两个点：

1. then 方法可以连着调用多次（不限次）
2. resolve 函数必须 return 一个值（promise 或 定值），这个值会作为下一个 resolve 函数的参数

**先看第一点**。then 方法之后能继续调用 then，说明 then 方法返回的是一个 Promise（即当前构造函数 Promise1）。所以改造 then 方法。

```js
then(fn, errFn) {
    return new Promise1(function (resolve, reject) {
        // 将传来的函数暂存，等待resolve或reject调用
        if(this.status == 'pending') {
            this.thenCallback = fn;
            this.errorCallback = errFn || null;
        }
    })
}
```

**再看第二点**。resolve 函数有返回值，并传给下一个 resolve。所以要在 resolve 函数中获取返回，并且在 then 中使用。同时改造 resolve 和 then 方法。

```js
var resolve = value => {
    if(this.status!=='pending') return;
    this.status = 'fulfilled';
    this.value = value
    this.then()
}
then(fn, errFn) {
    return new Promise1(function (resolve, reject) {
        // 将传来的函数暂存，等待resolve或reject调用
        if(this.status == 'pending') {
            this.thenCallback = fn;
            this.errorCallback = errFn || null;
        }
        if(this.status == 'fulfilled') {
            var result = thenCallback()
            if(result instanceof Promise1) {
                result.then(resolve, reject)
            } else {
                resolve(result)
            }
        }
    })
}
```
