# Node.js Buffer

JavaScript 的 6 种基本数据类型中，没有二进制数据类型。

在处理**流数据**（TCP 流，文件流，音视频流）的时候，必须要用到二进制数据，因此需要一个可以存放二进制数据的变量类型。Node.js 中提供了 Buffer 这个类来存放二进制数据。

Buffer 类与 Node.js 集成在一起，可以直接使用，不需要单独引入。

如果用 `console.log()` 打印一个 Buffer 类型的数据，会看到仿佛是一个由密密麻麻的整数组成的数组，这就是 Buffer 数据的特征。

### 创建 Buffer

创建 Buffer，主要是用 `Buffer.from()` 和 `Buffer.alloc()` 命令。

```js
// 创建一个长度为 10、且用 0 填充的 Buffer。
const buf1 = Buffer.alloc(10);
```
