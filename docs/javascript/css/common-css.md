# 常见样式处理

记录常用的样式处理。

### 文字超出省略号

移动端开发经常会遇到这样的情况：一个元素包含不确定行数的文字，而我们要保留一行或多行，剩余部分显示省略号。

**保留一行**

实现保留一行并显示省略号，只需要三个属性：

```css
p {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
```

说一下 `white-space` 的作用。white-space 指定如何处理空白部分，空白部分包括空格和换行。

`white-space: nowrap` 指定不换行，是实现一行文字的核心。

**保留多行**

比如：保留 3 行，超出部分省略。

```css
p {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
```

### box-sizing

这个属性用于设置元素的宽度包含范围，有两个值：

- `content-box`：默认值，宽度不包含 padding 和 border。
- `border-box`：宽度包含 padding 和 border。
