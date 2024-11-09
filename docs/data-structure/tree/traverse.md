# 树的算法遍历

列最常用的树的遍历算法题。

## DFS 和 BFS

在遍历数据时，有两个关键的算法思想：`深度优先搜索`（DFS）和`广度优先搜索`（BFS）。

假设已有树形结构如下：

```js
const tree = {
  value: '1',
  children: [
    {
      value: '2',
      children: [
        {
          value: '4',
        },
      ],
    },
    {
      value: '3',
      children: [
        {
          value: '5',
          children: [
            {
              value: '6',
              children: [
                {
                  value: '7',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
```

### 深度优先搜索

深度优先搜索（DFS），顾名思义从根节点开始，一层一层向下找，直到找到最后一个元素，然后执行下一次遍历。

DFS 可以用递归的方式实现，也可以用非递归的方式实现，后者通常涉及到显式地使用栈（stack）数据结构。

首先看递归的方式，比较简单：

```js
function dfs(node) {
  if (!node) return;

  console.log(node.value); // 访问当前节点

  // 递归地访问每个子节点
  if (node.children) {
    for (let child of node.children) {
      dfs(child);
    }
  }
}
```

再看栈的方式：

```js
function dfsNonRecursive(root) {
  if (!root) return;

  const stack = [root];

  while (stack.length > 0) {
    const node = stack.pop(); // 从栈顶取出一个节点
    console.log(node.value); // 访问当前节点

    // 把当前节点的所有子节点压入栈中
    if (node.children) {
      stack.push(...node.children);
    }
  }
}

// 调用函数开始遍历
dfsNonRecursive(tree);
```

那么栈和递归两种方式有什么区别呢？

- **递归**：`从左到右` 遍历子元素：1，2，4，3，5，6，7
- **栈**：`从右到左` 遍历子元素：1，3，5，6，7，2，4

### 广度优先搜索

BFS 通常需要使用队列（queue）数据结构来保存每一层的节点，然后逐层访问这些节点。

我们可以定义一个函数来执行 BFS 遍历：

```js
function bfs(root) {
  if (!root) return;

  // 创建一个队列用于存储待访问的节点
  let queue = [root];

  // 当队列中有元素时循环
  while (queue.length > 0) {
    // 取出队首的节点
    let node = queue.shift();
    console.log(node.value); // 访问当前节点

    // 将当前节点的所有子节点加入队列
    if (node.children) {
      queue.push(...node.children);
    }
  }
}

bfs(tree);
```
