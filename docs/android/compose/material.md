# Material Design

Compose 天生支持 Material Design，并且提供了 `Material Design Widget` 内置组件来设置应用的样式。

Material Design 的主题通过 `MaterialTheme` 方法提供，将其作为最外层函数，可以在整个应用中，统一设置颜色、背景、字体等，确保界面风格的一致性。

MaterialTheme 围绕 `Color`、`Typography`、`Shape` 三大要素构建。

## Color（颜色）

MaterialTheme 中定义了许多的内置主题色，过 `MaterialTheme.colors` 来访问。当然我们也可以自定义颜色，如下：

- 内置颜色：Color.Gray
- 16 进制颜色：Color(0xff000000)
- HSL 颜色：Color.hsl(180f, 0.5f, 0.3f)

如果要将自定义的颜色在应用内快捷使用，则将颜色绑定在 MaterialTheme 中：

```kotlin
// 定义颜色
val DarkColor = darkColors(
    primary = Color(0xFFBB86FC),
    secondary = Color(0xFF3700B3)
)

// 绑定颜色
MaterialTheme(
  color = DarkColor
)
```

## Typography（排版）

排版是一组自定义的文本样式，可以快捷地修饰字体。

MaterialTheme 中内置了模版的排版样式，当然我们也可以自定义覆盖这些样式，方法如下：

（1）自定义要覆盖的排版，如下：

```kotlin
val Typography = Typography(
    body1 = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp
    )
)
```

（2）在 MaterialTheme 中使用该排版：

```kotlin
MaterialTheme(
  typography = Typography
)
```

## Shape（形状）

Shape 用于定义 Surface 的形状及其阴影。

将某个组件用 Surface 包裹，并设置 shape 参数来设置圆角或阴影。Surface 是一个设置组件外观的函数。

- RectangleShape：默认的矩形形状。
- RoundedCornerShape(5.dp)：可设置的圆角形状。

除此之外，还可以自定义形状。比如定义一个五角形，你需要创建一个类继承 Shape 类，并重写 createOutline() 方法。

## 深色主题

MaterialTheme 中内置的颜色系统，会自适应深色和浅色主题（默认颜色可以修改）。

在手机中，切换系统主题时，MaterialTheme 的颜色会自动切换；如果要在编辑器中预览深色和浅色主题，可以在 `@Preview` 注解添加参数实现：

```kotlin
@Preview(name = "Light Mode") // 浅色主题
@Preview(name = "Dark Mode") // 深色主题
```
