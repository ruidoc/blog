# 搭建前端监控，如何采集异常数据？

大家好，我是杨成功。

前两篇，我们介绍了为什么前端应该有监控系统，以及搭建前端监控的总体步骤，前端监控的 Why 和 What 想必你已经明白了。接下来我们解决 How 如何实现的问题，详细介绍每一步的实现方案。

本篇我们介绍，前端如何采集数据，先从收集异常数据开始。

## 什么是异常数据？

异常数据，是指前端在操作页面的过程中，触发的执行异常或加载异常，此时浏览器会抛出来报错信息。

比如说你的前端代码用了个未声明的变量，此时控制台会打印出红色错误，告诉你报错原因。或者是接口请求出错了，在网络面板内也能查到异常情况，是请求发送的异常，还是接口响应的异常。

在我们实际的开发场景中，前端捕获的异常主要是分两个大类，`接口异常` 和 `前端异常`，我们分别看下这两大类异常怎么捕获。

## 接口异常

接口异常一定是在请求的时候触发。前端目前大部分的请求是用 `axios` 发起的，所以只要获取 axios 可能发生的异常即可。

如果你用 Promise 的写法，则用 `.catch` 捕获：

```js
axios
  .post('/test')
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    // err 就是捕获到的错误对象
    handleError(err);
  });
```

如果你用 async/await 的写法，则用 `try..catch..` 捕获：

```js
async () => {
  try {
    let res = await axios.post('/test');
    console.log(res);
  } catch (err) {
    // err 就是捕获到的错误对象
    handleError(err);
  }
};
```

当捕获到异常之后，统一交给 `handleError` 函数处理，这个函数会将接收到的异常进行处理，并调用 `上报接口` 将异常数据传到服务器，从而完成采集。

上面我们写的异常捕获，逻辑上是没问题的，实操起来就会发现第一道坎：**页面这么多，难道每个请求都要包一层 catch 吗？**

是啊，如果我们是新开发一个项目，在开始的时候就规定每个请求要包一层 catch 也无可厚非，但是如果是在一个已有的规模还不小的项目中接入前端监控，这时候在每个页面或每个请求 catch 显然是不现实的。

所以，为了最大程度的降低接入成本，减少侵入性，我们是用第二种方案：**在 axios 拦截器中捕获异常**。

前端项目，为了统一处理请求，比如 401 的跳转，或者全局错误提示，都会在全局写一个 axios 实例，为这个实例添加拦截器，然后在其他页面中直接倒入这个实例使用，比如：

```js
// 全局请求：src/request/axios.js

const instance = axios.create({
  baseURL: 'https://api.test.com'
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default instance
```

然后在具体的页面中这样发起请求：

```js
// a 页面：src/page/a.jsx
import http from '@/src/request/axios.js';

async () => {
  let res = await http.post('/test');
  console.log(res);
};
```

这样的话，我们发现每个页面的请求都会走全局 axios 实例，所以我们只需要在全局请求的位置捕获异常即可，就不需要在每个页面捕获了，这样接入成本会大大降低。

按照这个方案，结下来我们在 `src/request/axios.js` 这个文件中动手实施。

### 拦截器中捕获异常

首先我们为 axios 添加响应拦截器：

```js
// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 发生异常会走到这里
    if (error.response) {
      let response = error.response;
      if (response.status >= 400) {
        handleError(response);
      }
    } else {
      handleError(null);
    }
    return Promise.reject(error);
  },
);
```

响应拦截器的第二个参数是在发生错误时执行的函数，参数就是异常。我们首先要判断是否存在 `error.response`，存在就说明接口有响应，也就是接口通了，但是返回错误；不存在则说明接口没通，请求一直挂起，多数是接口崩溃了。

如果有响应，首先获取状态码，根据状态码来判断什么时候需要收集异常。上面的判断方式简单粗暴，只要状态码大于 400 就视为一个异常，拿到响应数据，并执行上报逻辑。

如果没有响应，可以看作是接口超时异常，调用异常处理函数时传一个 `null` 即可。

## 前端异常

上面我们介绍了在 axios 拦截器中如何捕获接口异常，这部分我们再介绍如何捕获前端异常。

