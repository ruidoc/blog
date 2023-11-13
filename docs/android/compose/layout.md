# 页面布局

学习了基本的可组合函数之后，下面就要进入页面布局了。

默认情况下，在可组合函数中声明了两个组件，这两个组件会 `互相重叠`，如下：

```kotlin
@Composable
fun TestName() {
    Text(text = "Hello")
    Text(text = "World")
}
```

关于 Compose 的布局，我们可以参考前端的 Flex 布局，两者原理相同。

## 线性布局

线性布局是基本的布局，主要是 `Row(水平)` 和 `Column(垂直)` 两个函数实现。

```kotlin
@Composable
fun TestName() {
    Row {
      Image(
        painter = painterResource(R.drawable.profile_picture),
      )
      Column {
        Text(text = "Hello")
        Text(text = "World")
      }
    }
}
```

当然，Row 和 Column 两个函数提供了参数，用于修饰布局盒子、子元素对其方式等。

其中 `modifier` 表示修饰符，可以修饰盒子大小、布局、外观、添加点击事件等，支持链式调用：

```kotlin
Row(
    modifier = Modifier
      .background(color = Color(0xffabcded))
      .border(width = 1.dp, color = Color.Cyan)
      .padding(all = 18.dp)
    ) {
        Text("修饰背景")
    }
```
