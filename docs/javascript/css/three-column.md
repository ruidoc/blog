# 三栏布局

以这个结构为例。已知 #left 和 #right 宽度固定，使 #main 自动填充，实现水平三栏布局。

```html
<div id="box">
  <div id="left"></div>
  <div id="main"></div>
  <div id="right"></div>
</div>
```

### 1. flex

```css
#box {
  display: flex;
  align-items: center;
  justify-content: center;
}
#main {
  flex: 1;
  /* flex-grow: 1;
    flex-shrink: 0;
    flex-basis: auto; */
}
```

### 2. inline-block

```css
#box {
  display: block;
}
#left,
#right {
  display: inline-block;
  width: 100px;
}
#main {
  display: inline-block;
  width: calc(100% - (100px + 100px));
}
```

**注意：**inline-block 的问题：默认有留白，导致元素之间有间距。解决方案是：**letter-spacing** 属性

```css
#box {
  /* 负值可以尽可能的大 */
  letter-spacing: -100px;
}
#left,
#right,
#main {
  letter-spacing: 0;
}
```

### 3. 浮动布局

```css
#box {
  display: block;
  overflow: hidden;
}
#left,
#right,
#main {
  float: left;
  width: 100px;
}
#main {
  width: calc(100% - (100px + 100px));
}
```

左浮动，是按照顺序从左到右排列；右浮动是从右向左排列。

在线代码：[三栏布局](https://codesandbox.io/s/sanlanbuju-phsqz?file=/index.html)
