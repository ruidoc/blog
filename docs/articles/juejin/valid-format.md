# 前端架构师神技，三招统一代码风格

本文从代码规范，代码格式化，团队代码自动统一三个方向，介绍代码规范在我们团队的实践应用。

## 大纲预览

本文介绍的内容包括以下方面：

- 认识代码规范
- 制定和统一规范
- 神技一：ESLint
- 神技二：Prettier
- 神技三：VSCode
- 附录：命名和项目结构规范

## 认识代码规范

先来思考两个问题：

1. 什么是代码规范？
2. 为什么需要代码规范？

如果你是一个经验丰富的前端开发，你一定接触过这样的老项目：变量名是 `abc`，`fds` 这种随意起的，或者是 `name1`, `name2` 这种带数字起名，这样的变量不加注释，鬼都不知道它是干什么的。

这类代码就是一种典型的不规范代码。这样的代码除了让我们开发人员情绪暴躁，最重要的问题是，它极大的降低了团队协作的效率和程序质量。

在团队协作过程中，当组内其他人需要使用或 review 你的代码，看到这种情况，除了喷你，还要花费大量时间了解你写的是什么。同时这样非常容易造成变量冲突，带来未知隐患，调试困难等问题，甚至可以看出一个程序员的编码态度和专业程度。

当然，代码规范包含很多方面，变量命名规范只是最基础的规范。不规范的地方越多，程序质量越低，团队协作的效率也就会越低。

了解了不规范的代码以及不规范代码带来的问题，作为前端架构师，我们就要思考三个问题：

1. 如何制定规范？
2. 如何统一团队的规范？
3. 如何检测规范？

## 制定和统一规范

像上面给变量随意乱起名字的情况，在早期的前端项目中非常常见。

因为早期项目规模，团队规模有限，没有命名规范这种意识，随意起名貌似也没有太大的问题，只要不重复就好。但是随着前端项目规模越来越大，复杂度越来越高，不规范带来的问题越来越多，这种规范意识才慢慢的被重视起来。

经过社区的不断发展，协定了命名包含以下几种规范：

- 下划线命名：`user_name`
- 中划线命名：`user-name`
- 小驼峰命名：`userName`
- 大驼峰命名：`UserName`

有了这些规范，开发者们起名字的时候心里就有谱了。而且这些规范目前也被大多数开发者们接受，如果不按照规范命名，很可能会被同事吐槽喽！

当规范成为普遍共识之后，大家按照自己的喜好使用不同的规范，逐渐形成了自己的编码习惯。在一个团队中，每个开发者往往各自有各自的编码习惯。

然而这又成为了问题。再拿变量举例：一个团队中，有的人习惯用下划线命名变量，如 `user_name`；有的人习惯用驼峰命名变量，如 `userName`。这两种命名方式都正确，都符合规范，但是会造成团队的代码风格混乱，无法统一。

那为什么要统一呢？

统一的好处有很多。比如我们统一规定：**命名变量用下划线，命名方法用小驼峰**。那么在团队协作时，大家看到下划线就知道这是一个变量，看到小驼峰就知道这是一个方法。十个人的代码写出来是一个人的风格，不需要了解其他的编码风格，实现无障碍协作。

十个人的代码写出一个人的风格，说起来很理想，但是靠监督和自觉实现几乎是不可能的。

怎么办呢？下面就是本文重点：**祭出实现代码规范的三招神技**。

## 神技一：ESLint

上面说到，团队协作开发项目，由于每个人的编码习惯不同，会写出各种各样的代码。这样的代码又乱又难以维护。

所以我们希望有这样一个工具，可以制定一套比较完整全面的规范，如果大家的编码不符合规范，程序就会警告甚至报错，用这种工具来倒逼团队成员遵守统一的代码风格。

这个工具是有的，我们都听过，就是大名鼎鼎的 **ESLint**

ESLint 有两种能力：

- **检查代码质量**，如是否有已定义但未使用的变量。
- **检查代码风格**，换行，引号，缩进等相关的规范。

这两种能力几乎涵盖了绝大部分代码规范，并且具体规范是可配置的，团队可以定制自己喜欢的代码风格。

定制规范后，项目运行或热更新时，ESLint 就会自动检查代码是否符合规范。

**问**：ESLint 检查与 TypeScript 检查有啥区别？

TypeScript 只会检查`类型错误`，而 ESLint 会检查`风格错误`。

### 尝试 ESLint

首先在项目下安装：

```sh
$ npm install eslint --save-dev
```

然后运行命令初始化配置：`eslint --init`

`eslint` 是一个交互式命令，可以上下切换选择适合项目的选项；完成会生成 `.eslintrc.json` 文件。

### 基本配置

