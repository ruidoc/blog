# 排序

列举排序相关的算法题。

## 1. 冒泡排序

- 原理：通过不断交换相邻元素的位置来将较大的元素向数组末尾移动。
- 时间复杂度：平均和最坏情况下为 O(n^2)，最好情况下为 O(n)（当数组已经排好序时）。

示例：**2，1，20，15，5，8，9，3，4**

> 注意：两两对比，只能保证前两个对比排序正确，因此需要注意两点：
>
> 1. 双层循环，内层比外层少一次（j-1）
> 2. 内层循环过滤掉已排序（j-1-i）

```js
function bubbleSort(arr) {
  let len = arr.length;
  let swapped; // 是否交换

  // 外层循环控制遍历次数

  for (let i = 0; i < len; i++) {
    swapped = false;
    // 内层循环负责每次遍历中的元素比较
    for (let j = 0; j < len - 1 - i; j++) {
      // 减去已排序的部分
      if (arr[j] > arr[j + 1]) {
        // 交换元素
        let temp = arr[j]; // 临时存储前一个
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swapped = true;
      }
    }
    // 如果某次遍历中没有发生交换，则提前结束
    if (!swapped) break;
  }
  return arr;
}
```

## 2. 快速排序

原理：将待排序的数据分割成独立的两部分，一部分的所有数据都比另一部分的所有数据都要小，然后再按此方法对这两部分数据分别进行快速排序。

```js
function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    const partitionIndex = partition(arr, left, right);
    quickSort(arr, left, partitionIndex - 1);
    quickSort(arr, partitionIndex + 1, right);
  }
  return arr;
}

function partition(arr, left, right) {
  const pivot = arr[right]; // 选择最右侧的元素作为基准
  let i = left - 1; // i指向最后一个不大于基准元素的位置

  for (let j = left; j < right; j++) {
    if (arr[j] <= pivot) {
      i++;
      // 交换 arr[i] 和 arr[j]
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  // 把基准元素放到正确的位置
  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
  return i + 1;
}
```

## 3. 选择排序
