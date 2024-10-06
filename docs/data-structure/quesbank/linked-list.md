# 链表

出一些算法笔试题。

### 1. 反转链表

给定一个单链表的头结点 head，长度为 n，反转该链表后，返回新链表的表头。

数据范围： 0 ≤ n ≤ 1000

要求：空间复杂度 O(1) ，时间复杂度 O(n)。

```js
function reverseList(head) {
  if (head == null || head.next == null) {
    return head;
  }
  let prev = null; // 前一个节点
  let current = head; // 当前节点
  let next = null;
  while (current != null) {
    // 记录下一个节点
    next = current.next;
    // 将当前节点的next指向前一个节点，实现反转
    current.next = prev;
    // 移动prev和current一格
    prev = current;
    current = next;
  }
  return prev;
}
```

### 2. 给定区间反转链表

将一个节点数为 size 链表 m 位置到 n 位置之间的区间反转。

要求：时间复杂度 O(n)，空间复杂度 O(1)。

```js
class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}
// [0], 1, 2, 3, 4, 5;
function reverseBetween(head, m, n) {
  if (head === null || head.next === null || m === n) {
    return head;
  }
  // 创建一个虚拟头结点，作为链表的头部，简化边界处理
  const dummy = new ListNode(0);
  dummy.next = head;

  // 设置指针，指向虚拟节点
  let pre = dummy;
  for (let i = 1; i < m; i++) {
    // 翻转左区间
    pre = pre.next;
  }

  // 翻转的第一个节点
  let cur = pre.next;
  for (let i = m; i < n; i++) {
    let temp = cur.next; // 3，cur 的下一个节点
    cur.next = temp.next; //4，cur 指针，向后移2
    temp.next = pre.next; // 2，next 指针，向前移1
    pre.next = temp; // 3，pre 指针，向后移2
  }

  return dummy.next;
}
```

### 3. 合并两个排序的链表

输入两个递增的链表，单个链表的长度为 n，合并这两个链表并使新链表中的节点仍然是递增排序的。

如输入 {1,3,5}，{2,4,6} 时，合并后的链表为 {1,2,3,4,5,6}。

```js
function mergeTwoLists(l1, l2) {
  // 创建一个新的虚拟头结点
  const dummy = new ListNode(0);
  let current = dummy;

  // 当两个链表都不为空时进行合并
  while (l1 && l2) {
    if (l1.val < l2.val) {
      current.next = l1;
      l1 = l1.next;
    } else {
      current.next = l2;
      l2 = l2.next;
    }
    current = current.next;
  }

  // 如果其中一个链表已经为空，则将另一个链表剩下的部分直接连接到结果链表上
  current.next = l1 || l2;

  // 返回合并后的新链表的头结点
  return dummy.next;
}
```

# 二分查找/排序

给定一个 `元素升序的`、`无重复数字` 的整型数组 nums 和一个目标值 target ，写一个函数搜索 nums 中的 target，如果目标值存在返回下标（下标从 0 开始），否则返回 -1。

```js
function search(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) {
      return mid; // 目标值找到了，返回它的索引
    } else if (nums[mid] < target) {
      left = mid + 1; // 在右半边查找
    } else {
      right = mid - 1; // 在左半边查找
    }
  }

  return -1; // 没有找到目标值
}
```

下面是我自己写的递归方案：

```js
// write code here
function search(nums, target) {
  const subfun = (arrs) => {
    if (arrs.length == 1) {
      return nums.indexOf(arrs[0]);
    }
    let cent = Math.floor(arrs.length / 2);
    if (arrs[cent] == target) {
      return nums.indexOf(target);
    }
    if (arrs[cent] > target) {
      arrs = arrs.slice(0, cent);
    } else {
      arrs = arrs.slice(cent);
    }
    return subfun(arrs);
  };
  return subfun(nums);
}
```
