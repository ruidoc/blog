---
group:
  title: 核心
  path: /core
  order: 2
order: 1
---

# 数据类型

JS 中的数据类型有两类：`基本类型`和`引用类型`。

### 基本类型（原始类型）

基本类型 6 种，存储于栈内存：

- string
- number
- boolean
- null
- undefined
- symbol

基本类型判断：

```js
typeof 'ruims'; // "string"
typeof 5; // "number"
typeof false; // "boolean"
typeof null; // "object"
typeof undefined; // "undefined"
typeof Symbol(); // "symbol"
```

基本类型几乎都可以用 typeof 判断，除了 null。null 是个怪胎，会在后面介绍判断方法。

#### 包装对象

`number`，`string`，`boolean` 三种基本类型，都有对应的包装对象。

包装对象是用 new 创建的，如：

```js
var n = new Number(123); // 123, 包装类型
var b = new Boolean(true); // true, 包装类型
var s = new String('ruims'); // 'ruims', 包装类型
```

虽然创建后的值都一样，但是类型已经变了，typeof 检查后返回的是 object。

```js
typeof new Number(123); // 'object'
new Number(123) == 123; // true
new Number(123) === 123; // false
```

基本类型只是值，没有属性和方法；而包装类型是对象，有属性和方法。

所以，当基本类型使用属性和方法时，**会自动转换为包装类型**。

```js
'ruims'.length;
// 自动转换为 ===>
new String('ruims').length;
```

转换为包装对象后，在下次使用前会销毁。

### 引用类型（对象类型）

除基本类型外，其余的都是引用类型，存储于堆内存。

- Object
- Array
- Function
- Date
- RegExp

除函数外，用 typeof 判断其他引用类型结果都是 `object`。

```js
typeof console.log; // "function"
typeof {}; // "object"
typeof []; // "object"
```

所以 typeof 适合用来判断 **除 null 外的基本类型和函数**

#### Object.prototype.toString

引用类型最适合的判断的方法是：

```js
Object.prototype.toString();
```

判断时不时直接用，而是用 call 方法指定 this，如下：

```js
Object.prototype.toString.call([]); // "[object Array]"
Object.prototype.toString.call({}); // "[object Object]"
Object.prototype.toString.call(new Date()); // "[object Date]"
Object.prototype.toString.call(/\\/); // "[object RegExp]"
Object.prototype.toString.call(null); // "[object Null]"
```

不光是引用类型，基本类型也都能判断。总之，浏览器内置对象都可以用这种方法判断。

> 注意：不能判断自定义构造函数的实例，只会返回 [object Object]，请用 instanceof 判断！

#### instanceof

instanceof 基于原型链判断，是适用于引用类型，用于判断实例是否继承于某个构造函数

```js
'ruims' instanceof String; // false
new String('ruims') instanceof String; // true
```

instanceof 正好弥补 Object.prototype.toString 的不足。
