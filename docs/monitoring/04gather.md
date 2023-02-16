# 搭建前端监控，采集用户行为的 N 种姿势

大家好，我是杨成功。

上一篇我们详细介绍了前端如何采集异常数据。采集异常数据是为了随时监测线上项目的运行情况，发现问题及时修复。在很多场景下，除了异常监控有用，收集用户的行为数据同样有意义。

怎么定义行为数据？顾名思义，就是用户在使用产品过程中产生的行为轨迹。比如去过哪几个页面，点过哪几个按钮，甚至在某个页面停留了多长时间，某个按钮点击了多少次，如果有需求都可以记录下来。

但是记录行为数据是一个和业务紧密关联的事情，不可能把每个用户每一步操作都极其详细的记录下来，这样会产生极其庞大的数据，很显然不现实。

合理的做法是，根据产品的实际情况评估，哪个模块哪个按钮需要重点记录，则可以采集的详细一些；哪些模块不需要重点关注，则简单记录一下基本信息。

根据这个逻辑，我们可以把行为数据分为两类：

1. 通用数据
2. 特定数据

下面分别介绍这两类数据该如何收集。

## 通用数据

在一个产品中，用户最基本的行为就是切换页面。用户使用了哪些功能，也能从切换页面中体现出来。因此通用数据一般是在页面切换时产生，表示某个用户访问了某个页面。

页面切换对应到前端就是路由切换，可以通过监听路由变化来拿到新页面的数据。Vue 在全局路由守卫中监听路由变化，任意路由切换都能执行这里的回调函数。

```js
// Vue3 路由写法
const router = createRouter({ ... })
router.beforeEach(to => {
  // to 代表新页面的路由对象
  recordBehaviors(to)
})
```

React 在组件的 useEffect 中实现相同的功能。不过要注意一点，监听所有路由变化，则需要所有路由都经过这个组件，监听才有效果。具体的方法是配置路由时加 `*` 配置：

```js
import HomePage from '@/pages/Home'
<Route path="*" component={HomePage} />,
```

然后在这个组件的的 useEffect 中监听路由变化：

```js
// HomePage.jsx
const { pathname } = useLocation();
useEffect(() => {
  // 路由切换这个函数触发
  recordBehaviors(pathname);
}, [pathname]);
```

上面代码中，在路由切换时都调用了 `recordBehaviors()` 方法并传入了参数。Vue 传的是一个路由对象，React 传的是路由地址，接下来就可以在这个函数内收集数据了。

明确了在哪里收集数据，我们还要知道收集哪些数据。收集行为数据最基本的字段如下：

- `app`：应用的名称/标识
- `env`：应用环境，一般是开发，测试，生产
- `version`：应用的版本号
- `user_id`：当前用户 ID
- `user_name`：当前用户名
- `page_route`：页面路由
- `page_title`：页面名称
- `start_at`：进入时间
- `end_at`：离开时间

上面的字段中，应用标识、环境、版本号统称应用字段，用于标志数据的来源。其他字段主要分为 **用户**，**页面**，**时间**三类，通过这三类数据就可以简单的判断出一件事：谁到过哪个页面，并停留了多长时间。