前端代码捕获异常，最常用的方式就是用 try..catch.. 了，任意同步代码块都可以放到 `try` 块中，只要发生异常就会执行 catch：

```js
try {
  // 任意同步代码
} catch (err) {
  console.log(err);
}
```

上面说“任意同步代码”而不是“任意代码”，主要是普通的 Promise 写法 try..catch.. 是捕获不到的，只能用 `.catch()` 捕获，如：

```js
try {
  Promise.reject(new Error('出错了')).catch((err) => console.log('1：', err));
} catch (err) {
  console.log('2：', err);
}
```

把这段代码丢进浏览器，打印结果是：

```js
1： Error: 出错了
```

很明显只是 .catch 捕获到了异常。不过与上面接口异常的逻辑一样，这种方式处理当前页面异常没什么问题，但从整个应用来看，这样捕获异常侵入性强，接入成本高，所以我们的思路依然是全局捕获。

全局捕获 js 的异常也比较简单，用 `window.addEventLinstener('error')` 即可：

```js
// js 错误捕获
window.addEventListener('error', (error) => {
  // error 就是js的异常
});
```

### 为啥不用 window.onerror ？

这里很多小伙伴有疑问，为什么不用 `window.onerror` 全局监听呢？`window.addEventLinstener('error')` 和 `window.onerror` 有什么区别呢？

首先这两个函数功能基本一致，都可以全局捕获 js 异常。但是有一类异常叫做 `资源加载异常`，就是在代码中引用了不存在的图片，js，css 等静态资源导致的异常，比如：

```js
const loadCss = ()=> {
  let link = document.createElement('link')
    link.type = 'text/css'
    link.rel = 'stylesheet'
    link.href = 'https://baidu.com/15.css'
    document.getElementsByTagName('head')[10].append(link)
}
render() {
  return <div>
    <img src='./bbb.png'/>
    <button onClick={loadCss}>加载样式<button/>
  </div>
}
```

上述代码中的 `baidu.com/15.css` 和 `bbb.png` 是不存在的，JS 执行到这里肯定会报一个资源找不到的错误。但是默认情况下，上面两种 window 对象上的全局监听函数都监听不到这类异常。

因为资源加载的异常只会在当前元素触发，异常不会冒泡到 window，因此监听 window 上的异常是捕捉不到的。那怎么办呢？如果你熟悉 DOM 事件你就会明白，既然冒泡阶段监听不到，那么在捕获阶段一定能监听到。

方法就是给 `window.addEventListene` 函数指定第三个参数，很简单就是 `true`，表示该监听函数会在捕获阶段执行，这样就能监听到资源加载异常了。

```js
// 捕获阶段全局监听
window.addEventListene(
  'error',
  (error) => {
    if (error.target != window) {
      console.log(error.target.tagName, error.target.src);
    }
    handleError(error);
  },
  true,
);
```

上述方式可以很轻松的监听到图片加载异常，这就是为什么更推荐 `window.addEventListene` 的原因。不过要得，第三个参数设为 `true`，监听事件捕获，就可以全局捕获到 JS 异常和资源加载异常。

需要特别注意，`window.addEventListene` 同样不能捕获 Promise 异常。不管是 `Promise.then()` 写法还是 `async/await` 写法，发生异常时都不能捕获。

因此，我们还需要全局监听一个 `unhandledrejection` 函数来捕获未处理的 Promise 异常。

```js
// promise 错误捕获
window.addEventListener('unhandledrejection', (error) => {
  // 打印异常原因
  console.log(error.reason);
  handleError(error);
  // 阻止控制台打印
  error.preventDefault();
});
```

`unhandledrejection` 事件会在 Promise 发生异常并且没有指定 `catch` 的时候触发，相当于一个全局的 Promise 异常兜底方案。这个函数会捕捉到运行时意外发生的 Promise 异常，这对我们排错非常有用。

默认情况下，Promise 发生异常且未被 catch 时，会在控制台打印异常。如果我们想阻止异常打印，可以用上面的 `error.preventDefault()` 方法。

## 异常处理函数

前面我们在捕获到异常时调用了一个异常处理函数 `handleError`，所有的异常和上报逻辑统一在这个函数内处理，接下来我们实现这个函数。

