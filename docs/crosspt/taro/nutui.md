# 组件库 Nutui-React

Nutui 是由京东团队开发的 Vue 移动端组件库，Nutui-React 则是该组件库的 React 实现版。Nutui-React 最大的特点是支持在 Taro 中使用。

在早期使用 Taro 框架时我们使用官方的 TaroUI 组件库，然而该组件库疏于维护，我们一直在找替代方案。经过验证 Nutui-React 是一个非常不错的选择。

Nutui-React Taro 版文档从[这里](https://nutui.jd.com/taro/react/1x/#/zh-CN/component/button)查看。

## 安装 Nutui-React

假设已经创建好 Taro 项目，我们要让 Taro 支持 html 标签。

1. 安装插件 @tarojs/plugin-html 并配置

```sh
$ yarn add @tarojs/plugin-html
```

```js
// config/index.js
config = {
  // ...
  plugins: ['@tarojs/plugin-html'],
};
```

2. 安装 Nutui 并使用

```sh
$ yarn add @nutui/nutui-react-taro
```

安装之后在页面中引入组件并使用：

```js
import { Button } from '@nutui/nutui-react-taro';
return (
  <View>
    <Button type="primary" className="btn">
      主要按钮
    </Button>
  </View>
);
```

3. 加载组件样式

使用 Nutui 组件时默认不会加载样式，我们需要在 Taro 配置文件中导入。Nutui 样式使用 sass 开发，引入方式如下：

```js
// config/index.js
sass: {
  data: `@import "@nutui/nutui-react-taro/dist/styles/variables.scss";`;
}
```

同时还要使用 babel-plugin-import 插件实现样式自动加载。首先安装：

```sh
$ yarn add babel-plugin-import
```

然后在 `babel.config.js` 中配置：

```js
plugins: [
 [
   'import',
   {
     libraryName: '@nutui/nutui-react-taro',
     libraryDirectory: 'dist/esm',
     style: true,
     camel2DashComponentName: false,
   },
   'nutui-react-taro',
 ],
],
```

## 其他配置

为了防止在小程序将 Nutui 组件样式中的 px 转换为 rpx，还要添加以下配置：

```js
// config/index.js
pxtransform: {
  config: {
    selectorBlackList: ['nut-']
  }
},
```
