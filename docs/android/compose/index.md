# Jetpack Compose 简介

Jetpack Compose（下文简称 Compose）是用于构建原生 Android 界面的新工具包。它使用更少的代码、强大的工具和直观的 Kotlin API，可以帮助您简化并加快 Android 界面开发。

在前端领域，React 的 `声明式 UI` 一直备受好评，Compose 与 React 非常相似。如果你熟悉 React，掌握 Compose 会更加轻松。

如果要在 Activety 中使用 Compose，必须继承 `ComponentActivity` 类，并且通过 `setContent` 方法来指定入口组件（可组合函数）。

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            Text("Hello world!")
        }
    }
}
```

## 可组合函数

Compose 通过可组合函数来描述 UI 页面，允许绑定数据。可组合函数无附加逻辑、不需要返回，通过 `@Composable` 注解来标识。

```kotlin
@Composable
fun TestName(name: String) {
    Text(text = "Hello $name!")
}
```

系统提供的可组合函数有 `Text`、`Images` 等等，我们也可称之为组件。这些大大小小的组件构成了不同的 UI 界面。

## 实时预览

React 有热更新的功能，Compose 有吗？遗憾的是目前没有，页面更新还是需要重新安装。不过 Compose 提供了在 IDE 中实时预览的功能。

预览需要一个单独的、使用 `@Preview` 注解的可组合函数，且不接受参数，如下：

```kotlin
@Preview
@Composable
fun PreviewComp() {
    TestName("世界")
}
```

现在渲染 PreviewComp 函数，并更改函数的代码，即可在 IDE 中实时预览。