```js
const handleError = (error: any, type: 1 | 2) {
  if(type == 1) {
    // 处理接口异常
  }
  if(type == 2) {
    // 处理前端异常
  }
}
```

为了区分异常类型，函数新加了第二个参数 type 表示当前异常属于前端还是接口。在不同的场景中使用如下：

- 处理前端异常：`handleError(error, 1)`
- 处理接口异常：`handleError(error, 2)`

### 处理接口异常

处理接口异常，我们需要将拿到的 error 参数解析，然后取到需要的数据。接口异常一般需要的数据字段如下：

- `code`：http 状态码
- `url`：接口请求地址
- `method`：接口请求方法
- `params`：接口请求参数
- `error`：接口报错信息

这些字段都可以在 error 参数中获取，方法如下：

```js
const handleError = (error: any, type: 1 | 2) {
  if(type == 1) {
    // 此时的 error 响应，它的 config 字段中包含请求信息
    let { url, method, params, data } = error.config
    let err_data = {
       url, method,
       params: { query: params, body: data },
       error: error.data?.message || JSON.stringify(error.data),
    })
  }
}
```

config 对象中的 `params` 表示 GET 请求的 query 参数，`data` 表示 POST 请求的 body 参数，所以我在处理参数的时候，将这两个参数合并为一个，赋值给 form。

```js
params: { query: params, body: data }
```

还有一个 `form.error` 表示错误信息，这个获取方式要根据你的接口返回格式来拿。要避免获取到接口可能返回的超长错误信息，多半是接口没处理，这样可能会导致写入数据失败，要提前与后台规定好。

### 处理前端异常

前端异常异常大多数就是 js 异常，异常对应到 js 的 `Error` 对象，在处理之前，我们先看 Error 有哪几种类型：

- `ReferenceError`：引用错误
- `RangeError`：超出有效范围
- `TypeError`：类型错误
- `URIError`：URI 解析错误

这几类异常的引用对象都是 `Error`，因此可以这样获取：

```js
const handleError = (error: any, type: 1 | 2) {
  if(type == 2) {
    let err_data = null
    // 监测 error 是否是标准类型
    if(error instanceof Error) {
      let { name, message } = error
      err_data = {
        type: name,
        error: message
      }
    } else {
      err_data = {
        type: 'other',
        error: JSON.strigify(error)
      }
    }
  }
}
```

上述判断中，首先判断异常是否是 `Error` 的实例。事实上绝大部分的代码异常都是标准的 JS Error，但我们这里还是判断一下，如果是的话直接获取异常类型和异常信息，不是的话将异常类型设置为 `other` 即可。

我们随便写一个异常代码，看一下捕获的结果：

```js
function test() {
  console.aaa('ccc');
}
test();
```

然后捕获到的异常是这样的：

```js
const handleError = (error: any) => {
  if (error instanceof Error) {
    let { name, message } = error;
    console.log(name, message);
    // 打印结果：TypeError console.aaa is not a function
  }
};
```

## 获取环境数据

获取环境数据的意思是，不管是接口异常还是前端异常，除了异常本身的数据之外，我们还需要一些其他信息来帮助我们更快更准的定位到哪里出错了。

这类数据我们称之为 “环境数据”，就是触发异常时所在的环境。比如是谁在哪个页面的哪个地方触发的错误，有了这些，我们就能马上找到错误来源，再根据异常信息解决错误。

环境数据至少包括下面这些：

- `app`：应用的名称/标识
- `env`：应用环境，一般是开发，测试，生产
- `version`：应用的版本号
- `user_id`：触发异常的用户 ID
- `user_name`：触发异常的用户名
- `page_route`：异常的页面路由
- `page_title`：异常的页面名称

`app` 和 `version` 都是应用配置，可以判断异常出现在哪个应用的哪个版本。这两个字段我建议直接获取 `package.json` 下的 `name` 和 `version` 属性，在应用升级的时候，及时修改 version 版本号即可。

其余的字段，需要根据框架的配置获取，下面我分别介绍在 Vue 和 React 中如何获取。

### 在 Vue 中

