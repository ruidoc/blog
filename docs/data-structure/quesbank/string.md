# 字符串

列举字符串的算法题。

## 基本算法技能

字符串一般不会单独考，但在一些综合题中会出现一些字符串的高频操作，这些操作包括以下几种。

1. 反转字符串

```js
// 定义被反转的字符串
const str = '1234567';
// 定义反转后的字符串
const res = str.split('').reverse().join('');

console.log(res); // 7654321
```

2. 回文字符串

回文字符串，就是正着读和倒着读都一样的字符串，如 `abcba`。

判断一个字符串是否是回文字符串，也可以通过反转字符串来实现，如下：

```js
const isPalindrome = (str) => {
  if (str.length % 2 !== 1) {
    return false;
  }
  let on_sr = str.split('').reverse().join('');
  if (on_sr == str) {
    return true;
  }
  return false;
};
```
