---
group:
  title: ES6+
  path: /es6+
  order: 3
order: 1
---

# 常用操作

收集 ES6 剩余知识。

## 对象与数组解构

解构能帮我们更好的从对象或数组里拿到需要的数据。

#### 数组的解构

以元素的位置为匹配条件来提取想要的数据，如：

```javascript
const [a, b, c] = [1, 2, 3];
```

也可以设置空占位实现精准提取

```javascript
const [a, , c] = [1, 2, 3];
```

#### 对象的解构

以属性的名称为匹配条件来提取想要的数据，如：

```javascript
const stu = {
  name: 'Bob',
  age: 24,
};
const { name, age } = stu;
```

考点一：如何提取高度嵌套的对象里的指定属性

```javascript
const school = {
  classes: {
    stu: {
      name: 'Bob',
      age: 24,
    },
  },
};
const {
  classes: {
    stu: { name },
  },
} = school;
```

考点二：解构同时重命名

如果想给属性起个新名字，可以采取 **属性名：新变量名** 这种形式

```javascript
const { name: newName } = stu;
```

此时 newName 就等于 stu.name

## 扩展运算符

"**…**" 表示 ES6 中的扩展运算符

#### 扩展运算

扩展运算在对象和数组中有着不同的表现

##### 对象扩展运算

对象中的扩展运算符(…)用于取出参数对象中的所有可遍历属性，拷贝到当前对象之中

```javascript
const me = {
  name: 'xiuyan',
  age: 24,
};

const meCopy = { ...me };

meCopy; // {name: "xiuyan", age: 24}
```

这里的 …me 其实就等价于下面这种写法：

```javascript
Object.assign({}, me);
```

##### 数组扩展运算

数组中，扩展运算可以将一个数组转为用逗号分隔的参数序列

```javascript
console.log(...['a', 'b', 'c']) == console.log('a', 'b', 'c');
```

再举个例子：

```javascript
function mutiple(x, y) {
  return x * y;
}

const arr = [2, 3];
mutiple(...arr); // 6
```

考点点拨：合并两个数组

```javascript
const arr1 = [1, 2, 3, 4];
const arr2 = [5, 6, 7, 8];
const newArr = [...arr1, ...arr2];
```

#### rest 参数

在函数形参上，扩展运算符可以把可能的参数整合为一个数组

```javascript
function mutiple(...args) {
  console.log(args);
}

mutiple(1, 2, 3, 4); // [1, 2, 3, 4]
```

## 类数组的转换

先来看看啥是类数组对象，ECMA-262 对它的定义是：

1. 它必须是一个对象
2. 它有 length 属性

所以，只要有 length 属性的对象就是类数组对象

```javascript
const book = {
  name: 'how to read a book',
  age: 10,
  length: 300,
}; // 这是一个类数组对象

const book = {
  0: 'how to read a book',
  1: 10,
  length: 2,
}; //这也是类数组对象
```

考点点拨：如何把类数组对象转换为真正的数组？

如下：

```javascript
const arrayLike = {
  0: 'Bob',
  1: 'Lucy',
  2: 'Daisy',
  length: 3,
};
```

三个思路：

一、Array 原型上的 slice 方法，不传参

```javascript
const arr = Array.prototype.slice.call(arrayLike);
```

二、Array.from 方法 —— 这是 ES6 新增的一个专门用于把类数组转为数组方法

```javascript
const arr = Array.from(arrayLike);
```

三、扩展运算符

函数内部的 arguments 对象可用

## 模板字符串

直接看案例：

```javascript
var name = 'xiuyan';
var career = 'coder';
var hobby = ['coding', 'writing'];

var finalString = `my name is ${name}, I work as a ${career} I love ${hobby[0]} and ${hobby[1]}`;
```

除了拼接字符串更便利外，它还有两个优势：

- 空格、缩进、换行都会被保留
- 支持“运算”表达式，可以在${}里完成一些计算

#### 更强的方法

**存在性判断：**

以前判断一个字符串中是否包含某个字符串的时候，只能用 indexOf > -1 来判断。

现在 ES6 提供了三个方法：includes、startsWith、endsWith

```javascript
const son = 'haha';
const father = 'xixi haha hehe';

father.includes(son); // true
father.startsWith('haha'); // false
father.startsWith('xixi'); // true
father.endsWith('hehe'); // true
```

**自动重复：**

```javascript
const sourceCode = 'repeat;';
const repeated = sourceCode.repeat(3);
console.log(repeated); // repeat;repeat;repeat;
```
