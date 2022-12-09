# 踩坑记录

这里记录使用 ReactNative 过程中踩过的坑。

## --reset-cache 慎用

在 ReactNative 项目中为 src 文件夹配置别名之后，需要运行 `yarn start --reset-cache` 命令来使修改的配置生效，此时会清除缓存。

当清除缓存之后，你可能发现页面出现了 Bug。比如按钮不能点击，页面不能滚动。此时要重新运行 `yarn run android` 命令安装新的 App 之后，页面才会正常显示。

所以，切记不可乱用 `--reset-cache`。当修改 根组件的路径时，也要重新打包 App。

## pod install 报错

IOS 项目依赖需要使用 cocoapods 安装，但使用 `pod install` 命令时往往会报错。经过踩坑，发现错误大多数都是 GitHub 资源下载失败，常见错误有以下这些：

1. HTTP/2 stream 1 was not closed cleanly before end of the underlying stream

这个错是因为 git 默认使用 HTTP/2 通信协议的问题，将其修改为 http/1.1 即可：

```sh
$ git config --global http.version HTTP/1.1
```

2. 安装依赖卡住不动

这是 GitHub 被墙的原因，如果你有 VPM，点击上面的“复制终端代理命令” 粘贴到命令行，重新运行即可。

## 修改入口文件

默认情况下，React Native 项目的入口我文件是 `index.js`，我使用 TypeScript 所以将它改成了 `index.ts`，结果 gradle 编译找不到路径。

方法，在 `android/app/build.gradle` 文件中修改入口文件：

```java
project.ext.react = [
  enableHermes: true,
  entryFile: "index.ts" // 修改入口文件
]
```
