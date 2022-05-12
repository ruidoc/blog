---
group:
  title: 树篇
  path: /tree
  order: 9
order: 1
---

# 树与二叉树

大家好，我是杨成功。

到本篇为止我们已经学习了大多数的顺序数据结构，而第一个非顺序数据结构是**散列表**。本篇我们学习第二种非顺序数据结构 —— **树**，是一个相对复杂的数据结构。

生活中提到 “**树**”，我们肯定会想到去公园遛弯时看到的树木。一颗树只有一个主干，但是主干上面会分出无数的树枝，树枝又各自分叉产生新的树枝，这样层层分叉最终变成了我们看到那棵枝繁叶茂的大树。

其实数据结构中的树也是一样，最顶部只有一个元素，然后一个元素下包含多个子元素，子元素又包含子元素，层层包含下去，最终组成了一个庞大的数据体。

生活中最常见的树的例子，就是公司的组织架构，如图：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9647a9345cac4ede8674c2944740e3ba~tplv-k3u1fbpfcp-watermark.image?)

总裁是最高位置，下面划分了多个副总的岗位，副总下又划分经理，层层划分，形成了树状结构。现在你明白数据结构中的“树”是什么了吧？

## 树的相关术语

树的每个元素被称为节点，一个树结构包含了一系列父子关系的节点。最顶层的那个节点被称为**根节点**，其他节点全部是它的子节点。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e9fd5cf20c14cf3a2740b99fd761f56~tplv-k3u1fbpfcp-watermark.image?)

如图，节点分为**内部节点**和**外部节点**。只要有子节点的就是内部节点，最外层的没有子节点的节点，就是外部节点，也叫叶节点。

一个节点的层级关系总体上分为三种：

- 父节点
- 兄弟节点
- 子节点

比如图中的节点 5，父节点是 7，兄弟节点是 9、13，子节点是 3、6。这些听着是不是很耳熟？没错，我们前端经常打交道的 `DOM 节点`，就是典型的树结构。

除此之外，树还有两个重要的属性：

- `高度`：从 0 开始，一共有多少层
- `深度`：某个节点处在第几层

如图中，根节点是 0 层，最下面的是第 3 层，所以树的高度为 3。这个好比数组的索引，第一个元素是 0，最后一个是 n-1，所以树的高度是 `n - 1`。

深度的话，就相当于数组中某个元素的索引了，在第几层深度就是几。

好了，这里介绍了树的基本概念，接下来介绍二叉树。

## 二叉树与二叉搜索树

首先，二叉树是树的一种，拥有树的基本属性。但它的特点是每个节点最多只能有 `两个` 子节点：一个左侧子节点和一个右侧子节点。

`二叉搜索树`（BST）是二叉树的一种，但它要求必须在左侧子节点存储比父节点小的值，在右侧子节点存储比父节点大的值。上图中灰色部分由 13、12、14 三个节点组成的树就是一棵二叉搜索树。

本篇我们实现一棵二叉搜索树。

### 初始化类

在开始写二叉搜索树之前，需要先定义一个节点类，存储我们基本节点的数据。

```js
class Node {
  constructor(key) {
    this.key = key;
    this.left = null;
    this.right = null;
  }
}
```

看这个节点类，你会发现和之前我们学到的双向链表的节点非常相似。也是有两个属性分别表示前一个元素和后一个元素。

区别是什么呢？其实只是含义上的区别。双向链表的两个属性指向的都是兄弟元素，而上述的节点类的 `left` 和 `right` 指向的是子元素。

在树当中，节点也被称为 `键`。

```js
class BinarySearchTree {
  constructor(compareFn) {
    let defFn = (a, b) => (a !== b ? (a > b ? 1 : -1) : 0);
    this.root = null;
    this.compareFn = compareFn || defFn;
  }
}
```

上面我们定义了一个 `BinarySearchTree` 类，这个类和链表的结构也差不多，其中属性 **root** 表示根节点，传入一个自定义函数用来自定义节点如何比较。

在这个基础类下，我们还要自定义几个方法：

- `insert(key)`：插入一个键
- `search(key)`：在树中查找一个键
- `inOrderTraverse()`：通过中序遍历方式遍历所有节点
- `preOrderTraverse()`：通过先序遍历方式遍历所有节点
- `postOrderTraverse()`：通过后序遍历方式遍历所有节点
- `min()`：返回树中最小的值
- `max()`：返回树中最小的值
- `remove()`：从树中移除某个键

本篇我们只介绍一个 `insert` 方法。

## insert 方法

insert 方法的作用是向二叉搜索树中插入一个 key（节点）。本篇的 insert 方法要比前几篇实现的复杂一些，因为会用到很多递归。这也是为什么我们在学习树之前先要介绍递归。

如果你还不清楚递归，请参考这篇：[怒肝 JavaScript 数据结构 — 递归篇](https://juejin.cn/post/7089827880602959909)。

向树中插入节点有**两个步骤**，我们先实现第一步：

```js
insert(key) {
  if(this.root == null) {
    this.root = new Node(key)
    return true
  } else {
    return this.insertNode(this.root, key)
  }
}
```

第一步是先判断当前实例是否有根节点，没有的话创建，有的话就要走在某个节点下创建子节点的逻辑。

接着我们看第二步，如何递归创建子节点。

```js
insertNode(node, key) {
  let compare = this.compareFN(key, node.key)
  if(compare < 0) {
    if(node.left == null) {
      node.left = new Node(key)
      return true
    } else {
      this.insertNode(node.left, key)
    }
  }
  if(compare > 0) {
    if(node.right == null) {
      node.right = new Node(key)
      return true
    } else {
      this.insertNode(node.right, key)
    }
  }
  return false
}
```

这个代码逻辑是，首先比较节点的 key 与参数 key 谁大谁小，然后判断要填充左侧节点还是右侧节点。

填充两侧节点的逻辑是一样的，先判断节点对应的属性（`left` 或 `right`）是否存在，如果不存在则执行正常的添加逻辑，如果存在就获取节点，进入递归循环。

写完这个，我们来测试一下结果：

```js
var bin_tree = new BinarySearchTree();
bin_tree.insert(20);
```

上面这段代码是初始化，并第一次添加，将根节点设置为了 **20**。

然后再进行一波添加：

```js
bin_tree.insert(17);
bin_tree.insert(15);
bin_tree.insert(24);
bin_tree.insert(33);
bin_tree.insert(19);
bin_tree.insert(36);
```

最终的打印结果如下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4bdeab1418c94435ad5d01555c08d53c~tplv-k3u1fbpfcp-watermark.image?)

看打印结果，符合我们上面二叉搜索树的概念。

## 总结

本篇我们认识了什么是树，什么是二叉树以及二叉搜索树，并创建了一个二叉搜索树的类，实现了添加节点的方法，可以说本篇是树的一个基础篇介绍。

下篇我们整体介绍树的遍历与检索，实现从树中找到我们想要的值。

本文来源公众号：**程序员成功**。这是学习 JavaScript 数据结构与算法的第 22 篇，本系列会连续更新一个月。

欢迎关注公众号，点击“**加群**”一起加入我们的学习队伍～
