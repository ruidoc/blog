---
group:
  title: 异步
  path: /async
  order: 3
order: 1
---

# 异步与回调

带着问题去学习：

1. 谈谈你所了解的 JS 异步方案
2. Promise 到底解决了什么痛点？这样的痛点还可以如何解决？

### 生活中的同步与异步

拿去 KFC 排队买炸鸡举例。

点餐付款需要一分钟，出餐需要十分钟。你点餐后原地等待出餐，出餐后再结束排队离开。下一个人再点餐，等待出餐，直到排队的最后一个人

上面的情况，就是”同步“。即一个人的任务全部完成，再进行下一个人的任务。这样明显会大大的浪费时间。

另一种方案：收银台花一分钟点餐付款，然后拿到小票回到座位等着取餐，后面的人继续点。出餐前的九分钟你可以做任何事，等到叫号时去取餐，任务就完成了。这就是”异步“

### JS 中的同步与异步

JS 的 **任务执行模式** 分为同步和异步。

同步，就是说后一个任务必须等待前一个任务全部执行完毕再执行，任务的执行顺序和排列顺序高度一致

异步，则恰恰相反，任务的执行顺序不必遵循排列顺序，效率和利用率优先

### 异步进化史

异步方案的四个进化阶段：

**回调函数 —> Promise —> Generator —> async/await。**

### 回调函数

Promise 出现前，最常用的异步方式就是回调函数。

> MDN 的回调函数概念：被作为实参传入另一函数，并在该函数内被调用，用以来完成某些任务的函数，称为回调函数。

一个最简单的例子：

```js
function exec(fn) {
  // 执行任务
  setTimeout(() => {
    fn();
  }, 100);
}
exec(function () {
  // 任务完成后的回调
  console.log('完成');
});

// 异步读取文件
fs.readFile(filePath, 'utf8', function (err, data) {
  if (err) {
    throw err;
  }
  console.log(data); // 输出文件内容
});
```

除此之外，_事件监听_、_发布订阅_ 等，也用到了回调函数

#### 事件监听

上一个大家最熟悉的例子：

```js
document.getElementById('#myDiv').addEventListener(
  'click',
  function (e) {
    console.log('我被点击了');
  },
  false,
);
```

这就是一个典型的事件监听，把任务的执行时机推迟到了点击这个动作发生时

如何实现一个事件监听？

```js
// 1. 注册事件
var ev = new Event('blow');
// 2. 注册事件对象
var evt = new EventTarget();
// 3. 添加事件监听器
evt.addEventListener('blow', function () {
  alert('1');
});
// 4. 触发事件
evt.dispatchEvent(ev);
```

`Event` 是 DOM 事件，最常见的有 click，scroll。`EventTarget` 是 DOM 接口，最常见的有 Element，document，window

这里通过自定义实现。

#### 发布订阅

看一下 jquery 的发布订阅，更能直观的理解：

```js
function consoleTrigger() {
  console.log('trigger事件被触发');
}
// 订阅
jQuery.subscribe('trigger', consoleTrigger);
// 发布
jQuery.publish('trigger');
```

这种模式和事件监听下的异步处理非常相似。从设计模式的角度看，事件监听本身就是一种发布-订阅模式。

如何手动实现一个发布-订阅？

```js
class Emitter {
  static on(event, fn) {
    (this.list[event] || (this.list[event] = [])).push(fn);
    return this;
  }
  static emit(event, ...rest) {
    var funs = this.list[event] || [];
    funs.forEach((fn) => fn(...rest));
  }
  static list = {};
}

Emitter.on('test', (data) => {
  console.log(data + ' 1');
});
Emitter.on('test', (data) => {
  console.log(data + ' 2');
});

Emitter.emit('test', '携带的data');
```

#### “回调地狱”

一层回调感觉没什么问题，可回调多了之后，代码的**可读性**和**可维护性**将面临严峻的挑战

```js
const https = require('https');

https.get('目标接口1', (res) => {
  console.log(res)
  https.get('目标接口2', (res) => {
    https.get('目标接口3'),  (res) => {
        console.log(res)
        https.get('目标接口4', (res) => {
          https.get('目标接口5', (res) => {
            console.log(res)
            .....
            // 无尽的回调
          }
        }
    }
  }
})
```

为了解决回调地狱的问题，Promise 终于登场了。看下一节：[现代异步解决方案](./modern-scheme.md)
