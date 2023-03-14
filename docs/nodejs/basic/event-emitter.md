# 事件触发器

在浏览器中，有单击，滚动，键盘等多种事件。

Node.js 中虽然没有这些事件，但是提供了 events 模块用来构建类似的事件。

具体上，此模块提供了 EventEmitter 类，用于处理事件。

初始化方法：

```js
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();
```

eventEmitter 对象主要有两个方法：

- `emit`：用于触发事件
- `on`：用于监听事件，添加回调函数

如，创建 start 事件并监听：

```js
// 监听
eventEmitter.on('start', () => {
  console.log('开始');
});
// 触发
eventEmitter.emit('start');
```

也可以传递参数：

```js
eventEmitter.on('start', (start, end) => {
  console.log(`从 ${start} 到 ${end}`);
});

eventEmitter.emit('start', 1, 100);
```

EventEmitter 还提供了其他方法，如：

- `once()`: 添加单次监听器。
- `removeListener() / off()`: 从事件中移除事件监听器。
- `removeAllListeners()`: 移除事件的所有监听器。