.eslintrc.json 的基本配置如下：

```json
{
  "env": {
    "browser": true,
    "es2021": true,
  },
  "extends": [
    "eslint:recommended"
  ],
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module",
  },
  "rules": {},
};
```

这个基本配置包含了一套默认推荐的配置，定义在 `eslint:recommended` 这个扩展中。

### React 配置

React 在默认配置的基础上，也有一套推荐的语法配置，定义在 `plugin:react/recommended` 这个插件中，如果你的前端框架是 React，要定义 eslint 规范，那么在基本配置上添加下面标记 `+` 号的配置即可：

```json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
+   "plugin:react/recommended"
  ],
  "parserOptions": {
+   "ecmaFeatures": {
+     "jsx": true
+   },
    "ecmaVersion": 12,
    "sourceType": "module"
  },
+ "plugins": [
+   "react"
+ ],
  "rules": {
  }
};
```

### React + TS 配置

若要 React 支持 TS，还要加一些额外配置：

```json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended"
+   "plugin:@typescript-eslint/recommended"
  ],
+ "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "plugins": [
    "react",
+   "@typescript-eslint"
  ],
  "rules": {
  }
};
```

### 代码检查

上面定义好规范之后，我们现在来写一段代码，并执行规范检查。

新建 `index.js` 文件，写入内容：

```js
const a = '13';
function add() {
  return '1';
}
```

从 js 角度讲，这两行代码是没问题的。然后我们运行检查命令：

```sh
$ npx eslint index.js
```

这时会在控制台看到报错：

```sh
2:7   error  'a' is assigned a value but never used  no-unused-vars
4:10  error  'add' is defined but never used         no-unused-vars

2 problems (2 errors, 0 warnings)
```

错误的意思是变量 `a` 和函数 `add` 已声明但未使用，说明代码不符合约定的规范。这种异常也很常见，在脚手架构建的项目中使用 `npm run dev` 和 `npm start` 时就会执行上面的检查命令。

#### 编辑器自动检查

事实上，除了运行命令检查，在编辑器中直接提示错误更友好。

如果你用 vscode，直接搜索插件 `eslint`，安装后就会读取项目根目录的 `.eslintrc.json` 配置自动检查代码。

如果没有配置，则绕过检查。

### ESLint 规范

上面说过，ESLint 可以自定义检查规范，规范定义在 `.eslintrc.json` 配置文件的 rules 对象下。

比如，定义规范，字符串必须使用双引号：

```json
{
  "rules": {
    "quotes": ["error", "double"]
  }
}
```

定义好之后，如果你的代码中字符串使用单引号，ESLint 就会报错。

`quotes` 表示引号规范，是众多规范中的一个，它的值是一个数组。

数组第一项是错误级别，是以下 3 个值之一：

- `"off" or 0` - 关闭规范
- `"warn" or 1` - 警告级别规范
- `"error" or 2` - 错误级别规范

