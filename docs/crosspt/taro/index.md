# 认识 Taro

Taro 是一个开放式跨端跨框架解决方案，支持使用 React/Vue 等框架来开发小程序、H5、RN 等应用。

现如今市面上端的形态多种多样，Web、React Native、微信小程序等各种端大行其道，但每个端的代码却不尽相同。如果开发一个端就要新写一套代码，成本就会非常之高。

Taro 的目标是用一套代码抹平多端差异，生成多端代码。目前最新版的 Taro3 支持直接使用 React/Vue 语法，而不是旧版的模拟类 React 语法。

## 安装 CLI 工具

创建和运行 Taro 项目需要使用 taro 命令。taro 命令在全局安装 `@tarojs/cli` 工具之后自动生成：

```sh
# 使用 npm 安装 CLI
$ npm install -g @tarojs/cli

# OR 使用 yarn 安装 CLI
$ yarn global add @tarojs/cli
```

安装之后，通过 `taro -v` 命令查看已安装版本。

## 版本锁定

Taro 的版本更新速度很快，因此必须保持 `@tarojs/cli` 的版本和项目依赖的版本保持一致，否则会出现不可预料的异常情况。

升级 CLI 的命令：

```sh
$ taro update self [version]
```

在项目目录下，升级依赖版本与 CLI 一致：

```sh
$ taro update project [version]
```

## Taro UI

Taro UI 是一款基于 Taro 框架开发的多端 UI 组件库，是 Taro 官方推荐的组件库。Taro UI 可适配多端，不过 ReactNative 端暂不支持。

官方文档如下：[文档](https://taro-ui.jd.com/#/docs/introduction)。

Taro3 只能配合使用 `taro-ui@next` 版本，安装如下：

```sh
$ yarn add taro-ui@next
```

注意：Taro UI 默认使用 Sass 预处理器，如果你准备使用 Taro UI 的话，在创建项目时请选择 Sass。
