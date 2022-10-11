# aggregation（聚合查询）

Aggregation 是 mongodb 最强大的查询函数，尤其在统计分析方面威力惊人。

Aggregation 通过对一个集合内的数据层层处理，最后返回组合好的数据。处理过程中数据可以自由组合，灵活度极高；而且 aggregation 提供了非常丰富的内置操作函数。

操作函数分两类，`Pipeline Stages` 和 `Pipeline Operators`

### Pipeline Stages

`aggregate()` 聚合查询方法的参数是一个 `array`，`array-item` 数组项是一个对象（可看作是一节管道），_Pipeline Stages_ 就是这个对象的属性，大致理解为这节管道要做什么事情。

举个简单的例子：

```js
collection.aggregate([
  { $match: { ... }},
  { $sort: { ... }},
])
```

其中 `$match` 和 `$sort` 就是 _Pipeline Stages_，它们要做的分别是筛选和排序。

下面总结一些常用的 Pipeline Stages：

**\$match**

最简单和最常用的，用于筛选数据，相当于 where。

```js
{
  $match: {
    name: '张三';
    age: {
      $gt: 25;
    }
  }
}
```

**\$project**

定义要返回的字段，1 代表返回，0 代表不返回。

> 除了返回顶层字段，也可返回内嵌字段；还可以返回自定义组合字段

```js
{
  $project: {
    _id: 0, gender: 1, "name.firstName": 1, isnew: false
  }
}
```

该字段只能返回集合中存在的字段。如果要新增字段，请用 \$addFields

**\$addFields**

向查询返回的文档添加字段。

```js
{
  $addFields: {
    count: { $sum: 1 } ,
  }
},
```

**\$group**

分组查询，用于做分组统计，`_id` 的值是要分组的字段：

```js
{
  $group : {
    _id : "$gender",
    totalAge: { $sum: "$age"},
    avgAge: { $avg: "$age" },
    count: { $sum: 1 }
  }
}
```

也可以按照多个字段分组：

```js
{
  $group : {
    _id : {
      userid: "$user_id",
      gender: "$gender",
    },
    count: { $sum: 1 }
  }
}
```

如果要统计所有文档信息，可以将 _\$group_ 的 _\_id_ 字段设置为 `null`：

```js
{
  $group : {
    _id: null,
    count: { $sum: 1 }
  }
}
```

**\$unwind**

将某个数组字段进行拆分，展开数组。

```js
{
  $unwind : {
    path: "$array", // 要展开的数组字段
  }
}
```

展开的数组会各自拆分为一条记录。

### Pipeline Operators

_Pipeline Operators_ 是对某个字段的过滤或转换操作，它只针对于某个字段，可以在一个 _Pipeline Stages_ 中使用多次。

**\$exists**

判断某个字段是否存在。

```js
{
  $match : {
    path: { $exists: false }, // path 字段不存在
    name: { $exists: true }, // name 字段存在
  }
}
```
