# 基础 100 题

算法题的核心思路：先找规律，必须找到规律！然后用代码来实现。

如何找规律呢？就是把可能的值列到纸上，找规律，光想是想不出规律的。

### 1. 计算字串代码

> 输入："00110011"  
> 输出：6  
> 解释：有 6 个子串有相同数量的连续 0 或 1：0011,01,1100,10,1100,01

代码实现如下：

```js
var strs = '00110011';
var arrs = [];
const match = (str) => {
  let child = str.match(/(0+|1+)/)[0];
  let need_child = str.substr(child.length, child.length);
  let real_child = (child[0] === '0' ? '1' : '0').repeat(child.length);
  if (need_child === real_child) {
    return child + real_child;
  }
  return null;
};
for (let i = 0; i < strs.length - 1; i++) {
  let matched = match(strs.slice(i));
  if (matched) {
    arrs.push(matched);
  }
}
console.log(arrs);
```

### 2. 电话号码的字母组合

题目：给定一个包含数字 2-9 的字符串，返回它们的字母组合。

> 输入："23"  
> 输出：["ad",'ae','af','bd','be','bf','cd','ce','cf']

```js
// 1. 映射
var num_word = {
  2: 'abc',
  3: 'def',
  4: 'ghi',
  5: 'jkl',
  6: 'mno',
  7: 'pqrs',
  8: 'tuv',
  9: 'wsyz',
};

const entry = (numstr: string) => {
  let array = Array.from(new Set(numstr.split(''))).map((n) => num_word[n]);
  let result = [];
  result = array
    .map((strs, ind) => {
      let next_arr = array
        .slice(ind + 1)
        .join('')
        .split('');
      if (next_arr.length > 0) {
        return strs
          .split('')
          .map((word, sind) => next_arr.map((r) => word + r).join())
          .join();
      } else {
        return '';
      }
    })
    .join();
  console.log(result);
};
```

### 3. 卡牌分组

题目：给定一副牌，每张牌上写一个整数。

> 输入："23"  
> 输出：["ad",'ae','af','bd','be','bf','cd','ce','cf']
