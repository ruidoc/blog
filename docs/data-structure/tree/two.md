---
order: 2
---

# 树的遍历

大家好，我是杨成功。

上一篇我们介绍了树的概念，什么是二叉树与二叉搜索树，并实现了一个二叉搜索树的类，然后完成了节点插入的功能。

如果你还不清楚树是什么，请看上一篇：[怒肝 JavaScript 数据结构 — 树与二叉树](https://juejin.cn/post/7090562723045441543)

这一篇我们继续介绍二叉搜索树，主要探讨如何遍历一棵树。树的遍历有多种方式，我们要了解其不同之处，再对上篇添加的节点进行查找。

## 树的遍历

我们学过数组，链表的遍历，它们的共同点是都属于一维遍历。也就是说元素都在一条线上，我们从第一个元素开始，一个接一个向后遍历即可找到所有元素。

但是树的遍历不是一维的，它有很多分叉，因此遍历起来会复杂一些。

树的遍历有三种方式：

- `中序遍历`
- `先序遍历`
- `后序遍历`

### 中序遍历

中序遍历是以从小到大的顺序访问二叉搜索树（BST）所有节点的遍历方式，该方式常常用来对树进行排序。

我们来看怎么实现：

```js
inOrderTraverse(callback) {
  this.inOrderTraverseNode(this.root, callback)
}
```

`inOrderTraverse` 方法接受一个回调函数，这个回调函数的作用是对每个遍历到的节点进行操作。因为遍历树用到递归，所以我们定义了 `inOrderTraverseNode` 作为递归函数，从根节点开始遍历。

```js
inOrderTraverseNode(node, callback) {
  if(node != null) {
    this.inOrderTraverseNode(node.left, callback)
    callback(node.key)
    this.inOrderTraverseNode(node.right, callback)
  }
}
```

这个函数首先判断传入的 node 是否为空，不为空才进行遍历，这是递归的**终止条件**。因为节点有左右两个子节点，所以分别调用递归函数，然后再调用 `callback` 回调函数，将节点的 key 作为参数传递。

我们将上述的两个方法，添加在上一篇创建的 `BinarySearchTree` 二叉搜索树这个类上，然后初始化并添加节点：

```js
var bin_tree = new BinarySearchTree();
bin_tree.insert(20);
bin_tree.insert(17);
bin_tree.insert(16);
bin_tree.insert(21);
bin_tree.insert(25);
console.log(bin_tree);
```

打印结果如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cc86ff0976e54c22b2047b10ae37365d~tplv-k3u1fbpfcp-watermark.image?)

这样这棵树就创建好了，下面我们遍历这棵树：

```js
bin_tree.inOrderTraverse((key) => {
  console.log(key);
});
```

遍历结果如下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/41de509aace84f64ba0744f69472420c~tplv-k3u1fbpfcp-watermark.image?)

看结果确实是从小到大排列，符合中序遍历的要求。

### 先序遍历

先序遍历是遵循先遍历根节点的原则，再递归遍历左右测子节点，实现如下：

```js
preOrderTraverse(callback) {
  this.preOrderTraverseNode(this.root, callback)
}
```

`preOrderTraverseNode` 方法的实现如下：

```js
preOrderTraverseNode(node, callback) {
  if(node != null) {
    callback(node.key)
    this.preOrderTraverseNode(node.left, callback)
    this.preOrderTraverseNode(node.right, callback)
  }
}
```

我们发现 **先序遍历** 与 **中序遍历** 的区别仅仅是递归函数内代码执行顺序的不同。中序遍历的顺序是 `左-中-右`，先序遍历的执行顺序是 `中-左-右`。

这里的 `中` 指的就是根节点，左右分别指左侧节点和右侧节点。

那我们继续将先序遍历的方法添加到类中，然后执行一下先序遍历：

```js
bin_tree.preOrderTraverse((key) => {
  console.log(key);
});
```

执行结果如下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c24bc5978c5a4bf789613bdf6a060740~tplv-k3u1fbpfcp-watermark.image?)

从结果也能看出来，先序遍历是先访问节点本身，然后是左侧节点，最后是右侧节点，因此是 `中-左-右` 的执行顺序。

### 后序遍历

后序遍历和前面两个的遍历逻辑基本一样，不同的也是递归函数内的执行顺序。

不多说，直接上代码了：

```js
postOrderTraverse(callback) {
  this.postOrderTraverseNode(this.root, callback)
}
postOrderTraverseNode(node, callback) {
  if(node != null) {
    this.preOrderTraverseNode(node.left, callback)
    this.preOrderTraverseNode(node.right, callback)
    callback(node.key)
  }
}
```

从代码中能看出来，后序遍历遵循 `左-右-中` 的执行顺序。依然将两个方法写到类中，我们执行代码：

```js
bin_tree.postOrderTraverse((key) => {
  console.log(key);
});
```

打印结果如下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/084f0c41bb3d4eafbea903df6244145c~tplv-k3u1fbpfcp-watermark.image?)

实现完这三个遍历方法，我们再看它们名称的含义。先序遍历，中序遍历，后序遍历，这里的“先，中，后” 其实指的都是 `根节点` 的位置，两边的规则都是先左后右。

## 查找某个值

前面介绍了三种遍历方式，有了遍历，我们就能暴力查找任何一个值。

所谓“暴力查找”就是不考虑性能直接遍历整棵树，直到找到某个节点。暴力查找也不用考虑用哪种遍历方式，直接遍历就行了，就好像 JavaScript 当中的 `ForEach` 一样。

比如我要查找值为 25 的节点：

```js
bin_tree.postOrderTraverse((key) => {
  if (key == 25) {
    console.log('找到啦！');
  }
});
```

但是学过上面的三种遍历方式，在不同场景使用不同的方式，也能提高遍历效率。

比如查找**最小值**，就可以用优先遍历左侧子节点的**中序遍历**，这部分我们在下一节介绍。

## 总结

本篇我们介绍了如何遍历二叉搜索树，以及三种不同遍历方式的区别，现在我们可以找到树中的任意一个值了。

有了本篇的知识做铺垫，下篇我们就能介绍在二叉搜索树中高效查找值。

本文来源公众号：**程序员成功**。这是学习 JavaScript 数据结构与算法的第 22 篇，本系列会连续更新一个月，欢迎关注公众号，点击“**加群**”一起加入我们的学习队伍～
