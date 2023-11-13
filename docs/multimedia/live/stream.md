# JavaScript 流处理

在很长的一段时间内，JavaScript 不支持处理流数据。如果你想处理一个视频、音频等文件，需要将其完整的下载下来，然后将完整的内容做一次格式转换。

随着直播的兴起，浏览器直播成为了一个强需求。而直播是实时性的，不存在完整的内容，都是来一部分播一部分，这就要求浏览器必须处理二进制数据流，实现一边加载一边播放的功能。

现代浏览器已经支持了 Stream API，它可以轻松处理流数据。流数据主要分为以下两类。

## 可读流 ReadableStream

一个可读流是一个数据源，用对象 `ReadableStream` 表示，它是一个构造函数。一个成功的 `fetch` 请求返回的响应体就是一个 ReadableStream 可读流，因此使用 fetch 请求可以实现拉流直播。

在读取流内容之前，首先要明白可读流有哪些特性，了解特性可以避免在使用时踩坑。

1. 可读流的特性

首先，可读流顾名思义，只能读取不能修改，这是一个大前提。

其次，可读流在同一时间内只能被一个读取器读取，此时流会被锁定，不能再被其他读取器读取。当读取器释放该流之后，流会自动解锁。

```js
var stream = new ReadableStream();
// 判断流锁定
stream.locked == true;
// 取消读取流，即解除锁定
stream.cancel();
```

2. 获取读取器

获取读取器后，流会被自动锁定，获取方法如下：

```js
var stream = new ReadableStream();
var reader = stream.getReader();
reader.read().then(({ done, value }) => {
  console.log(done); // 流是否传输完毕
  console.log(value); // 流数据片段
});
```

这里需要注意一点：`reader.read().then()` 的回调函数只会执行一次，而我们通常的需求是只要流进来就要触发该函数获取数据，应该怎么做呢？

方法就是使用 Promise 的链式调用，上面代码改造如下：

```js
reader.read().then(function process({ done, value }) {
  console.log(done); // 流是否传输完毕
  return reader.read().then(process);
});
```

首先将回调函数由匿名函数改为一个名为 `process` 的函数声明，然后在回调函数内返回 `reader.read().then()` 并传入这个函数，这样就实现了链式调用。

当然，如果你想控制触发频率，比如间隔 2s 触发一次，可以这样写：

```js
reader.read().then(function process({ done, value }) {
  setTimeout(() => {
    return reader.read().then(process);
  }, 2000);
});
```

3. 可读流副本

上面说到，可读流只能同时被一个读取器读取。当你想要基于一个流做两件事，此时就显得不那么容易了。

举个例子：比如你在获取到直播流之后，一边要播放流，一边要监听流数据。但一个流只能被使用一次，如果流正在播放中（也就是被某个读取器读取中），此时是无法再读取这个流并监听的。

基于这种情况，ReadableStream 提供了一个 `tee()` 方法用于获取两条可读流，这样一条流负责播放，一条流负责监听数据，各干各的互不影响。

```js
var stream = new ReadableStream();
var teedOff = stream.tee();

teedOff[0]
  .getReader()
  .read()
  .then(({ done, value }) => {
    console.log('负责播放', value);
  });
teedOff[1]
  .getReader()
  .read()
  .then(({ done, value }) => {
    console.log('负责处理', value);
  });
```

## 可写流 WritableStream
