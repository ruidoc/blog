---
group:
  title: 算法题实践
  path: /quesbank
  order: 11
order: 1
---

# 面试题

列举数据结构、算法相关的面试题。

## 1. 链表和数组的区别

### 存储方式不同

- 数组：一段连续的内存空间，内存大小固定，不可动态变化。
- 链表：一系列节点构成，不需要连续存储，存储大量动态数据更灵活。

现代语言中的数组可以动态变化大小，本质原理是当固定空间满时，`重新分配`更大的存储空间。

### 内存利用不同

- 数组：要预分配固定大小的内存空间，当实际数据量小于数组大小时，会造成内存浪费。
- 链表：按需要动态分配内存，更高效地利用内存资源。

### 访问效率不同

- 数组：通过索引直接访问，时间复杂度为 `O(1)`。
- 链表：存储不连续，要从头节点开始遍历，时间复杂度为 `O(n)`。

### 插入/删除效率不同

- 数组：可能要移动大量数据，时间复杂度为 `O(n)`。
- 链表：只需要修改相邻节点的指针，时间复杂度为 `O(1)`。

总结：

**数组由于其高效的随机访问性能，适合于需要频繁访问元素的场景，如数学计算和排序算法。**

**链表则适用于元素数量经常变化的情况，如实现队列和栈等数据结构。**
