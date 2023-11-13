# Taro 插件

Taro 提供了插件化的能力，几乎大部分的平台、框架都是以插件的形式提供支持。插件的核心库仍然是 `@tarojs/service`，提供了两个核心类：`Kernel` 和 `Plugin`。

## Kernel

Kernel 是整个 Taro 插件系统的核心，插件的逻辑都是在这个函数内实现的。一般情况下我们不需要修改这个核心库的代码，有兴趣可以读一下。

## Plugin

Plugin 是真正面向开发者使用的插件类，它向外提供了注册和使用插件的方法，内部通过调用 Kernel 类实现相关逻辑。该类的成员类型如下：

```ts
class Plugin {
  id: string;
  path: string;
  ctx: Kernel;
  register: (hook: IHook) => void;
  registerCommand: (command: ICommand) => void;
  registerPlatform: (platform: IPlatform) => void;
  registerMethod: (...args) => void;
}
```

上面的类成员中，`path` 代表插件文件路径，`ctx` 就是 Kernel 核心类的实例。上面提供的三个命令很有关键，我们分别介绍。

1. registerCommand()

该方法注册一个命令，并提供命令执行的回调函数，我们常用的 `taro build` 命令就是用这个方法注册的，简单写如下：

```js
export default (ctx: IPluginContext) => {
  ctx.registerCommand({
    name: 'build',
    async fn(opts) {
      // 命令的回调函数
    },
  });
};
```

2. registerPlatform()

该方法注册一个 Taro 支持编译的平台插件，比如支持编译小程序的插件就是通过该方法注册，如下：

```ts
export default (ctx: IPluginContext, options) => {
  ctx.registerPlatform({
    name: 'weapp',
    useConfigName: 'mini',
    async fn({ config }) {
      // 插件被调用时的回调函数
    },
  });
};
```

这里也提供了回调函数。注册命令插件后在控制台运行命令会执行回调函数，那么平台插件如何执行回调函数呢，这里需要用到另外一个方法：

```js
ctx.applyPlugins({
  name: 'weapp',
  opts: {},
});
```

可见，在一个插件内可以调用另一个插件，而一般最先执行的插件是命令插件，所以可以在命令插件的回调函数里调用其他插件。比如在前面注册的 `build` 命令中调用平台插件 `weapp`：

```js
export default (ctx: IPluginContext) => {
  ctx.registerCommand({
    name: 'build',
    async fn(opts) {
      // 命令的回调函数
      ctx.applyPlugins({
        name: 'weapp',
        opts: {},
      });
    },
  });
};
```

3. registerMethod()

该方法注册一个方法，并提供一个回调，比较简单直接了。注册之后同样通过 `ctx.applyPlugins()` 来调用方法，如下：

```ts
export default (ctx: IPluginContext) => {
  // 以下两种注册方式一样
  ctx.registerMethod('upload', async (opts) => {});
  ctx.registerMethod({
    name: 'upload',
    async fn(opts) {},
  });
  // 调用方法
  ctx.applyPlugins('upload', '555');
};
```
