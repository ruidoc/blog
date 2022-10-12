---
order: 3
---

# 原型真题解析

原型知识很少单独命题，但更多的是和其它 JS 核心知识结合起来命题。

主要抓手是梳理出一条清晰正确的原型链！

### 命题点一：原型基础 + 构造函数基础

先看一个例子：

```javascript
var A = function () {};
A.prototype.n = 1;
var b = new A();
A.prototype = {
  n: 2,
  m: 3,
};
var c = new A();

console.log(b.n);
console.log(b.m);

console.log(c.n);
console.log(c.m);
```

大脑运行一下，可能会给出这个答案：

_2，3，2，3_

实际运行的答案是：

_1，undefined，2，3_

这里有一个疑问。为什么 b 和 c 的运行结果不同？

#### 用 new 实例化

当我们用 new 去创建一个实例时，一共做了四件事：

1. 为实例开辟内存
2. 把函数体内的 this 指向这块内存
3. 将实例的 _ proto_ 指向构造函数的 prototype
4. 执行函数体内的逻辑

具体案例：

```js
function Person() {
  this.name = 'zqq';
  this.age = 28;
}
var p = new Person();
```

四件事的具体步骤：

1. var p = {};
2. Person.call(p)
3. p.\_\_proto\_\_ = Person.prototype
4. 执行 Person 内的代码

> 注意：第二步完成后，实例的原型会把构造函数的 prototype 的引用给存（复制）下来

因为 A.prototype 是**重新赋值**，创建了新的堆内存引用，并不会影响到之前的数据。因此 b.\_\_proto 指向的数据还是之前的并没有改变。

所以 b 的 m 属性，直接输出 undefined。

### 命题点二：自有属性与原型继承属性

上例子：

```javascript
function A() {
  this.name = 'a';
  this.color = ['green', 'yellow'];
}
function B() {}
B.prototype = new A();
var b1 = new B();
var b2 = new B();

b1.name = 'change';
b1.color.push('black');

console.log(b2.name); // 'a'
console.log(b2.color); // ["green", "yellow", "black"]
```

这个例子的关键点在于，修改了 b1 的 name，b2 的 name 保持不变；而修改了 b1 的 color，b2 的 color 却同时修改了！

为什么会这样呢？

其实，**原型链逐步向上查找的过程，只会在”读“的时候发生**。

**如果是一个”写“操作，那么会直接在实例上添加新属性，不会向上查找**。

而 color 的如下操作，并不是写（重新赋值）操作，只是修改原有对象：

```javascript
b1.color.push('black');
b1.color.attribute = 'xxx';
```

真正的写操作是这样的：

```javascript
b1.color = ['newColor'];
```

### 命题点三：构造函数综合考察

```js
function A() {}
function B(a) {
  this.a = a;
}
function C(a) {
  if (a) {
    this.a = a;
  }
}
A.prototype.a = 1;
B.prototype.a = 1;
C.prototype.a = 1;

console.log(new A().a); // 1
console.log(new B().a); // undefined
console.log(new C(2).a); // 2
```
