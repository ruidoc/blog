# 数据库篇：基本增查改删实现

前面两篇分别带大家认识了数据库 MongoDB，以及如何通过模型 Schema 设计一个数据存储结构。可以说我们已经解决了 “把数据存到哪？” 和 “要存哪些数据？” 的问题。这一节我们综合运用前面学到的知识，做一个简单性的实战 ——— 实现一个有基本增查改删功能的 Restful 接口。

## 需求分析

在开始之前，我们首先要明确需求是什么。因为业务功能都是需求驱动嘛，只有贴合需求开发出来的东西才有解决问题的价值。我们以一个具体的需求为例：

**小明同学想要一个记账本用于记录每天的开销，他想要清楚的知道每一笔支出，具体在什么时候花了钱？花钱买了什么？共花了多少钱？**

首先细审这个需求。小明想知道每一笔支出，那么意味着小明每花一笔钱，我们都要去记录一次，对应到技术就是“写入一条数据”。然后呢记录完还要回看今天或者某一天的支出，因此还要“查询某天的数据”。

突然有一天小明记账的时候手快，记错了，得修改一下，所以要提供“修改某条数据”的功能。还有一种可能是小明记岔了，多记了一笔，因此他也要“删除某条数据”。等到周末的时候，小明还想看一下本周，或者本月的支出情况，因此需要一个按照时间段统计数据的功能。

基于上面的情况，我们总结出的需求如下：

- 新增记账：写入一条数据
- 查询记账：查询某天的数据
- 修改记账：修改某条数据
- 删除记账：删除某条数据
- 统计支出：按照时间段统计数据

这是一个简单的需求分析，得出了我们需要用技术实现的内容。当然了真实业务情况要比这复杂的多，但是解决问题的思路是一样的：**从需求出发，给出技术方案**。接下来我们就开始实施。

## 准备第一步：配置路由

因为这是一个新需求，对应的就是一个新模块。根据我们之前搭建好的 API 架构，第一步要做的是配置路由。在 `config/routes.js` 中导出的数组中添加一个对象如下：

```javascript
module.exports = [
  // ...
  {
    url: '/record',
    file: 'record',
  },
];
```

这个配置的意思呢，就是说当用户访问路径 `/record` 的时候，会加载 `routers/record.js` 这个文件，然后这个文件里面定义的就是所有我们要做的**记账相关的接口**。在搭建 API 架构的时候我们实现了根据配置自动注册路由的功能，因此无需手动再挂载。

现在我们在 `routers` 目录下新建 **record.js** 文件，这个文件就是代码执行的文件，本章几乎所有的业务代码都写在这里，类似传统 MVC 模式的控制器。先填充一下基础代码：

```javascript
// routers/record.js
var express = require('express');
var router = express.Router();

/* 代码区域 */
router.get('/', (req, res) => {
  res.send('记账接口');
});

module.exports = router;
```

是不是非常简单呢？一般规模的接口增查改删都写在上面的代码区域即可，如果有复杂的可共用的功能则可以单独提取一个 lib。我们的需求简单，因此都写在这个文件里。

## 准备第二步：设计数据模型

上一步写好了路由代码，可以满足我们相关逻辑的编写，但是实际数据是要存储在数据库里的。结合上一篇介绍的 Schema 的知识，我们先来设计一下数据库结构，思考小明记账需要存哪些数据。

我设计的基础字段如下：

- `description`: 描述，花这笔钱干啥了
- `user_id`: 用户 ID，小明的唯一标识
- `price`: 金额，花了多少钱
- `created_at`: 花钱的时间

这几个字段可以基本满足上面提出的需求。我们把这些字段编写成 Schema，新建 `schemas/record.js` 然后写入代码：

```javascript
// schemas/record.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recordSchema = new Schema({
  user_id: { type: Number, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const model = mongoose.model('records', recordSchema);

module.exports = model;
```

这个 schema 结构比较简单，很容易理解。我们对每个字端都定义了类型，并且用 `required: true` 来指定字段是必须项。这样的好处是在向数据库写入数据时，如果没有必须字段 mongoose 则会拒绝执行写入并抛出异常，这是数据库层面的安全验证，保证了数据的可靠性。

还需要特别说明一下 `created_at` 字段，这个字端不需要显式传递，在新增数据的时候会自动添加为当前时间，时间格式为 **ISO**，前端使用时统一处理。

## 业务实战

前面两节写好了路由代码和模型代码，准备工作已就绪，下面就开始本篇的重头戏 —— 根据需求进行接口开发实战，小伙伴们和我一起握紧拳头向前冲吧！

### 新增记账

新增记账接口需要数据库操作，所以我们第一步要把上一节设计好的记账数据模型引过来，然后确定 url 为 `/insert`，请求方式为 POST，代码如下：

```javascript
// routers/record.js
var RecordModel = require('../schema/record');

router.post('/insert', (req, res, next) => {
  // 新增接口代码
});
```

