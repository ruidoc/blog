# 以 Vuex 为引，一窥状态管理全貌

众所周知，[Vuex](https://vuex.vuejs.org/zh/) 是 Vue 官方的状态管理方案。

Vuex 的用法和 API 不难，官网介绍也简洁明了。得益于此，将 Vuex 快速集成到项目里非常容易。然而正因为用法灵活，很多同学在 Vuex 的设计和使用上反而有些混乱。

其实在使用前，我们不妨暂停一下，思考几个问题：

- 什么是状态管理？
- 我为什么要用 Vuex？
- 组件内部状态和 Vuex 状态如何分配？
- 使用 Vuex 会有哪些潜在问题？

如果你对这些问题模棱两可，那么恭喜你，这篇文章可能是你需要的。

下面请和我一起，从起源开始，以 Vuex 为例，共同揭开状态管理的神秘面纱。

## 大纲预览

本文介绍的内容包括以下方面：

- 状态与组件的诞生
- 需要状态管理吗？
- 单一数据源
- 状态更新方式
- 异步更新？
- 状态模块化
- 模块化的槽点
- 下一步

## 状态与组件的诞生

自三大框架诞生起，它们共有的两个能力彻底暴击了 Jquery。这两个能力分别是：

1. **数据驱动视图**
2. **组件化**

数据驱动视图，使我们告别了只能依靠操作 DOM 更新页面的时代。我们不再需要每次更新页面时，通过层层 find 找到 DOM 然后修改它的属性和内容，可以通过操作数据来实现这些事情。

当然了在我们前端的眼里，数据基本可以理解为存储各种数据类型的 `变量`。在 `数据驱动` 这个概念出现之后，一部分变量也被赋予了特殊的含义。

首先是普通变量，和 JQ 时代没差，仅用来存储数据。除此之外还有一类变量，它们有响应式的作用，这些变量与视图绑定，当变量改变时，绑定了这些变量的视图也会触发对应的更新，这类变量我称之为**状态变量**。

所谓数据驱动视图，严格说就是状态变量在驱动视图。随着 Vue，React 的大力普及之下，前端开发们的工作重心逐渐从操作 DOM 转移到了操作数据，状态变量成为了核心。

状态变量，现在大家似乎更愿意称之为**状态**。我们经常词不离口的状态，状态管理，其实这个状态就是指状态变量。下文提到的状态同样也是指状态变量。

**有了状态之后，组件也来了。**

JQ 时代的前端一个页面就是一个 html，没有“组件”的概念，对于页面中的公共部分，想要优雅的实现复用简直不要太难。所幸三大框架带来了非常成熟的组件设计，可以很容易的抽取一个 DOM 片段作为组件，而且组件内部可以维护自己的状态，独立性更高。

组件的一个重要特性，就是内部的这些状态是对外隔离的。父组件无法访问到子组件内部的状态，但是子组件可以访问父组件显示传过来的状态（Props），并且根据变化自动响应。

这个特性可以理解为状态被模块化了。这样的好处是，不需要考虑当前设置的状态会影响到其他组件。当然了组件状态彻底隔离也是不现实的，必然会有多个组件共享状态的需求，这种情况的方案就是将状态提取到离这些组件最近的父组件，通过 Props 向下传递。

上述共享状态的方案，在通常情况下是没有问题的，也是一种官方建议的最佳实践。

但是如果你的页面复杂，你会发现还是有力不从心的地方。比如：

- 组件层级太深，需要共享状态，此时状态要层层传递。
- 子组件更新一个状态，可能有多个父组件，兄弟组件共用，实现困难。

这种情况下继续使用 “**提取状态到父组件**” 的方法你会发现很复杂。而且随着组件增多，嵌套层级加深，这个复杂度也越来越高。因为关联的状态多，传递复杂，很容易出现像某个组件莫名其妙的更新，某个组件死活不更新这样的问题，异常排查也会困难重重。

鉴于此，我们需要一个更优雅到方案，专门去处理这种复杂状况下的状态。

## 需要状态管理吗？

上一节我们说到，随着页面的复杂，我们在跨组件共享状态的实现上遇到了棘手的问题。

那么有没有解决方案呢？当然有的，得益于社区大佬们的努力，方案还不止一个。但是这些方案都有一个共同的名字，就是我们在两年前讨论非常激烈的 ——— **状态管理**。

状态管理，其实可以理解为**全局状态管理**，这里的状态不同于组件内部的状态，它是独立于组件单独维护的，然后再通过某种方式与需要该状态的组件关联起来。

状态管理各有各的实现方案。Vue 有 Vuex，React 有 Redux，Mobx，当然还有其他方案。但是它们解决的都是一个问题，就是**跨组件状态共享的问题**。

我记得前两年因为 “状态管理” 这个概念的火热，好像成了应用开发不可或缺的一部分。以 Vue 为例，创建一个项目必然会引入 Vuex 做状态管理。但是很多人不知道为什么用，什么时候用，怎么用状态管理，只是盲目跟风，于是后来出现了非常多滥用状态管理的例子。

看到这里，你应该知道状态管理不是必须的。它为什么出现，以及它要解决什么问题，上面基本都说明白了。如果你还没明白，请暂停，从开头再读一遍。不要觉得一个技术方案诞生的背景不重要，如果你不明白它的出现是为了解决什么问题，那么你就无法真正发挥它的作用。

Redux 作者有一句名言：**如果你不知道是否需要 Redux（状态管理），那就是不需要它**。

好了，如果你在用状态管理，或需要使用状态管理帮你解决问题，那我们继续往下看。

## Vuex

Vue 在国内的应用非常广泛，尤其是中小团队，因此大多人接触到的第一个状态管理方案应该就是 Vuex。

那么 Vuex 是如何解决跨组件状态共享的问题的呢？我们一起来探索一下。

### 创建 store

我们上面说到，对于一般的组件共享状态，官方建议“**提取状态到最近的父组件**”。Vuex 则是更高一步，将所有状态提取到了**根组件**，这样任何组件都能访问到。

也许你会问：这样做不是把状态暴露到全局了吗？不就彻底消除模块化的优势了吗？

其实不然。Vuex 这么做的主要目的是为了让所有组件都可以访问到这些状态，彻底避免子组件状态访问不了的情况。Vuex 把所有状态数据都放在一个对象上，遵循**单一数据源**的原则。但是这并不代表状态是堆砌的，Vuex 在这颗单一状态树上实现了自己的模块化方案。

别急，我们一步步来，先看看如何使用 Vuex。

Vuex 是作为 Vue 的插件存在的，首先 npm 安装：

```sh
$ npm install --save vuex
```

安装之后，我们新建 `src/store` 文件夹，在这里放所有 Vuex 相关的代码。

新建 `index.js` 并写入如下代码。这段代码主要的作用就是用 `Vue.use` 方法加载 Vuex 这个插件，然后将配置好的 `Vuex.Store` 实例导出。

```js
import Vue from 'vue';
import Vuex from 'vuex';
// 安装插件
Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {},
});
```

上面导出的实例我们通常称之为 `store`。一个 store 中包含了存储的状态（`state`）和修改状态的函数（`mutation`）等，所有状态和相关操作都在这里定义。

最后一步，在入口文件将上面导出的 store 实例挂载到 Vue 上：

```js
import store from './store';

new Vue({
  el: '#app',
  store: store,
});
```

注意：**挂载这一步不是必须的**。挂载这一步的作用只是为了方便在 .vue 组件中通过 `this.$store` 访问我们导出的 store 实例。如果不挂载，直接导入使用也是一样的。

### 单一数据源（state）

上一步我们用构造函数 `Vuex.Store` 创建了 store 实例，大家至少知道该怎么用 Vuex 了。这一步我们来看看 Vuex.Store 构造函数的具体配置。

首先是 `state` 配置，他的值是一个对象，用来存储状态。Vuex 使用 `单一状态树` 原则，将所有的状态都放在这个对象上，便于后续的状态定位和调试。

比如说我们有一个初始状态 `app_version` 表示版本，如下：

```js
new Vuex.Store({
  state: {
    app_version: '0.1.1'
  }
}
```

现在要在组件中获取，可以这样：

```js
this.$store.state.app_version;
```

但这并不是唯一的获取方式，也可以这样：

```js
import store from '@/store'; // @ 表示 src 目录
store.state.app_version;
```

为什么要强调这一点呢？因为很多小伙伴以为 Vuex 只能通过 `this.$store` 操作。到了非组件内，比如在请求函数中要设置某一个 Vuex 的状态，就不知道该怎么办了。

事实上组件中获取状态还有更优雅的方法，比如 `mapState` 函数，它让获取多状态变得更简单。

```js
import { mapState } from 'vuex'

export default {
  computed: {
    ... // 其他计算属性
    ...mapState({
      version: state => state.app_version
    })
  }
}
```

### 状态更新方式（mutation）

Vuex 中的状态与组件中的状态不同，不能直接用 `state.app_version='xx'` 这种方式修改。Vuex 规定修改状态的唯一方法是提交 `mutation`。

Mutation 是一个函数，第一个参数为 state，它的作用就是更改 state 的状态。

下面定义一个名叫 **increment** 的 mutation，在函数内更新 **count** 这个状态：

```js
new Vuex.Store({
  state: {
    count: 1,
  },
  mutations: {
    increment(state, count) {
      // 变更状态
      state.count += count;
    },
  },
});
```

然后在 .vue 组件中触发 **increment**：

```js
this.$store.commit('increment', 2);
```

这样绑定了 count 的视图就会自动更新。

#### 同步更新

虽然 mutation 是更新状态的唯一方式，但实际上它还有一个限制：**必须是同步更新**。

为什么必须是同步更新？因为在开发过程中，我们常常会追踪状态的变化。常用的手段就是在浏览器控制台中调试。而在 mutation 中使用异步更新状态，虽然也会使状态正常更新，但是会导致开发者工具有时无法追踪到状态的变化，调试起来就会很困难。

再有 Vuex 给 mutation 的定位就是更改状态，只是更改状态，别的不要参与。所谓专人干专事儿，这样也帮助我们避免把更改状态和自己的业务逻辑混起来，同时也规范了函数功能。

那如果确实需要异步更新，该怎么办呢？

#### 异步更新

异步更新状态是一个非常常见的场景，比如接口请求回来的数据要存储，那就是异步更新。

Vuex 提供了 `action` 用于异步更新状态。与 mutation 不同的是，action 不直接更新状态，而是通过触发 mutation 间接更新状态。因此即便使用 action 也不违背 “**修改状态的唯一方法是提交 mutation**” 的原则。

Action 允许在实际更新状态前做一些副作用的操作，比如上面说的异步，还有数据处理，按条件提交不同的 mutation 等等。看一个例子：

```js
new Vuex.Store({
  state: {
    count: 1,
  },
  mutations: {
    add(state) {
      state.count++;
    },
    reduce(state) {
      state.count--;
    },
  },
  actions: {
    increment(context, data) {
      axios.get('**').then((res) => {
        if (data.iscan) {
          context.commit('add');
        } else {
          context.commit('reduce');
        }
      });
    },
  },
});
```

在组件中触发 action：

```js
this.$store.dispatch('increment', { iscan: true });
```

这些就是 action 的使用方法。其实 action 最主要的作用就是请求接口，拿到需要的数据，然后触发 mutation 修改状态。

其实这一步在组件中也可以实现。我看过一些方案，常见的是在组件内写一个请求方法，当请求成功，直接通过 `this.$store.commit` 方法触发 mutation 来更新状态，完全用不到 action。

难道 action 可有可无吗？

也不是，在特定场景下确实需要 action 的，这个会在下一篇说。

### 状态模块化（module）

前面讲过，Vuex 是单一状态树，所有状态存放在一个对象上。同时 Vuex 有自己的模块化方案，可以避免状态堆砌到一起，变的臃肿。

Vuex 允许我们将 store 分割成模块（module），每个模块拥有自己的 state、mutation、action。虽然状态注册在根组件，但是支持模块分割，相当于做到了与页面组件平级的“状态组件”。

为了区分，我们将被分割的模块称为**子模块**，暴露在全局的称为**全局模块**。

我们来看基础用法：

```js
new Vuex.Store({
  modules: {
    user: {
      state: {
        uname: 'ruims',
      },
      mutation: {
        setName(state, name) {
          state.name = name;
        },
      },
    },
  },
});
```

上面定义了 `user` 模块，包含了一个 state 和一个 mutation。在组件中使用方法如下：

```js
// 访问状态
this.$store.state.user.uname;
// 更新状态
this.$store.commit('setName');
```

大家发现了，访问子模块的 state 要通过 `this.$store.state.[模块名称]` 这种方式去访问，触发 mutation 则与全局模块一样，没有区别。

action 与 mutation 原理一致，不细说。

#### 命名空间

上面说到，子模块触发 mutation 和 action 与全局模块一致，那么假设全局模块和子模块中都有一个名为 `setName` 的 mutation。在组件中触发，哪个 mutation 会执行呢？

**经过试验，都会执行**。官方的说法是：为了多个模块能够对同一 mutation 或 action 作出响应。

其实官方做的这个兼容，我一直没遇到实际的应用场景，反而因为同名 mutation 导致误触发带来了不少的麻烦。可能官方也意识到了这个问题，索引后来也为 mutation 和 action 做了模块处理方案。

这个方案，就是命名空间。

命名空间也很简单，在子模块中加一个 `namespaced: true` 的配置即可开启，如：

```js
new Vuex.Store({
  modules: {
    user: {
      namespaced: true,
      state: {},
    },
  },
});
```

开启命名空间后，触发 mutation 就变成了：

```js
this.$store.commit('user/setName');
```

可见提交参数由 `'[mutation]'` 变成了 `'[模块名称]/[mutation]'`。

## 模块化的槽点

上面我们介绍了 Vuex 的模块化方案，将单一状态树 store 分割成多个 module，各自负责本模块状态的存储和更新。

模块化是必要的，但是这个模块的方案，**用起来总觉得有点别扭**。

比如，总体的设计是将 store 先分模块，模块下在包含 state，mutation，action。

那么按照正常理解，访问 user 模块下 state 应该是这样的：

```js
this.$store.user.state.uname;
```

但是实际 API 却是这样的：

```js
this.$store.state.user.uname;
```

这个 API 仿佛是在 state 中又各自分了模块。我没看过源码，但从使用体验上来说，这是别扭一。

**除 state 外，mutation，action 默认注册在全局的设计，也很别扭**。

首先，官方说的多个模块对同一 mutation 或 action 作出响应，这个功能暂无找到应用场景。并且未配 namespace 时还要保证命名唯一，否则会导致误触发。

其次，用 namespace 后，触发 mutation 是这样的：

```js
this.$store.commit('user/setName');
```

这个明显是将参数单独处理了，为什么不是这样：

```js
this.$store.user.commit('setName');
```

总体感受就是 Vuex 模块化做的还不够彻底。

### 为什么吐槽

上面说的槽点，并不是为了吐槽而吐槽。主要是感觉还有优化空间。

比如 `this.$store.commit` 函数可以触发任何 mutation 来更改状态。如果一个组件复杂，需要操作多个子模块的状态，那么就很难快速的找出当前组件操作了哪些子模块，当然也不好做权限规定。

我希望的是，比如在 A 组件要用到 `b, c` 两个子模块的状态，不允许操作其他子模块，那么就可以先将要用到模块导入，比如这样写：

```js
import { a, b } from this.$store
export default {
  methods: {
    test() {
      alert(a.state.uname) // 访问状态
      a.commit('setName')// 修改状态
    }
  }
}
```

这样按照模块导入，查询和使用都比较清晰。

## 下一步

前面我们详细介绍了状态管理的背景以及 Vuex 的使用，分享了关于官方 API 的思考。相信看到这里，你已经对状态管理和 Vuex 有了更深刻的认识和理解。

然而本篇我们只介绍了 Vuex 这一个方案，状态管理的其他方案，以及上面我们的吐槽点，能不能找到更优的实现方法，这些都等着我们去尝试。

下一篇文章我们继续深挖状态管理，对比 Vuex 和 React，Fluter 在状态管理实现上的差异，然后在 Vue 上集成 Mobx，打造我们优雅的应用。

## 往期精彩

本[专栏](https://segmentfault.com/blog/ruidoc)会长期输出前端工程与架构方向的文章，已发布如下：

- [前端架构师的 git 功力，你有几成火候？](https://segmentfault.com/a/1190000040879546)
- [前端架构师神技，三招统一代码风格](https://segmentfault.com/a/1190000040948561)

如果喜欢我的文章，请点赞支持我吧！也欢迎关注我的专栏。

**声明：** 本文原创，如有转载需求，请加微信 `ruidoc` 联系授权。
