# Object 方法集

列举一下常用的 Object 方法。

### 1. Object.create

语法如下，接受 2 个参数

```js
Object.create(object, [propertiesObject]);
```

创建一个新对象，使用传入的第 1 个参数来作为新创建对象的 **\_\_proto\_\_**。

第 2 个参数是 json 对象，key 是对象属性名，value 是**描述符**

> 描述符与 Object.defineProperty 一致

```js
var obj = {
    color: 'red',
    print: function() {
        console.log(this.color);
    }
};
​
var son1 = Object.create(obj);
son1.print(); // red

var son2 = Object.create(obj, {
    color: {
        writable: false,
        configurable:true,
        value: 'blue'
    }
});

```

#### Object.create(null)

Object.create(null) 创建的对象，原型指向 null，则不是 Object 的实例，不能使用 Object 上的方法。

### 2. Object.defineProperty

直接在一个对象上定义或者修改一个属性值或者描述符，并返回此对象。

主要用于修改 Symbol 和描述符，这里详细介绍下描述符：

描述符分两类：

1. 数据描述符：value，writable
2. 存取描述符：getter，setter

#### 1. configurable

描述符是否可改变，属性是否可删除。默认为 false。

#### 2. enumerable

是否可枚举，为 true 时会被 `for...in` 和 `Object.keys` 遍历。默认为 false。

#### 3. writable

value 值是否可修改。默认为 false。

#### 4. value

该属性对应的值。默认为 undefined。

#### 5. get

属性的 getter 函数，如果没有 getter，则为 undefined。

#### 6. set

属性的 setter 函数，参数为修改的值，如果没有 setter，则为 undefined。

```js
Object.defineProperty(obj, 'name', {
  get: function () {
    // 使用 obj.name
  },
  set: function (val) {
    // 设置 obj.name
  },
});
```

### 3. Object.defineProperties

与 Object.defineProperty 一样，只是传参方式不同，还用上面的例子：

```js
Object.defineProperties(obj, {
  name: {
    get: function () {
      // 使用 obj.name
    },
    set: function (val) {
      // 设置 obj.name
    },
  },
});
```

### 4. Object.assign

将一个或多个源对象的可枚举属性分配到目标对象，并返回目标对象

```js
const target = { a: 1, b: 2 };
const source = { b: 4, c: 5 };

const returnedTarget = Object.assign(target, source);

console.log(target);
// expected output: Object { a: 1, b: 4, c: 5 }

console.log(returnedTarget);
// expected output: Object { a: 1, b: 4, c: 5 }
```

### 5. Object.entries

返回一个对象自身可枚举属性的键值对数组

```js
const object1 = {
  a: 'somestring',
  b: 42,
};

for (const [key, value] of Object.entries(object1)) {
  console.log(`${key}: ${value}`);
}
```

和这个同一类的还有 `Object.keys`，`Object.values`

```js
const object1 = {
  a: 'somestring',
  b: 42,
};

Object.keys(object1); // ['a', 'b']
Object.values(object1); // ['somestring', 42]
```

### 6. Object.freeze

冻结一个对象。被冻结的对象再也不能修改任何属性和描述符。

```js
const obj = {
  prop: 42,
};

Object.freeze(obj);

obj.prop = 33;
// Throws an error in strict mode

console.log(obj.prop);
// expected output: 42
```

### 7. Object.is

判断两个值是否相等。

与 == 不同，不会强制转换类型。

与 === 也不同，区别如下：

1. `-0 != +0`
2. `NaN == NaN`

**Polyfill**

```js
if (!Object.is) {
  Object.is = function (x, y) {
    // SameValue algorithm
    if (x === y) {
      // +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // NaN == NaN
      return x !== x && y !== y;
    }
  };
}
```

### 8. Object.prototype.hasOwnProperty

判断属性是否在当前对象本身

```js
const object1 = {};
object1.property1 = 42;

console.log(object1.hasOwnProperty('property1'));
// expected output: true

console.log(object1.hasOwnProperty('toString'));
// expected output: false
```
