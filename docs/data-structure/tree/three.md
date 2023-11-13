# BST 搜索值

大家好，我是杨成功。

上一节我们使用遍历树的方式可以找到符合条件的任意值，不考虑性能的情况下，这种方式非常有效。

在树中寻值的另一个经典场景是寻找最大值和最小值，如果是二叉搜索树（BST），则可以使用性能更好的方式，因为最小值在最左边，而最大值在最右边。

## 搜索最小值

定义一个查找二叉搜索树最小值的方法：

```js
const getMinNode = (node) => {
  let current = node;
  while (current.left) {
    current = current.left;
  }
  return current;
};

// 使用
const min_node = getMinNode(this.root);
console.log(min_node.key); // 最小值
```

上述方法从根节点开始，层层遍历寻找左侧子节点，直到找到最后一个，该节点的值就是树中的最小值。

## 搜索最大值

与查找最小值逻辑一致，区别是要层层遍历寻找右侧子节点，方法如下：

```js
const getMaxNode = (node) => {
  let current = node;
  while (current.right) {
    current = current.right;
  }
  return current;
};

// 使用
const max_node = getMaxNode(this.root);
console.log(max_node.key); // 最大值
```

## 搜索一个特定的值

搜索最小值要找最左边的节点，搜索最大值要找最右边的节点；而搜索一个特定的值，需要每次遍历时判断应该要向左搜索还是向右搜索。

判断方式，就是用目标值与节点的值做比较，写一个比较函数如下：

```js
const compareFN = (a, b) => {
  return a != b ? (a > b ? 1 : -1) : 0;
};

// 使用
compareFN(1, 2); // -1
compareFN(2, 2); // 0
compareFN(3, 2); // 1
```

那么在搜索一个值时，传入目标值，并通过比较函数判断从哪个方向遍历树，方法如下：

```js
const searchNode = (node, key) => {
  if (!node) {
    return null;
  }
  let comp = compareFN(key, node.key);
  if (comp == 0) {
    return node;
  }
  if (comp > 0) {
    return searchNode(node.right, key);
  } else {
    return searchNode(node.left, key);
  }
};
```

如此，在二叉搜索树中遍历一个值的方法实现了。

## 总结

在前端算法中，考察树的算法基本都是基于二叉搜索树（BST），本节我们学习了如何在 BST 中搜索最大最小值以及搜索一个特定的值，是树结构的基础用法。

本文来源公众号：**程序员成功**。这是学习 JavaScript 数据结构与算法的第 23 篇，本系列会连续更新一个月，欢迎关注公众号，点击“**加群**”一起加入我们的学习队伍～