一个接口的严谨性和稳定性，最关键的部分就是请求参数的验证是否合格。为什么呢？做后端的同学一定听过这句话，就是永远不要相信前端传递过来的数据。我们前端当然知道了，有时候可能是数据和逻辑问题，或者用户输入不合常规的内容，导致传递到后端的数据不规范。如果后端拿到参数不加验证，直接执行后面的代码，那么非常容易造成 500 错误甚至污染数据库。

所以我们要记得，在每定义一个路由的最前面，一定要做参数验证，从源头拦截掉不规范的参数。再加上前面我们在数据库层面也做了字段验证，双重保障，这样接口的稳定性就会高出很多。

请求参数验证之前已经做过简单的封装，可以拿来使用：

```javascript
var { transParams } = require('../utils');

router.post('/insert', (req, res) => {
  // 参数验证
  let body = req.body;
  let received = ['description', 'price', 'user_id'];
  let params = transParams(body, received);
  console.log(params); // 过滤后的参数
});
```

> 提示：transParams 方法在 `这一篇` 讲到过，忘记的话回顾一下。

拿到验证过的参数之后，实例化 **RecordModel** 并调用 `save` 方法，此时 mongoose 会验证传入的数据与 schema 中定义的字段和类型是否一致。如果一致，则会将数据写入数据库，并返回成功写入的数据，否则就会返回异常。下面是完整代码：

```javascript
// routers/record.js
var express = require('express');
var router = express.Router();
var { transParams } = require('../utils');
var RecordModel = require('../schema/record');

router.post('/insert', async (req, res) => {
  // 参数验证
  let body = req.body;
  let received = ['description', 'price', 'user_id'];
  let params = transParams(body, received);
  // 执行数据库操作
  try {
    let instan = new RecordModel(params);
    let result = await instan.save();
    res.send(respond(result));
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});
```

上面的代码就是一个完整的新增记账接口了，简单吧。不过有几个地方需要说明一下。

**1. 异步 async/await**

代码中的保存到数据库的方法 `instan.save()` 返回一个 Promise，因此这是一个异步函数，我推荐使用 **async/await** 来处理异步。使用方法也很简单，在中间件函数前面加一个 async，然后函数内的 Promise 前加 await 关键字，这样代码写起来像同步一样。

事实上早期的 express 框架是不支持 async/await 的，只能使用 **.then** 和 **.catch** 链式调用。为了更好的处理异步，express 的团队重新开发了 Koa 框架，支持了 async/await。后来经过 Node.js 本身的不断进化，终于在 Node8 之后原生支持了 async/await，因此现在在 express 上也可以使用这个特性了。

**2. try...catch 捕获**

任何接口都是有可能出错的，当发生错误时，我们不能让框架抛出异常，或者直接让进程死掉。我们需要自己获取到异常然后向客户端返回指定格式的错误响应。

`try...catch` 的特性是不仅可以捕获同步错误，同时也能捕获 async/await 的异步错误，刚好适应我们的情况。因此将业务代码用 try 包起来，当发生错误时，会统一走到 catch 块里，我们在这里设置状态码 500 并返回错误响应。

以上新增接口的所有规则，适用于下面的其他接口，后面不赘述。

### 查询记账

除了新增数据需要实例化 RecordModel，其他如获取，修改，删除都不需要，直接使用构造函数的静态方法即可。查询数据使用 `RecordModel.find()` 方法。

查询所有数据非常简单，我们根据上面新增接口的介绍，写出代码：

```javascript
router.get('/lists', async (req, res) => {
  // 执行数据库操作
  try {
    let result = await RecordModel.find();
    res.send(respond(result));
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});
```

但是根据我们前面的需求设计，查询接口我们需要查的是小明某一天的消费记录，因此有两个参数作为过滤条件，分别是 `user_id` 和 `created_at`。

