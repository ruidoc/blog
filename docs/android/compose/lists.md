# 列表与循环

涉及到列表的功能，必然少不了数据循环。Compose 提供了 `LazyColumn` 和 `LazyRow` 两个函数，分别表示纵向列表和横向列表，且支持循环功能。

从名称也可以看出来，“Lazy” 表示懒加载，对于长列表有性能优化。举例如下：

```kotlin
LazyColumn {
    items(messages) { message ->
        Text(text = message)
    }
}
```

上述代码中，LazyColumn 包含一个 `items` 子项，它接收一个列表数据（messages）为参数，然后每个列表项返回一个 Text 文本。

其中 messages 是可变数据，传入不同的数据会渲染出不同的内容。

## 为列表绑定数据

首先需要定义一个变量，用于保存当前界面的状态。

我们希望当状态改变时，页面也会自动更新（Compose 称之为“重组”）。这时需要借助 `remember` 和 `mutableStateOf` 两个函数来实现，如下：

```kotlin
val isChecked = remember { mutableStateOf(false) }
```

remember 函数的作用是 jizzhu 缓存计算结果，重用组件的状态，提高渲染性能。

mutableStateOf 函数用于创建一个可变的状态对象，与可组合函数结合使用时，可提供响应式的能力。

> mutableStateOf 与 Vue3 的 ref() 函数作用基本一致。

最后，将状态绑定到可组合函数中，如下：

```kotlin
LazyColumn {
    items(messages) { message ->
        Text(text = if(isChecked) "已选中" else "未选中" + message)
    }
}
```

## 列表动画

为列表添加动画可以增加交互的趣味性。动画常用的两个函数：

- animateColorAsState：颜色变化动画。
- animateContentSize：大小变化动画。

容器大小动画可以直接通过 Modifier 指定，如下：

```kotlin
Surface(
    modifier = Modifier.animateContentSize()
)
```

而颜色变化动画，需要自定义一个变量指定，如下：

```kotlin
val color = animateColorAsState(
    if (1 > 0) MaterialTheme.colors.primary else MaterialTheme.colors.surface
)
```
