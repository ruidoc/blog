# Vue3 普通项目，抛弃 Pinia 吧！

大家好，我是杨成功！

最近弄了一个新的 Vue3 项目，页面不多，其中有三四个页面需要共享状态，我几乎条件反射般地安装了 `Pinia` 来做状态管理。

后来一想，我只需要一个仓库，存放几个状态而已，有必要单独接一套 Pinia 吗？

其实不需要，我差点忘记了 Vue3 的一个重要特性，那就是 `组合式函数`。

组合式 API 大家都知道，组合式函数可能大家没有特别留意。但是它功能强大，足矣实现全局状态管理。

## 组合式函数

什么是组合式函数？以下是官网介绍：

> 在 Vue 应用的概念中，“组合式函数”(Composables) 是一个利用 Vue 的组合式 API 来封装和复用有状态逻辑的函数。

从这段介绍中可以看出，组合式函数要满足两个关键点：

1. 组合式 API。
2. 有状态逻辑的函数。

在 Vue 组件中，状态通常定义在组件内部。比如典型的选项式 API，状态定义在组件的 `data()` 方法下，因此这个状态只能在组件内使用。

Vue3 出现之后，有了组合式 API。但对于大部分人来说，只是定义状态的方式从 `data()`变成了 `ref()`，貌似没有多大的区别。

实际上，区别大了去了。

组合式 API 提供的 `ref()` 等方法，不是只可以在 Vue 组件内使用，而是在任意 JS 文件中都可以使用。

这就意味着，组合式 API 可以将 `组件与状态分离`，状态可以定义在组件之外，并在组件中使用。当我们使用组合式 API 定义了一个有状态的函数，这就是组合式函数。

因此，组合式函数，完全可以实现全局状态管理。

举个例子：假设将用户信息状态定义在一个组合式函数中，方法如下：

```js
// user.js
import { ref } from 'vue'

export function useUinfo() {
  // 用户信息
  const user_info = ref(null)
  // 修改信息
  const setUserInfo = (data) {
    user_info.value = data
  }
  return { user_info, setUserInfo }
}
```

代码中的 `useUinfo()` 就是一个组合式函数，里面使用 `ref()` 定义了状态，并将状态和方法抛出。

在 Vue3 组件之中，我们就可以导入并使用这个状态：

```vue
<script setup>
import useUinfo from './user.js';
const { user_info, setUserInfo } = useUinfo();
</script>
```

仔细看组合式函数的使用方法，像不像 React 中的 `Hook`？完全可以将它看作一个 Hook。

在多个组件中使用上述方法导入状态，跨组件的状态管理方式也就实现了。

## 模块化的使用方法

组合式函数在多个组件中调用，可能会出现重复创建状态的问题。其实我们可以用模块化的方法，更简单。

将上方 user.js 文件中的组合式函数去掉，改造如下：

```js
import { ref } from 'vue'

// 用户信息
export const user_info = ref(null)
// 修改信息
export const setUserInfo = (data) {
 user_info.value = data
}
```

这样在组件中使用时，直接导入即可：

```vue
<script setup>
import { user_info, setUserInfo } from './user.js';
</script>
```

经过测试，这种方式是可以的。

使用模块化的方法，也就是一个文件定义一组状态，可以看作是 Pinia 的仓库。这样状态模块化的问题也解决了。

Pinia 中最常用的功能还有 `getters`，基于某个状态动态计算的另一个状态。在组合式函数中用计算属性完全可以实现。

```js
import { ref, computed } from 'vue'

export const num1 = ref(3)

export const num2 = computed(()=> {
 return num1 * num1
}
```

所以思考一下，对于使用 Vue3 组合式 API 开发的项目，是不是完全可以用组合式函数来替代状态管理（Pinia，Vuex）呢？

当然，对于选项式 API 开发的项目，还是乖乖用 Pinia 吧 ～
