# 工具泛型

为了更方便地创建自定义类型，TypeScript 提供了一些简单常用的`工具泛型`，允许在已有类型的基础上操作生成新的类型，可以大大简化类型编写。

工具泛型全局可用，无需定义或导入。工具泛型的返回值是一个新的 Type 类型。

## 适用对象类型

以下 6 个工具泛型适用于对象类型的操作。

### 1. Record<Keys, Type>

快速创建一个对象类型，其属性名为拆解后的 Keys（以 typeof 格式），属性值为 Type，所有属性必填。例子：

```ts
type Log = Record<'x' | 'y', string>;

// 等同于
type Log = {
  x: string;
  y: string;
};
```

### 2. Partial<Type>

修改一个对象类型中的所有属性为可选。例子：

```ts
type Logs = {
  a: number;
  b: string;
};
type Result = Partial<Logs>;

// 等同于
type Result = {
  a?: number;
  b?: string;
};
```

### 3. Required<Type>

修改一个对象类型中的所有属性为必填，于 Partial 相反。

```ts
type Logs = {
  a?: number;
  b?: string;
};
type Result = Required<Logs>;

// 等同于
type Result = {
  a: number;
  b: string;
};
```

### 4. Pick<Type, Keys>

类型过滤器。从一个对象类型中选取一组属性，返回一个新的子类型。

```ts
type Logs = {
  a: number;
  b: string;
  c: string;
};
type Result = Pick<Logs, 'a' | 'c'>;

// 等同于
type Result = {
  a: number;
  c: string;
};
```

### 5. Omit<Type, Keys>

类型过滤器。从一个已有类型中排除一组属性，返回一个新的子类型，相当于 Pick 的反选。

```ts
type Logs = {
  a: number;
  b: string;
  c: string;
};
type Result = Omit<Logs, 'a' | 'c'>;

// 等同于
type Result = {
  b: string;
};
```

### 6. Readonly<Type>

字面意思也能看出来，修改一个对象类型中的所有属性为只读。

```ts
type Logs = {
  a: number;
  b?: string;
};

type Result = Readonly<Logs>;
// 等同于
type Result = {
  readonly a: number;
  readonly b?: string | undefined;
};
```

## 适用联合类型

以下 5 个工具泛型适用于联合类型的操作。

### 1. Extract<Type, Union>

一般用于联合类型的选项筛选。Type, Union 都是联合类型，由基本类型组成。

联合类型（Type）中的任意一个类型，如果是联合类型（Union）的实现，则返回这个类型（匹配到多个以联合类型的形式返回）。例子：

```ts
type T = 'a' | 'b';
type U = 'b';
type M = 'c';

type One = Extract<T, U>; // 'b'
type Two = Extract<T, M>; // never
```

### 2. Exclude<Type, Union>

联合类型（Type）中的任意一个类型，如果不是联合类型（Union）的实现，则返回这个类型，与 Extract 相反。例子：

```ts
type T = 'a' | 'b';
type U = 'b';
type M = 'c';

type One = Exclude<T, U>; // 'a'
type Two = Exclude<T, M>; // 'a' | 'b'
```

### 3. NonNullable<Type>

排除类型中的 null 和 undefined

```ts
type T = 'a' | 'b' | null | undefined;
type U = NonNullable<T>;

// 等同于
type U = 'a' | 'b';
```

## 适用函数类型

以下 5 个工具泛型适用于联合类型的操作。

### 1.
