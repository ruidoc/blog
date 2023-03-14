# @tarojs/cli

这个包承接 Taro 下所有的命令行工具，在终端执行命令时首先进入这个包。

源码位置：`/packages/taro-cli`。

## 从命令开始

不管是创建还是运行 Taro 项目，都必须在控制台执行 `taro` 命令，该命令从何而来呢？

如果你了解 npm，就知道命令一般定义在 package.json 文件的 `bin` 属性下。我们查看该包的 package.json 文件，发现命令定义如下：

```json
{
  "bin": {
    "taro": "bin/taro"
  }
}
```

说明当运行 taro 命令时，相当于执行了 `bin/taro` 这个文件，我们看这个文件内写了什么。

## 可执行文件 bin/taro

这个文件里的内容非常简单，如下：

```js
require('../dist/util').printPkgVersion();

const CLI = require('../dist/cli').default;
new CLI().run();
```

代码中的 `dist` 表示打包后的文件夹，原文件夹一般是 `src`，因此上面首先得执行了 `src/util` 下的 printPkgVersion() 方法，该方法打印 Taro 的版本号。

查看源码可知，实际的文件是 `src/util/index.ts`。

接着导入模块 `src/cli`，源码对应的是 `src/cli.ts`。该模块导出一个类，我们执行了类下的 run() 方法。

### cli.run() 方法

查看源码，该方法内逻辑稍微复杂，我们只介绍主要的逻辑。

1. 解析命令行参数，并根据解析结果设置一些环境变量，如 process.env.TARO_ENV。
2. 解析项目代码中的配置文件，生成适合 Taro 的配置结构。

解析配置时需要用到核心库 Kernel，关键代码如下：

```js
import { Kernel } from '@tarojs/service';
const kernel = new Kernel({
  appPath,
  presets: [path.resolve(__dirname, '.', 'presets', 'index.js')],
  plugins: [],
});
kernel.optsPlugins ||= [];
```

kernel 就是一个拓展了项目配置的配置对象，包含项目配置文件，后面会频繁用到。

1. 根据配置解析出需要加载的插件，并添加到 kernel.optsPlugins 选项中。

以命令 `taro build --type weapp` 为例，结合项目配置文件，会解析出以下三个关键信息：

```js
{
  command: 'build', // 自定义命令
  platform: 'weapp' // 编译的目标平台
  framework: 'react' // 在 config/index.js 中定义的框架
}
```

根据这三个关键信息，Taro 首先要注册 `build` 命令，对应执行文件是：

```
taro/packages/taro-cli/src/presets/commands/build.js
```

然后需要加载两个插件，分别是：

```
@tarojs/plugin-platform-weapp
@tarojs/plugin-framework-react
```

将它们添加到 kernel.optsPlugins 选项中，如下：

```js
{
  kernel: {
    optsPlugins: [
      'taro/packages/taro-cli/src/presets/commands/build.js',
      '@tarojs/plugin-platform-weapp',
      '@tarojs/plugin-framework-react',
    ];
  }
}
```

插件配置完成之后，下一步就要注册命令并加载插件了，这个逻辑在 `kernel.run()` 方法中实现。

## Kernel 插件内核类

该类的逻辑比较多，详细的实现还没看明白。但是主要的逻辑就是：解析预设（presets）和插件（plugins），主要是插件注册相关的逻辑，创建全局插件上下文等。

### kernel.run() 方法

在 CLI 阶段解析好参数之后，最后会调用这个方法，开始注册插件。