RecordModel.find() 可以传递一个对象作为过滤条件，具体的格式可以查看 MongoDB 的[文档](https://docs.mongodb.com/manual/reference/method/db.collection.find/#mongodb-method-db.collection.find)。简单来说，对象的 key 值为字段，value 为字段值，假设小明的 user_id 为 **111**，那么查询小明的数据这样写：

```javascript
RecordModel.find({
  user_id: 111,
});
```

这个简单，但是 created_at 就不同了。因为 created_at 保存的是某个具体的时间点，精确到秒，而我们需要的是查询某一天，并不是等于关系，这个参数应该怎么传呢？

我们换一个思路，既然不能等于，那用大于和小于可以吗？当然可以的，只要大于等于当天的 00:00:00，同时小于当天的 23:59:59，这个筛选条件是不是就成立了？

我们先用 js 原生的 Date 函数分别获取当天的 0 点 和 23 点的时间，这种方法比较费劲，优点是不用引入其他第三方包，后面我们介绍如何用 day.js 更方便的操作时间。

```javascript
//获取当天零点的时间
let start_at = new Date(new Date().setHours(0, 0, 0, 0));
//获取当天 23:59:59 的时间
let end_at = new Date(new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000 - 1);
```

MongoDB 提供了许多查询操作符，其中 `$gt` 表示大于，`$lt` 表示小于，更多操作符请看[文档](https://docs.mongodb.com/v4.4/reference/operator/query/)，我们用这两个操作符，结合前面获取的时间变量，最终的查询是这样：

```javascript
RecordModel.find({
  user_id: 111，
  created_at: {
    $gt: start_at,
    $lt: end_at
  }
})
```

这样我们的查询记账接口就完成了。实际的参数是客户端传过来的，我们对上面的固定值稍作修改，完整代码如下：

```javascript
router.get('/lists', async (req, res) => {
  // 参数验证
  let received = ['created_at', 'user_id']
  let params = transParams(req.query, received)
  // 执行数据库操作
  try {
    let start_at = new Date(new Date(params.created_at).setHours(0, 0, 0, 0))
    let end_at = new Date(new Date(params.created_at).setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000 - 1)
    let result = await RecordModel.find({
      user_id: params.user_id，
      created_at: {
        $gt: start_at,
        $lt: end_at
      }
    })
    res.send(respond(result))
  } catch (error) {
    res.status(error.status || 500).send(error)
  }
})
```

### 修改记账

更新接口我们确定请求地址为`/update`，请求方法为`PUT`。修改数据库中对某条数据一般常用 RecordModel.update() 方法。不过我们的需求是修改一条数据，因此可以用一个更简便的方法：`RecordModel.findOneAndUpdate()`。

顾名思义，`findOneAndUpdate()` 函数的作用是找到一条数据并更新。它接收两个参数，第一个参数 filter 表示过滤条件，第二个参数 update 表示要更新的数据。默认情况下该函数执行成功会返回更新之前的数据。

在 MongoDB 中主键 ID 用 `_id` 字段表示，在新增数据时自动生成。因此 filter 参数用 \_id 字段来匹配；更新数据按照我们的需求是更新价格和备注，也就是 update 参数用 `description` 和 `price` 两个字段匹配。函数调用方式如下：

```javascript
RecordModel.findOneAndUpdate(
  {
    _id: 'xx',
  },
  {
    price: 'xx',
    description: 'xx',
  },
);
```

这里思考一个问题：当前端调用更新接口时，要更新的数据肯定在请求体 body 中传递，那么条件参数 **\_id** 怎么传比较合适？

**方案一**：在请求体中传递。这种方式是将 filter 参数和 update 参数都塞在请求体中，那么请求体的数据会多一层，因此会复杂一些。

**方案二**：用 query 方式传递。这种方式是 get 请求的传参方式，好处是请求体 body 只需要传递 update 参数，URL 地址会是这样：`/update?_id=xxx`

**方案三**：用 params 方式传递。这种方式是在方案二的基础上，对 URL 地址做了简短优化。在定义路由时需要指定路径为 `/update/:_id`，实际请求 URL 是这样：`/update/xxx`。

综合考虑，方案三最为合适，因此最终代码如下：

```javascript
router.put('/update/:_id', async (req, res, next) => {
  // 参数验证
  let { _id } = req.params;
  let received = ['price', 'description'];
  let params = transParams(req.body, received);
  // 执行数据库操作
  try {
    let result = await RecordModel.findOneAndUpdate({ _id }, params);
    res.send(respond(result));
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});
```

### 删除记账

删除接口就比较简单了，参考上面更新接口的 params 传参方式，确定请求地址为`/delete/:_id`，请求方法为`DELETE`。数据库删除某条数据使用 `RecordModel.findOneAndDelete()` 方法，传一个条件参数过滤即可。

```javascript
router.delete('/delete/:_id', async (req, res, next) => {
  // 获取_id
  let { _id } = req.params;
  // 执行数据库操作
  try {
    let result = await RecordModel.findOneAndDelete({ _id });
    res.send(respond(result));
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});
```

## 总结

这一篇我们主要介绍了接口从设计到实现的流程。首先先假定了一个需求场景，然后根据需求分析出了需要哪些接口以及每个接口要实现什么功能。紧接着设计数据模型，敲定数据库字段，然后按照增，查，改，删的顺序一步步完成了满足需求的 4 个接口。

这篇是本小册的第一次接口实战，虽然需求比较简单，但是考虑到一些基础薄弱的同学，每个环节我都介绍的非常细致，告诉大家这一步为什么这么做，有哪些好处。后续的接口实现我就不会写这么细了，所以这一篇非常关键，请确保本篇介绍的许多概念完全明白之后，再看后面的章节。

当然了，如果本篇的内容你已经全部掌握，那么恭喜你，接口开发已经正式入门了！本篇只介绍了基本的数据库操作，实际上的 MongoDB 查询操作非常复杂，建议大家多看[文档](https://docs.mongodb.com/v5.0/reference/operator/query/)。

下一篇我们进入 MongoDB 高级查询的世界 ——— 聚合管道。
