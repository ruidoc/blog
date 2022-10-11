# 移动端特性

### 1px 问题

问题：**在一些 Retina 屏幕 的手机上，1px 会变得很粗。**

原因很简单 —— CSS 中的 1px 并不等于移动设备上的 1px。

在 JS 中可以获取到它们的比例：

```js
window.devicePixelRatio = 设备的物理像素 / CSS像素。
```

在 Retina 屏幕 下，这个值为 2 ，即 1 个 css 像素需要 2 个物理像素来渲染。此时，就会发生变粗的情况。

解决的原则是：边框用 1 个物理像素渲染，而不是 2 个。

那怎么办呢？

#### 思路一：直接写 0.5px

没错，1 个 css 像素需要 2 个物理像素渲染，0.5 个 css 像素不就对应 1 个物理像素了吗？符合原则。

不过，这个方案只适用于 IOS8 及以上的版本，安卓则直接不兼容

#### 思路二：伪元素先放大后缩小

设置目标元素为 relative，::after 伪元素为 absolute

::after na 为 1 像素，然后利用 CSS 的缩放能力缩小一半，正好实现了一像素边框：

```css
#container {
  position: relative;
}

#container::after {
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  width: 200%;
  height: 200%;
  border: 1px solid #333;
  transform: scale(0.5);
  transform-origin: left top;
  content: '';
}
```

上面是全部边框的设置方法，还有单个边框设置方法：

```css
#container::after {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 1px;
  background: #333;
  transform: scaleY(0.5);
  content: '';
}
```

查看源码：[一像素边框](https://codesandbox.io/s/yixiangsubiankuang-s5q1v?file=/index.html)

#### 思路三：viewport 缩放来解决

这是个通用方案，全页面缩放 0.5 倍：

```html
<meta
  name="viewport"
  content="initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5, user-scalable=no"
/>
```
