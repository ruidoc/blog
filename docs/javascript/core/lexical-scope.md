---
title: 词法作用域
---

# 词法作用域

作用域有两种主要的工作模型：

- 词法作用域，也称为静态作用域
- 动态作用域，如：Bash 脚本

> JS 的作用域遵循的就是词法作用域模型

### 两种模型差别

来看一段代码：

```javascript
var name = 'xiuyan';

function showName() {
  console.log(name);
}

function changeName() {
  var name = 'BigBear';
  showName();
}

changeName();
```

如果是词法作用域，运行结果是 `'xiuyan'`; 如果是动态作用域，运行结果是 `'BigBear'`;

根本区别在于划分作用域的时机：

- 词法作用域： `书写时`划分作用域
- 动态作用域： `运行时`划分作用域，沿着`调用栈`向上查找父级作用域

### 修改词法作用域

两个方法：`eval` 和 `with`

#### eval

用法：传一个字符串参数，该字符串会插入当前调用位置

**因为 eval 函数是在调用时插入一段代码，在书写时这段代码无效。因此会破坏词法作用域。**

来看一段代码：

```javascript
function showName() {
  eval(str);
  console.log(name);
}

var name = 'xiuyan';
var str = 'var name = "BigBear"';

showName(); // 输出 BigBear
```

这段代码会被 eval 改造为：

```javascript
function showName() {
  var name = 'BigBear';
  console.log(name);
}
```

根据词法作用域，本来 showName 应该打印的是 ‘xiuyan’；

由于 eval 在运行时插入了一行声明代码，结果打印了 ‘BigBear’

此时，eval 成功地 “修改” 了词法作用域。

#### with

直接上代码：

```javascript
var me = {
  name: 'xiuyan',
  career: 'coder',
  hobbies: ['coding', 'footbal'],
};

// 正常使用：
console.log(me.name);
console.log(me.career);
console.log(me.hobbies);

// 使用 with：
with (me) {
  console.log(name);
  console.log(career);
  console.log(hobbies);
}
```

不难看出，with 是**创建一个作用域，并且在这个作用域下将 me 的所有属性声明为变量**。
