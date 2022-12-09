# 快捷类型

快捷类型是指 TypeScript 提供了一些内置方法用于快速便捷的创建类型。

快捷类型一共 4 种，可以快速创建 interface 类型：

- Record：创建一组`必填`属性。
- Partial：创建一组`可选`属性。
- Readonly：创建一组`只读`属性。
- Pick：过滤属性。

## Record

以 typeof 格式快速创建一个类型，此类型包含一组指定的属性且都是必填。

```ts
type Log = Record<'x' | 'y', string>;

// 等同于
type Log = {
  x: string;
  y: string;
};
```

## Partial

将一个已有 interface 类型定义的所有属性都修改为可选。

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

## Readonly

这个比较简单，字面意思也能看出来，将所有属性设置为可读：

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

## Pick

类型过滤器。从一个已有类型中选取指定一组属性，返回一个新的子类型。

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
