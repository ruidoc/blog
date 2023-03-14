# 类型别名 Type

## Type 和 Interface 的区别

类型别名和接口非常相似，在大多数情况下你可以在它们之间自由选择。几乎所有的 interface 功能都可以在 type 中使用，关键区别在于不能重新开放类型以添加新的属性，而接口始终是可扩展的。

1. Interface 通过 extends 扩展：

```ts
interface Animal {
  name: string;
}

interface Bear extends Animal {
  honey: boolean;
}

const bear = getBear();
bear.name;
bear.honey;
```

2. Type 通过 & 扩展：

```ts
type Animal = {
  name: string;
};

type Bear = Animal & {
  honey: Boolean;
};

const bear = getBear();
bear.name;
bear.honey;
```
