---
order: 3
---

# 防抖与节流

在各种各样的浏览器事件中，有一类特殊的事件：容易过度触发的事件。

最典型的是 scroll 事件。除此之外，还有 resize 事件、鼠标事件等等

高频率触发回调导致的大量计算会引发页面的抖动甚至卡顿，为了避免这种情况，就需要手动控制触发频率，所以 和 debounce（事件防抖）throttle（事件节流）产生了。

### debounce： 最后一个说了算

debounce 的核心是：事件被触发 n 秒后再执行回调，如果在这 n 秒内又被触发，则重新计时

所以 n 秒内事件触发的回调都不会被执行

实际应用场景：输入搜索

实现一个 debounce：

```js
// fn是我们需要包装的事件回调, delay是每次推迟执行的等待时间
function debounce(fn, delay) {
  // 定时器
  let timer = null;

  // 将debounce处理结果当作函数返回
  return function () {
    // 保留调用时的this上下文
    let context = this;
    // 保留调用时传入的参数
    let args = arguments;
    // 每次事件被触发时，都去清除之前的旧定时器
    if (timer) {
      clearTimeout(timer);
    }
    // 设立新定时器
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}
```

使用方法：

```js
// 用debounce来包装fn方法
var obj = { fn: str=> { console.log(str) }}}
const deb_scroll = debounce(obj.fn, 1000);
deb_scroll('我的')
```

这边总是理解错误：使用原则就是包装方法 A，返回方法 B。调用方法 B，方法 B 内部调用方法 A。

### Throttle： 第一个说了算

Throttle 的核心是：事件第一次触发，执行回调，之后 n 秒内无论事件触发多少次都会被无视。

n 秒之后，从新开始监听事件

实际应用场景：下拉刷新

实现一个 throttle：

```js
// fn是我们需要包装的事件回调, interval是时间间隔的阈值
function throttle(fn, interval) {
  // last为上一次触发回调的时间
  let last = 0;

  // 将throttle处理结果当作函数返回
  return function () {
    // 保留调用时的this上下文
    let context = this;
    // 保留调用时传入的参数
    let args = arguments;
    // 记录本次触发回调的时间
    let now = +new Date();

    // 判断上次触发的时间和本次触发的时间差是否小于时间间隔的阈值
    if (now - last >= interval) {
      // 如果时间间隔大于我们设定的时间间隔阈值，则执行回调
      last = now;
      fn.apply(context, args);
    }
  };
}
```

使用方法：

```js
// 用throttle来包装scroll的回调，并保存返回的函数
const better_scroll = throttle(() => console.log('触发了滚动事件'), 1000);
document.addEventListener('scroll', better_scroll);
```
