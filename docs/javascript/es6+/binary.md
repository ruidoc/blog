# 前端二进制

在 Web 开发中，当我们处理文件时，经常会遇到二进制数据。

JavaScript 提供了几种二进制数据格式：

- ArrayBuffer
- Uint8Array
- DataView
- Blob
- File

ArrayBuffer 是最基本的二进制对象，表示固定长度，如：

```js
let buffer = new ArrayBuffer(16); // 创建一个 16 字节 的 buffer，用 0 填充
alert(buffer.byteLength); // 16
```

ArrayBuffer 只是用于存储二进制数据，如果要操作，则需要使用 **“视图” 对象**。

视图对象，不存储任何数据，作用是将 ArrayBuffer 的数据做了结构化的处理，便于我们操作这些数据。

视图对象包括：

- **Uint8Array**：每个 item 1 个字节
- **Uint16Array**：每个 item 2 个字节
- **Uint32Array**：每个 item 4 个字节
- **Float64Array**：每个 item 8 个字节

按照上面的标准，一个 16 字节 ArrayBuffer，可转化为 Uint8Array（长度 16），Uint16Array（长度 8），Uint3'2Array（长度 4），Float64Array（长度 2）
