# CSS 工程化

首先，CSS 工程化是为了解决哪些问题：

1. 宏观设计：如何实现模块化？
2. 编码优化：如何结构清晰？如何复用类名和通用属性？
3. 构建：打包效果最优
4. 可维护性：如何修改时成本最小

从这四个方面结合开发经验思考。至少有三个点：

- 预处理器：Less、 Sass 等；
- 重要的工程化插件： PostCss；
- Webpack loader 等；

#### 预处理器：为什么要用预处理器？它的出现是为了解决什么问题？

预处理器于 CSS，就相当于 React，Vue 于 JS。

![DB94C1EF-648E-4F43](../image/DB94C1EF-648E-4F43-90DD-918DE8A0337A.png)

预处理器的代表就是 LESS 和 SASS，他们普遍具有这样的特性：

- 嵌套代码的能力
- 支持定义 css 变量
- 提供计算函数
- 允许 extend 和 mixin；
- 支持循环语句
- 支持模块化的引用

#### PostCss：PostCss 是如何工作的？我们在什么场景下会使用 PostCss？

CSS 世界的 PostCss，相当于 JS 世界里的 Babel。

作用就是将先进的 CSS 语法转换为浏览器支持的语法。而且它有强大的插件机制，支持扩展。

高频的使用场景如下：

- 提高 CSS 代码的可读性
- Autoprefixer 自动增加浏览器前缀
- 面向未来：编译 CSS next 代码

#### Webpack 能处理 CSS 吗？如何实现？

首先，webpack 是面向 JS 的，它本身只支持打包 js。

但是，Webpack 在 loader 的支持下，可以处理 css，image

Webpack 中操作 CSS 需要使用的两个关键的 loader：css-loader 和 style-loader

- css-loader：导入 CSS 模块，对 CSS 代码进行编译处理；
- style-loader：创建 style 标签，把 CSS 内容写入标签
