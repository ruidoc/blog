# React Native 导航

React Native 导航类似于 React 中的路由管理，主要负责页面之间的跳转。但不同于 Web 的是，原生 App 的导航要复杂的多，React Native 也提供了非常多的工具来实现这些功能。

官方推荐使用 [React Navigation](https://reactnavigation.org/) 来管理 React Native 应用的导航。首先安装 React Navigation 的核心库：

```sh
$ yarn add @react-navigation/native
```

导航功能主要是对屏幕的操作和处理，因此它还依赖两个与屏幕有关的第三方库，我们安装如下：

```sh
$ yarn add react-native-screens react-native-safe-area-context
```

安装之后，为了使 `react-native-screens` 生效，还要在原生代码处配置。

安卓端配置方法：打开 `android/app/src/main/java/<your package name>/MainActivity.java` 文件，在大约 29 行添加以下代码：

```java
@Override
protected void onCreate(Bundle savedInstanceState) {
  super.onCreate(null);
}
```

并且在这个文件顶部导入包：

```java
import android.os.Bundle;
```

在 IOS 端，执行以下命令即可：

```sh
$ npx pod-install ios
# 等同于
$ cd ios && pod install
```

至此配置部分已经完毕，接下来看如何使用。

## NavigationContainer

使用 React Navigation 管理页面导航，需要把 NavigationContainer 组件包裹在根组件的最外层，如下：

```js
import { NavigationContainer } from '@react-navigation/native';
const App = () => {
  return (
    <NavigationContainer>
      <View></View>
    </NavigationContainer>
  );
};
```

添加之后，我们就可以在页面中使用导航器了。

## 导航器 native-stack

React Navigation 导航功能分为两个部分 ——— 核心库和导航器。核心库就是开始安装的 `@react-navigation/native` 模块，主要提供了导航的基本通用能力。

导航器是指我们如何使用导航，React Navigation 提供了三种导航方式，分别是：

- 顶部导航。
- 底部标签导航。
- 抽屉导航。

每种导航方式都有自己的第三方库，我们使用最基础的顶部导航，就要安装它的实现库 `@react-navigation/native-stack`：

```sh
$ yarn add @react-navigation/native-stack
```

安装之后，就可以像 React Router 一样配置导航，当然了导航配置要在 NavigationContainer 之内，方式如下：

```js
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '@/pages/home';
import LoginScreen from '@/pages/login';

const Stack = createNativeStackNavigator(); // 顶部导航实例

const App = () => {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={ScreenOptions}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};
```

代码中使用导航命名的方式配置了 `Home` 和 `Login` 两个导航，并指向了对应的组件。配置项 initialRouteName 表示默认展示的导航页。

导航中的 screenOptions 选项表示导航配置，可配置顶部导航的样式，实现自定义导航。
