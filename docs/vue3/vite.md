# optimizeDeps

optimizeDeps 选项用于自定义预构建规则。

## 预构建原理

当使用 `vite serve` 运行一个 Vite 项目时，Vite 会从入口文件（默认是 index.html）开始抓取项目的依赖项并执行编译，这个编译的过程被称为“预构建”，而依赖关系则是根据模块间的导入自动实现的。

Vite 的预构建默认只会针对第三方模块，也就是 node_modules 文件夹下的模块执行，执行预构建主要内容就是将 CommonJS 模块转换成 ESM。构建后的模块，会缓存在 `node_modules/.vite/deps` 文件夹下。

假设我们在项目中导入著名的时间处理模块 `dayjs`，该模块不是标准的 ESM，因此项目运行时 Vite 会对其执行预构建，并将构建后的 ESM 版的 dayjs.js 输出到 node_modules/.vite/deps 目录下。后面再次引入 dayjs 时，将不在执行预构建，直接使用 node_modules/.vite 下缓存的 ESM 模块。

但是如果在源码目录（src 目录）下定义一个 CommonJS 模块并导入，Vite 不会执行预构建，会直接报错，要求我们使用 ESM 语法。

## 修改依赖

有时候我们可能需要修改依赖关系，比如在 node_modules 外添加其他链接，或者排除某些 ESM 类型的依赖性，这时就要用到依赖优化。

依赖优化通过 optimizeDeps 配置项来实现，可以手动指定执行预构建的范围。optimizeDeps.include 表示要包含的依赖，optimizeDeps.exclude 表示要排除的依赖，它们的值都是一个数组，可以添加多个需要匹配的文件或目录路径。

当项目特别大执行速度变慢时，可以通过配置 exclude 将构建范围缩小，这样构建的代码量变小，构建速度自然也就会提高。includes 可以添加自动依赖项不能识别的依赖，这种方式可以让某些文件（如项目目录之外的文件夹）强制执行预构建。

optimizeDeps 是性能优化项，负责修改依赖预构建的规则。