应用字段的配置和获取方式我们在上一节 [搭建前端监控，如何采集异常数据？](https://juejin.cn/post/7107229989493276703) 中讲过，就不做多余介绍了，获取字段的方式都是通用的。

下面介绍其他的几类数据如何获取。

### 获取用户信息

现代前端应用存储用户信息的方式基本都是一样的，localStorage 存一份，状态管理里存一份。因此获取用户信息从这两处的任意一处获得即可。这里简单介绍下如何从状态管理中获取。

最简单的方法，在函数 `recordBehaviors()` 所处的 js 文件中，直接导入用户状态：

```js
// 从状态管理里中导出用户数据
import { UserStore } from '@/stores';
let { user_id, user_name } = UserStore;
```

这里的 `@/stores` 指向我项目中的文件 `src/stores/index.ts`，表示状态管理的入口文件，使用时替换成自己项目的实际位置。实际情况中还会有用户数据为空的问题，这里需要单独处理一下，方便我们在后续的数据查看中能看出分别：

```js
import { UserStore } from '@/stores';

// 收集行为函数
const recordBehaviors = ()=> {
  let report_date = {
    ...
  }
  if(UserStore) {
    let { user_id, user_name} = UserStore
    report_date.user_id = user_id || 0
    report_date.user_name = user_name || '未命名'
  } else {
    report_date.user_id = user_id || -1
    report_date.user_name = user_name || '未获取'
  }
}
```

上面代码中，首先判断了状态管理中是否有用户数据，如果有则获取，没有则指定默认值。这里指定默认值的细节要注意，不是随便指定的，比如 user_id 的默认值有如下意义：

- `user_id 为 0`：表示有用户数据，但没有 user_id 字段或该字段为空
- `user_id 为 -1`：表示没有用户数据，因而 user_id 字段获取不到

用户数据是经常容易出错的地方，因为涉及到登录状态和权限等复杂问题。指定了上述默认值后，就可以从收集到的行为数据中判断出某个页面用户状态是否正常。

### 获取页面信息

前面我们在监听路由变化的地方调用了 recordBehaviors 函数并传入了参数，页面信息可以从参数中拿到，我们先看在 Vue 中怎么获取：

```js
// 路由配置
{
  path: '/test',
  meta: {
    title: '测试页面'
  },
  component: () => import('@/views/test/Index.vue')
}

// 获取配置
const recordBehaviors = (to)=> {
  let page_route = to.path
  let page_title = to.meta.title
}
```

Vue 中比较简单，可以直接从参数中拿到页面数据。相比之下，React 的参数只是一个路由地址，想拿到页面名称还需要做单独处理。

一般在设计权限时，我们会在服务端会维护一套路由数据，包含路由地址和名称。路由数据在登录后获取，存在状态管理中，那么有了 pathname 就可以从路由数据中找到对应的路由名称。

```js
// React 中
import { RouteStore } from '@/stores';

const recordBehaviors = (pathname) => {
  let { routers } = RouteStore; // 取出路由数据
  let route = routers.find((row) => (row.path = pathname));
  if (route) {
    let page_route = route.path;
    let page_title = route.title;
  }
};
```

这样，页面信息的 page_route、page_title 两个字段也拿到了。

### 设置时间

行为数据中用两个字段 `start_at`、`end_at` 分别表示用户进入页面和离开页面的时间。这两个字段非常重要，我们在后续使用数据的时候可以判断出很多信息，比如：

- 某个用户在某个页面停留了多久？
- 某个段时间内，某个用户停留在哪几个页面？
- 某个时间段内，哪个页面的用户停留时间最长？
- 某个页面，哪些用户的使用率最高？

还有很多信息，都能根据这两个时间字段判断。开始时间很好办，函数触发时直接获取当前时间：

```js
var start_at = new Date();
```

结束时间这里需要考虑的情况比较多。首先要确定数据什么时候上报？用户进入页面后上报，还是离开页面时上报？

如果进入页面时上报，可以保证行为数据一定会被记录，不会丢失，但此时 end_at 字段必然为空。这样的话，就需要在离开页面时再调接口，将这条记录的 end_time 更新，这种方式的实现比较麻烦一些：

```js
// 进入页面时调用
const recordBehaviors = () => {
  let report_date = {...} // 此时 end_at 为空
  http.post('/behaviors/insert', report_date).then(res=> {
    let id = res.id // 数据 id
    localStorage.setItem('CURRENT_BEHAVIOR_ID', id)
  })
}

// 离开页面时调用：
const updateBehaviors = ()=> {
  let id = localStorage.getItem('CURRENT_BEHAVIOR_ID')
  let end_at = new Date()
  http.post('/behaviors/update/'+id, end_at) // 根据 id 更新结束时间
  localStorage.removeItem('CURRENT_BEHAVIOR_ID')
}
```

上面代码中，进入页面先上报数据，并保存下 id，离开页面再根据 id 更新这条数据的结束时间。

如果在离开页面时上报，那么就要保证离开页面前上报接口已经触发，否则会导致数据丢失。在满足这个前提条件下，上报逻辑会变成这样：

```js
// 进入页面时调用
const recordBehaviors = () => {
  let report_date = {...} // 此时 end_at 为空
  localStorage.setItem('CURRENT_BEHAVIOR', JSON.stringify(report_date));
}

// 离开页面时调用
const reportBehaviors = () => {
  let end_at = new Date()
  let report_str = localStorage.getItem('CURRENT_BEHAVIOR')
  if(report_str) {
    let report_date = JSON.parse(report_str)
    report_date.end_at = end_at
    http.post('/behaviors/insert', report_date)
  } else {
    console.log('无行为数据')
  }
}
```

对比一下这两种方案，第一种的弊端是接口需要调两次，这会使接口请求量倍增。第二种方案只调用一次，但是需要特别注意可靠性处理，总体来说第二种方案更好些。

## 特定数据

除了通用数据，大部分情况我们还要在具体的页面中收集某些特定的行为。比如某个关键的按钮有没有点击，点了多少次；或者某个关键区域用户有没有看到，看到（曝光）了多少次等等。

收集数据还有一个更专业的叫法 ———— 埋点。直观理解是，哪里需要上报数据，就埋一个上报函数进去。

通用数据针对所有页面自动收集，特定数据就需要根据每个页面的实际需求手动添加。以一个按钮为例：

```js
<button onClick={onClick}>点击</button>;
const onClick = (e) => {
  // console.log(e);
  repoerEvents(e);
};
```

上面代码中，我们想记录这个按钮的点击情况，所以做了一个简单的埋点 ———— 在按钮点击事件中调用 `repoerEvents()` 方法，这个方法内部会收集数据并上报。

这是最原始的埋点方式，直接将上报方法放到事件函数中。repoerEvents() 方法接收一个事件对象参数，在参数中获取需要上报的事件数据。

特定数据与通用数据的许多字段是一样的，收集特定数据需要的基本字段如下：

- `app`：应用的名称/标识
- `env`：应用环境，一般是开发，测试，生产
- `version`：应用的版本号
- `user_id`：当前用户 ID
- `user_name`：当前用户名
- `page_route`：页面路由
- `page_title`：页面名称
- `created_at`：触发时间
- `event_type`：事件类型
- `action_tag`：行为标识
- `action_label`：行为描述

这些基本字段中，前 7 个字段与前面通用数据的获取完全一样，这里就不赘述了。实际上特定数据需要获取的专有字段只有 3 个：

- `event_type`：事件类型
- `action_tag`：行为标识
- `action_label`：行为描述

这三个字段也非常容易获取。event_type 表示事件触发的类型，比如点击、滚动、拖动等，可以在事件对象中拿到。action_tag 和 action_label 是必须指定的属性，表示本次埋点的标识和文字描述，用于在后续的数据处理时方便查阅和统计。

了解了采集特定数据是怎么回事，接下来我们用代码实现。

### 手动埋点上报

假设要为登录按钮做埋点，按照上面的数据采集方式，我们书写代码如下：

```js
<button data-tag="user_login" data-label="用户登录" onClick={onClick}>
  登录
</button>;
const onClick = (e) => {
  // console.log(e);
  repoerEvents(e);
};
```

代码中，我们通过元素的自定义属性传递了 tag 和 label 两个标识，用于在上报函数中获取。

上报函数 repoerEvents() 代码逻辑如下：

```js
// 埋点上报函数
const repoerEvents = (e)=> {
  let report_date = {...}
  let { tag, label } = e.target.dataset
  if(!tag || !label) {
    return new Error('上报元素属性缺失')
  }
  report_date.event_type = e.type
  report_date.action_tag = tag
  report_date.action_label = label

  // 上报数据
  http.post('/events/insert', report_date)
}
```

这样就实现了一个基本的特定数据埋点上报功能。

### 全局自动上报

现在我们回过头来梳理一下这个上报流程，虽然基本功能实现了，但是还有些不合理之处，比如：

- 必须为元素指定事件处理函数
- 必须为元素添加自定义属性
- 在原有事件处理函数中手动添加埋点，侵入性高

首先我们的埋点方式是基于事件的，也就是说，不管元素本身是否需要事件处理，我们都要给他加上，并在函数内部调用 repoerEvents() 方法。如果一个项目需要埋点的地方非常多，这种方式的接入成本就会非常高。

参考之前做异常监控的逻辑，我们换一个思路：能否全局监听事件自动上报呢？

思考一下，如果要做全局监听事件，那么只能监听需要埋点的元素的事件。那么如何判断哪些元素需要埋点呢？

上面我们为埋点的元素指定了 `data-tag` 和 `data-label` 两个自定义属性，那是不是根据这两个自定义属性判断就可以？我们来试验一下：

```js
window.addEventListener('click', (event) => {
  let { tag, label, trigger } = event.target.dataset;
  if (tag && label && trigger == 'click') {
    // 说明该元素需要埋点
    repoerEvents(event);
  }
});
```

上面代码还多判断了一个自定义属性 dataset.trigger，表示元素在哪种事件触发时需要上报。全局监听事件需要这个标识，这样可避免事件冲突。

添加全局监听后，收集某个元素的特定数据就简单了，方法如下：

```js
<button data-tag="form_save" data-label="表单保存" data-trigger="click">
  保存
</button>
```

试验证明，上述全局处理的方式是可行的，这样的话就不需要在每一个元素上添加或修改事件处理函数了，只需要在元素中添加三个自定义属性 `data-tag`，`data-label`，`data-trigger` 就能自动实现数据埋点上报。

### 组件上报

上面全局监听事件上报的方式已经比手动埋点高效了许多，现在我们再换一个场景。

一般情况下当埋点功能成熟之后，会封装成一个 SDK 供其他项目使用。如果我们将采集数据按照 SDK 的思路实现，让开发者在全局监听事件，是不是一个好的方式呢？

显然是不太友好的。如果是一个 SDK，那么最好的方式是将所有内容聚合成一个组件，在组件内实现上报的所有功能，而不是让使用者在项目中添加监听事件。

封装组件的话，那么组件的功能最好是将要添加埋点的元素包裹，这样自定义元素也就不需要指定了，而转为组件的属性，然后在组件内实现事件监听。

以 React 为例，我们看一下如何将上面的采集功能封装为组件：

```js
import { useEffect, useRef } from 'react';

const CusReport = (props) => {
  const dom = useRef(null);
  const handelEvent = () => {
    console.log(props); // {tag:xx, label:xx, trigger:xx}
    repoerEvents(props);
  };
  useEffect(() => {
    if (dom.current instanceof HTMLElement) {
      dom.current.addEventListener(props.trigger, handelEvent);
    }
  }, []);
  return (
    <span ref={dom} className="custom-report">
      {props.children}
    </span>
  );
};

export default CusReport;
```

组件使用方式如下：

```js
<CusReport tag="test" label="功能测试" trigger="click">
  <button>测试</button>
</CusReport>
```

这样就比较优雅了，不需要修改目标元素，只要把组件包裹在目标元素之外即可。

# 总结

本文介绍了搭建前端监控如何采集行为数据，将数据分为 **通用数据** 和 **特定数据** 两个大类分别处理。同时也介绍了多种上报数据的方式，不同的场景可以选择不同的方式。

其中的数据部分只介绍了实现功能的基础字段，实际情况中可以根据自己的业务需求添加。

许多小伙伴留言这套前端监控能否开源，肯定是要开源的，不过内容比较多我还在做，等到基本完善了我会发一个版本，感谢小伙伴们的关注。

本系列文章如下，欢迎一键三连：

- [为什么前端不能没有监控系统？](https://juejin.cn/post/7096675256986763295)
- [前端监控的搭建步骤，别再一头雾水了！](https://juejin.cn/post/7100395869286957092)
- [搭建前端监控，如何采集异常数据？](https://juejin.cn/post/7107229989493276703)

更多干货请关注公众号 [程序员成功](https://www.ruims.top/static/wxpub.png)，添加作者微信进前端群。
