# React 面试题

PC 管理系统：基于 RBAC 角色访问控制，为角色分配权限，为用户绑定角色，角色之间可以继承。权限控制：基于路由的控制（多层路由），基于更细粒度的按钮级控制（级别）

## 基础题目

React18 新增特性：

1. 并发模式：支持暂停、继续渲染
2. 根组件 createRoot() 替代 render()，使 setState()全部异步更新
3. 自动批处理：多次调用 setState() 合并为一次
4. 取消对 IE 的支持
5. 严格模式，默认执行两次

常见 hook：

1. useState()：定义函数组件状态。
2. useEffect()：执行副作用。
3. useContext()：获取 React 上下文。
4. useCallback()：避免重复创建函数，提高性能。
5. useMemo()：避免重复计算结果，提高性能。
6. useRef()：返回一个引用值。

常见组件：

1. `PureComponent`：会浅层比较 props 和 state，没有变化不会重新渲染。
2. React.lazy 和 `Suspense`：组件懒加载的方式。

Fiber 架构：将虚拟 DOM 从树结构变成链表结构，存储父子、兄弟节点的引用，可以暂停、恢复渲染。

错误边界处理：使用 `ErrorBoundary` 组件包裹组件。

## React 组件的渲染流程

1. 创建组件实例，初始化状态。
2. 创建虚拟 DOM，生成真实 DOM，渲染页面。
3. 状态更新（props 或 state）时，重新渲染组件。
4. 调用 render 方法，生成新的虚拟 DOM 树。
5. 比较新旧虚拟 DOM 树的差异（diff）。
6. 更新真实 DOM。
7. 触发 useEffect() 生命周期。

## 高阶组件

高阶组件（HOC）是一种`函数`，接受一个组件作为参数，并返回一个新的组件。

高阶组件的作用：

1. 代码复用（逻辑服用）
2. 功能增强（）
3. 状态管理（共享状态）

## Mobx

1. State(状态)
2. Actions(动作)
3. Derivations(派生)

定义一个 class，让所有的属性都变成 State，可以使用 `makeAutoObservable` 方法：

```js
constructor() {
  makeAutoObservable(this)
}
```

Derivations 分两类：

1. Computed(计算属性）：通过 getter 方法标记一个纯函数。
2. Reactions(副作用)：类似于监听器，执行 UI 更新或请求等副作用。

如果在 React 中，使用 `mobx-react` 包来创建 UI 自动更新的副作用：

1. 使用 observer 包裹组件函数。
2. 使用 `useLocalObservable` 加载状态（创建局部可观察对象，使全组件生命周期生效）
