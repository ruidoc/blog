# 字符串

列举字符串的算法题。

## 1. 基本算法技能

字符串一般不会单独考，但在一些综合题中会出现一些字符串的高频操作，这些操作包括以下几种。

### (1) 反转字符串

```js
// 定义被反转的字符串
const str = '1234567';
// 定义反转后的字符串
const res = str.split('').reverse().join('');

console.log(res); // 7654321
```

### (2) 删除字符串

字符串没有提供直接删除部分字符的功能，但可以通过替换字符串实现。

```js
var str = '祖国,大好,河山';

let res1 = str.replace(',', '');
console.log(res1); // 祖国大好,河山
let res2 = str.replaceAll(',', '');
console.log(res2); // 祖国大好河山
// replace() 不改变原数组
console.log(str); // 祖国,大好,河山
```

### (2) 大小写判断/转换

判断字符的大小写，可以用正则表达式，也可以用转换函数的返回结果。

转换函数有两个：`.toUpperCase()` 方法转换为大写，`.toLowerCase()` 方法转换为小写。

```js
var str = 'Hello World'
console.log(str.toUpperCase()) // HELLO WORLD
console.log(str.toLowerCase()) // hello world

// 判断某个字母是小写字母
var a = 'a'
a == a.toLowerCase() // 判断小写
/[a-z]/.test(a) //判断小写
a == a.toUpperCase() // 判断大写
/[A-Z]/.test(a) //判断大写
```

## 2. 回文字符串

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

## 3. 版本号对比

项目发布项目版本时会有版本号，比如 `1.02.11`，`2.14.4` 等等。

现在有 2 个版本号 version1 和 version2，version1 > version2 返回 1，如果 version1 < version2 返回-1，否则返回 0。

```js
function compare(version1, version2) {
  if (typeof version1 != 'string' || typeof version2 != 'string') {
    throw new Error('参数类型错误');
  }
  let temp = (version1 + version2).replaceAll('.', '');
  if (isNaN(Number(temp))) {
    throw new Error('参数格式错误');
  }
  // write code here
  let arr1 = version1.split('.');
  let arr2 = version2.split('.');
  let res_num = 0;
  for (let i = 0; i < Math.max(arr1.length, arr2.length); i++) {
    if ((arr1[i] || 0) != (arr2[i] || 0)) {
      res_num = (arr1[i] || 0) > (arr2[i] || 0) ? 1 : -1;
    }
  }
  return res_num;
}
```

## 4. 字符串变形

字符串变形，就像 “Hello World” 一样，我们要做的是把这个字符串中由空格隔开的单词反序，同时反转每个字符的大小写。

比如 “Hello World” 变形后就变成了 “wORLD hELLO”。

```js
function trans(s, n) {
  let rev_arr = s.split(' ').reverse().join(' ').split('');
  for (let i = 0; i < n; i++) {
    if (rev_arr[i] == '') continue;
    // 判断是否是小写
    if (rev_arr[i] == rev_arr[i].toLowerCase()) {
      rev_arr[i] = rev_arr[i].toUpperCase();
    } else {
      rev_arr[i] = rev_arr[i].toLowerCase();
    }
  }
  return rev_arr.join('');
}
```

> 注意：字符串不能通过下标的方式修改，必须是修改数组，再转为字符串