数组第二项才是真正的规范，具体完整的规范参考 [这里](https://eslint.bootcss.com/docs/rules/)

打开上面的网页，打绿钩的表示是已配置的。需要自定义直接写在 rules 里即可。

## 神技二：Prettier

上一步我们用 ESLint 实现了规范的制定和检查。当开发人员完成一段代码保存时，项目会自动执行 `eslint` 检查命令检查代码，检查到异常后输出的控制台，待开发人员修复异常后才能继续开发。

如果你配置的编码规范比较复杂和严格，比如字符串必须单引号，代码结尾必须用分号，换行必须是 2 个 tab 且不可以用空格。像这种很细的规范，大家开发过程中难免会有不符合，这个时候控制台就会频繁报错，开发人员就会频繁修复一个空格一个标点符号，时间久了异常烦人。

正因为如此，在脚手架生成的项目中虽然默认都开启了 ESLint，但是很多人使用不久后觉得烦人，效率低下，所以都手动关闭了 ESLint。

那么，有没有更高效的方法，让大家非常快捷的写出完全符合规范的代码呢？

**有，它便是第二招神技：Prettier**

Prettier 是当前最流行的代码格式化工具，它最主要的作用就是格式化代码。

什么是格式化？上面我们用 ESLint 定制了编码规范，当检测到不规范的代码，提示异常，然后需要我们开发人员按照提示手动修复不规范的地方。

而格式化的威力，是将不规范的代码，按照规范**一键自动修复**。

听起来很振奋人心，我们来试一下。

<!--
比如设置 js 中统一使用单引号代替双引号，有 2 种配置方式：

`方法一`，setting.json 中配置：

```json
{
  "prettier.singleQuote": true,
  "prettier.semi": false
}
``` -->

首先在项目下安装：

```sh
$ npm install prettier --save-dev
```

然后新建 `.prettierrc.json` 文件：

```json
{
  "singleQuote": true,
  "semi": true
}
```

这个配置文件和上面 ESLint 下的 rules 配置作用一致，就是定义代码规范 ——— 没错，Prettier 也支持定义规范，然后根据规范格式化代码。

列一下 Prettier 的常用规范配置：

```json
{
  "singleQuote": true, // 是否单引号
  "semi": false, // 声明结尾使用分号(默认true)
  "printWidth": 100, // 一行的字符数，超过会换行（默认80）
  "tabWidth": 2, // 每个tab相当于多少个空格（默认2）
  "useTabs": true, // 是否使用tab进行缩进（默认false）
  "trailingComma": "all", // 多行使用拖尾逗号（默认none）
  "bracketSpacing": true, // 对象字面量的大括号间使用空格（默认true）
  "jsxBracketSameLine": false, // 多行JSX中的>放置在最后一行的结尾，而不是另起一行（默认false）
  "arrowParens": "avoid" // 只有一个参数的箭头函数的参数是否带圆括号（默认avoid）
}
```

定义好配置后，我们在 `index.js` 文件中写入内容：

```
const a = "13"
function add() {
  return "1"
}
```

然后在终端运行格式化命令：

```sh
$ npx prettier --write index.js
```

格式化之后，再看 index.js 文件变成了这样：

```js
const a = '13';
function add() {
  return '1';
}
```

看到变化了吧，双引号自动变成了单引号，行结尾自动加了分号，刚好与配置文件中定义的规范一致。

**喜大普奔！终于不用再手动修复不规范的代码了，一个命令就能搞定！**

上面是格式化一个文件，当然也支持批量格式化文件。批量格式化通过模糊匹配查找文件，比较常用，建议定义在 script 脚本中，如下：

```js
// package.json
"scripts": {
  "format": "prettier --write \"src/**/*.js\" \"src/**/*.ts\"",
}
```

Prettier 还支持针对不同后缀的文件设置不同的代码规范，如下：

```json
{
  "semi": false,
  "overrides": [
    {
      "files": "*.test.js",
      "options": {
        "semi": true
      }
    },
    {
      "files": ["*.json"],
      "options": {
        "parser": "json-stringify"
      }
    }
  ]
}
```

**问**：ESLint 与 Prettier 有啥区别？

相同点：都可以定义一套代码规范。

不同点：ESLint 会在检查时对不规范的代码提示错误；而 Prettier 会直接按照规范格式化代码。

所以，**ESLint 和 Prettier 定义的规范要一致，不能冲突**。

### Vue 格式化

Vue 的格式化，默认是用另一款插件 `vetur`，在 vscode 中搜索安装即可。

然后就是配置 vetur：

```json
{
  // 用 vetur 来接管 vue 的格式（vetur 对 vue 语法的支持更好）
  "[vue]": {
    "editor.defaultFormatter": "octref.vetur"
  },
  "vetur.format.defaultFormatter.html": "prettyhtml", // vue 中 template 的格式化配置
  "vetur.format.defaultFormatter.js": "esbenp.prettier-vscode", // vue 中 js 的格式化配置
  "vetur.format.defaultFormatterOptions": {
    "prettyhtml": {
      "printWidth": 140,
      "wrap_attributes": "auto" // 属性自动换行
    }
  }
}
```

**注意：**如果使用 vetur 格式化，可能会和 prettier 有冲突。我的方式是直接使用 prettier 格式化 vue：

```json
{
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

然后设置默认格式化方式为 prettier，就可以保持统一了。

## 神技三：VSCode

上面，我们通过 ESLint 和 Prettier 两招神技，实现了代码规范制定，代码规范检查，以及根据规范一个命令格式化代码，使得统一团队代码风格变的非常容易。

然而，突破效率的挑战是没有极限的。这时候又有小伙伴发声了：虽然是容易了，但是检查代码还是得依赖检查命令，格式化代码也得依赖格式化命令，这样总显得不够优雅。

好吧，不够优雅，那还有优雅的解决方案吗？

答案是有。**它就是我们的第三招神技 —— VSCode**

### 强大的插件

VSCode 对我们前端来说都不陌生，是我们日日相伴的开发武器。当前 VSCode 几乎统一了前端圈的编辑器，功能强大，倍受好评。

既然能得到如此广泛的认可，那么就必然有它的优越性。VSCode 除了轻量启动速度快，最强大的是其丰富多样的插件，能满足不用使用者各种各样的需求。

在众多插件中，`ESLint` 就是非常强大的一个。没错，这个插件就是我们前面说到的神技第一招 ESLint 在 VSCode 上支持的同名插件。截图如下：

![eslint-plugin](./images/eslint-plugin.png)

安装了这个插件之后，之前需要在终端执行 eslint 命令才能检查出来的异常，现在直接标记在你的代码上了！

即使是你敲错了一个符号，该插件也会实时的追踪到你错误的地方，然后给出标记和异常提醒。这简直大大提升了开发效率，再也不用执行命令来检查代码了，看谁还说不优雅。

既然编辑器有 ESLint 插件，那是不是也有 Prettier 插件呢？猜对了，当然有插件，插件全名叫 `Prettier - Code formatter`，截图如下，在 VSCode 中搜索安装即可。

![prettier-plugin](./images/prettier-plugin.png)

Prettier 插件安装之后会作为编辑器的一个格式化程序。在代码中右键格式化，就可以选择 Prettier 来格式化当前代码。

如果要想 Prettier 实现自动化，则还需要在编辑器中配置。

### 编辑器配置

VSCode 中有一个用户设置 `setting.json` 文件，其中保存了用户对编辑器的自定义配置。

这个配置非常丰富，详见[官网](https://code.visualstudio.com/docs/getstarted/settings)。首先我们在这个配置当中将 Prettier 设置为默认格式化程序：

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

设置好这一步之后，**重点来了！** 我们再来配置保存文件自动格式化：

```json
{
  "editor.formatOnSave": true
}
```

配好之后，神奇的事情发生了：当你写完代码保存的时候，发现你正在编辑的文件立刻被格式化了。也就是说，无论你的代码按不按照规范写，保存的时候自动帮你格式化成规范的代码。

这一步其实是保存文件的时候自动执行了格式化命令。因为我们上面配置了默认格式化程序为 Prettier，现在又配了保存时格式化，相当于将文件保存和 `prettier` 命令连接了起来。

到这一步，在三大神技的加持之下，我们已经实现了代码的自动检查与自动格式化，现在你编码的时候不需要考虑什么格式规范的问题，只要正常保存，编辑器会自动帮你做好这些事情。

### 共享编辑器配置

上面我们在编辑器经过一顿配置，终于实现了自动格式化。现在我们要把这些设置同步给团队内的其他成员，该怎么办，难道要一个一个再配一遍？

别慌，不用这么麻烦。VSCode 的设置分为两类：

- 用户设置：应用于整个编辑器
- 工作区设置：应用于当前目录/工作区

这两类的配置内容是一模一样的，区别只是优先级的问题。如果你打开的项目目录包含工作区设置，那么这个工作区设置会覆盖掉当前的用户设置。

所以要想将设置同步给团队内的其他成员，我们不需要去改动用户设置，只需要在项目目录下新建一个工作区设置即可。

添加工作区设置方法：在项目根目录下新建 `.vscode/setting.json` 文件，在这里写需要统一的编辑器配置。所以我们把上面的 Prettier 配置写在这里即可实现共享。

## 附录：命名和项目结构规范

上面介绍了代码规范，代码检查和代码格式化，统一代码风格已经很全面了。

在团队开发过程当中，我们也积累了一些并不会写在配置文件里的规范，这些规范在一个团队当中也是非常重要。这部分算是我们的团队规范的分享吧。

主要说两部分：命名规范和项目结构规范。

### 命名规范

命名规范，文章开头也说了，变量的四种命名规范。但是什么地方用哪种规范，我们也是有约定的。

- 变量命名：下划线 `user_id`
- CSS-Class 命名：中划线 `user-id`
- 方法函数命名：小驼峰 `userId`
- JS-Class 命名：大驼峰 `UserId`
- 文件夹命名：中划线 `user-id`
- 文件夹下组件命名：中划线 `user-id`
- 组件导出命名：大驼峰 `UserId`

### 项目结构规范

项目结构规范主要是指 `src` 文件夹下的结构组织。

```sh
|-- src
    |-- index.tsx # 入口文件
    |-- assets # 静态资源目录
    |-- components # 公共组件目录
    |   |-- header
    |   |   |-- index.tsx
    |   |   |-- index.less
    |-- stores # 状态管理目录，与 pages 结构对应
    |   |-- admins
    |   |   |-- index.tsx # 状态文件
    |   |   |-- types.ts  # 定义状态类型
    |   |-- index.tsx
    |-- pages # 页面目录，与 stores 结构对应
    |   |-- admins
    |   |   |-- index.tsx
    |   |   |-- index.less
    |-- request
    |   |-- index.ts # axios 实例，全局请求处理
    |-- router
    |   |-- home.tsx
    |   |-- index.tsx
    |   |-- root.tsx
    |-- styles # 全局样式
    |   |-- common.less
    |   |-- index.less
    |-- utils # 工具目录
        |-- index.ts
```
