# 流 Stream

Node.js 支持 Stream 流文件处理，那么什么是流？

将一个大文件，拆分为一小块一小块的二进制小文件，这些小文件被称为 chunk，这些所有的 chunk 组成了流。当我们处理这类大文件时，这些 chunk 像水流一样一点点的流出去等待被处理。

流分两类，**可读流**和**可写流**。顾名思义，可读流就是可以读取每个 chunk 的流，可写流是将读取的 chunk 写入到这个流中，组成一个新流。

可读流/可写流通常基于文件创建，举个例子：

```js
var fs = require('fs');
var data = '';

// 创建可读流
var readerStream = fs.createReadStream('input.txt');

// 设置编码为 utf8。
readerStream.setEncoding('UTF8');

// 处理流事件 --> data, end, and error
readerStream.on('data', function (chunk) {
  data += chunk;
});

readerStream.on('end', function () {
  console.log(data);
});

readerStream.on('error', function (err) {
  console.log(err.stack);
});

console.log('程序执行完毕');
```

### 管道流

管道流像一条水管一样，从一个桶（readStream）中流出数据，通过管道，流入到另一个桶（writeStream）。这样就慢慢的实现了大文件的复制过程。

```js
var fs = require('fs');

// 创建一个可读流
var readerStream = fs.createReadStream('input.txt');

// 创建一个可写流
var writerStream = fs.createWriteStream('output.txt');

// 管道读写操作
// 读取 input.txt 文件内容，并将内容写入到 output.txt 文件中
readerStream.pipe(writerStream);

console.log('程序执行完毕');
```
