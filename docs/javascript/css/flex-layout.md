---
group:
  title: CSS
  path: /css
  order: 6
order: 1
---

# Flex 弹性布局

Flex 是 Flexible Box 的缩写，意为"弹性布局"，是现代最流行的布局方式。

微信小程序 和 flutter 就是用的这种布局思路。

### 两个角色

Flex 布局主要有两个角色：

- flex 容器（flex-container）
- flex 子项（flex-item）

把一个元素设置为 flex 容器，那么容器下面的子元素就是 `flex-item`。

#### 容器设置方法

块级元素设置方法：

```css
.box {
  display: flex;
}
```

行内元素设置方法：

```css
.box {
  display: inline-flex;
}
```

两者的区别是： `flex` 会填充父容器，而 `inline-flex` 会包裹子元素，被子元素撑开。

> 设为 Flex 布局以后，子元素的 `float`、`clear` 和 `vertical-align` 属性将失效。

### 容器的属性

先把所有属性罗列出来：

1. flex-direction
2. flex-wrap
3. flex-flow
4. justify-content
5. align-items
6. align-content

#### flex-direction

容器有两根轴：主轴（main axis）和交叉轴（cross axis），默认主轴是水平方向。

flex-direction 就是设置主轴的方向。

```less
.box {
  flex-direction: row; // 默认
}
```

可能有 4 个值：

- row（默认值）：主轴为水平方向，起点在左端。
- row-reverse：主轴为水平方向，起点在右端。
- column：主轴为垂直方向，起点在上沿。
- column-reverse：主轴为垂直方向，起点在下沿。

#### flex-wrap

默认情况，所以项目都排在主轴上。`flex-wrap` 属性定义，如果一条轴线排不下，如何换行。

```less
.box {
  flex-wrap: nowrap | wrap | wrap-reverse;
}
```

可能有 3 个值：

- nowrap：不换行
- wrap：换行，新行在下方
- wrap-reverse：换行，新行在上方

#### flex-flow

`flex-direction` 属性和 `flex-wrap` 属性的简写形式，默认值为 `row nowrap`

```less
.box {
  flex-flow: <flex-direction> <flex-wrap>;
}
```

#### justify-content

设置项目在主轴上的对齐方式。

```less
.box {
  justify-content: flex-start | flex-end | center | space-between | space-around;
}
```

可能有 5 个值：

- flex-start（默认值）：左对齐
- flex-end：右对齐
- center：居中对齐
- space-between：两端对齐
- space-around：每个项目两侧的间隔相等。

#### align-items

设置项目在交叉轴上的对齐方式。

```less
.box {
  align-items: flex-start | flex-end | center | baseline | stretch;
}
```

可能有 5 个值：

- flex-start：起点对齐
- flex-end：终点对齐
- center：居中对齐
- baseline：项目的第一行文字的基线对齐
- stretch（默认值）：占满整个容器的高度

### 子项的属性

先把所有属性罗列出来：

1. order
2. flex-grow
3. flex-shrink
4. flex-basis
5. flex
6. align-self

#### order

设置子项的排列顺序。数值越小，排列越靠前，默认为 0

```less
.item {
  order: <number>;
}
```

#### flex-grow

设置子项的放大比例，默认为 0，即如果存在剩余空间，也不放大。

```less
.item {
  flex-grow: <number>; // default 0
}
```

如果值不为 0，那么子项会按该值的比例分配剩余空间。

#### flex-shrink

设置子项的缩小比例，默认为 1，即如果空间不足，该子项将缩小。

```less
.item {
  flex-shrink: <number>; // default 1
}
```

在主轴上排列的项目，如果总宽度超出容器宽度且容器没有设置换行的话，就会等比缩小。

阻止缩小怎么办？设置 `flex-shrink: 0`

#### flex-basis

分配多余空间之前，flex-item 占据的主轴空间。默认值为 auto，即项目的本来大小

```less
.item {
  flex-basis: <length> | auto; /* default auto */
}
```

#### flex

`flex-grow`, `flex-shrink` 和 `flex-basis` 三个属性的简写，默认值为 0 1 auto。后两个属性可选。

```less
.item {
  flex: none | [ < 'flex-grow' > < 'flex-shrink' >? || < 'flex-basis' > ];
}
```

该属性有两个快捷值：`auto (1 1 auto)` 和 `none (0 0 auto)`。

#### align-self

设置单个子项和其他子项不一样的对齐方式，即覆盖容器的 `align-item` 属性值。