在 Vue 中获取用户信息一般都是直接从 Vuex 里面拿，如果你的用户信息没有存到 Vuex 里，从 localStorage 里获取也是一样的。

如果在 Vuex 里，可以这样实现：

```js
import store from '@/store'; // vuex 导出目录
let user_info = store.state;
let user_id = user_info.id;
let user_name = user_info.name;
```

用户信息存在状态管理中，页面路由信息一般是在 `vue-router` 中定义。前端的路由地址可以直接从 vue-router 中获取，页面名称可以配置在 `meta` 中，如：

```js
{
  path: '/test',
  name: 'test',
  meta: {
    title: '测试页面'
  },
  component: () => import('@/views/test/Index.vue')
},
```

这样配置之后，获取当前页面路由和页面名称就简单了：

```js
window.vm = new Vue({...})

let route = vm.$route
let page_route = route.path
let page_title = route.meta.title
```

最后一步，我们再获取当前环境。当前环境用一个环境变量 `VUE_APP_ENV` 表示，有三个值：

- `dev`：开发环境
- `test`：测试环境
- `pro`：生产环境

然后在根目录下新建三个环境文件，写入环境变量：

- `.env.development`：VUE_APP_ENV=dev
- `.env.staging`：VUE_APP_ENV=test
- `.env.production`：VUE_APP_ENV=pro

现在获取 `env` 环境时就可以这么获取：

```js
{
  env: process.env.VUE_APP_ENV;
}
```

最后一步，执行打包时，传入模式以匹配对应的环境文件：

```sh
# 测试环境打包
$ num run build --mode staging
# 生产环境打包
$ num run build --mode production
```

获取到环境数据，再拼上异常数据，我们就准备好了数据等待上报了。

### 在 React 中

和 Vue 一样，用户信息可以直接从状态管理里拿。因为 React 中没有全局获取当前旅游的快捷方式，所以页面信息我也会放在状态管理里面。我用的状态管理是 Mobx，获取方式如下：

```js
import { TestStore } from '@/stores'; // mobx 导出目录
let { user_info, cur_path, cur_page_title } = TestStore;
// 用户信息：user_info
// 页面信息：cur_path，cur_page_title
```

这样的话，就需要在每次切换页面时，更新 mobx 里的路由信息，怎么做呢？

其实在根路由页（一般是首页）的 `useEffect` 中监听即可：

```js
import { useLocation } from 'react-router';
import { observer, useLocalObservable } from 'mobx-react';
import { TestStore } from '@/stores';

export default observer(() => {
  const { pathname, search } = useLocation();
  const test_inst = useLocalObservable(() => TestStore);
  useEffect(() => {
    test_inst.setCurPath(pathname, search);
  }, [pathname]);
});
```

获取到用户信息和页面信息，接下来就是当前环境了。和 Vue 一样通过 `--mode` 来指定模式，并加载相应的环境变量，只不过设置方法略有不同。大多数的 React 项目可能都是用 `create-react-app` 创建的，我们以此为例介绍怎么修改。

首先，打开 `scripts/start.js` 文件，这是执行 npm run start 时执行的文件，我们在开头部分第 6 行加代码：

```js
process.env.REACT_APP_ENV = 'dev';
```

没错，我们指定的环境变量就是 `REACT_APP_ENV`，因为只有 `REACT_` 开头的环境变量可被读取。

然后再修改 `scripts/build.js` 文件的第 48 行，修改后如下：

```js
if (argv.length >= 2 && argv[0] == '--mode') {
  switch (argv[1]) {
    case 'staging':
      process.env.REACT_APP_ENV = 'test';
      break;
    case 'production':
      process.env.REACT_APP_ENV = 'pro';
      break;
    default:
  }
}
```

此时获取 `env` 环境时就可以这么获取：

```js
{
  env: process.env.REACT_APP_ENV;
}
```

## 总结

经过前面一系列操作，我们已经比较全面的获取到了异常数据，以及发生异常时到环境数据，接下来就是调用上报接口，将这些数据传给后台存起来，我们以后查找和追踪就很方便了。

如果你也需要前端监控，不妨花上半个小时，按照文中介绍的方法收集一下异常数据，相信对你很有帮助。
