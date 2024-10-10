# 前端监控平台

监控平台是一项非常有意义和广阔的平台，主要有以下方向：

- 异常监控
- 行为监控（PV、UV）
- 性能监控（Prefrent API）

如何统计 PV 和 UV？

- PV（页面浏览量）：在路由拦截器、或监听路由变化时调用。
- UV（独立访客数）：通过在 `LocalStorage` 中存储唯一标识（UUID），标记不同的访客。

```js
router.afterEach((to) => {
  recordPageView(to.fullPath); // 记录PV
  const visitorId = getVisitorId();
  trackVisitor(visitorId, to.fullPath); // 记录UV
});
```

## 异常监控

全局异常监控，可以跨平台实现。

### Web 端

全局拦截打印异常（包括第三方）

```js
console.error = new Proxy(console.error, {
  apply(target, ctx, args) {
    console.log('调用了：', args);
  },
});
console.error('777');
```

全局拦截 XHR，需要重新该方法，如下：

```js
(function (global) {
  var _XMLHttpRequest = global.XMLHttpRequest;

  global.XMLHttpRequest = function XMLHttpRequest() {
    var xhr = new _XMLHttpRequest();

    // 监听 open 事件
    var _open = xhr.open;
    xhr.open = function (method, url, async, user, password) {
      console.log('Opening connection for ' + method + ' request to ' + url);
      _open.call(this, method, url, async, user, password);
    };

    // 监听 send 事件
    var _send = xhr.send;
    xhr.send = function (data) {
      console.log('Sending data: ', data);
      _send.call(this, data);
    };

    // 监听 onload/onreadystatechange 事件
    xhr.onload = function () {
      console.log('Response received with status: ' + this.status);
    };

    return xhr;
  };
})(this);
```

### 前端异常监控

捕获阶段监听 error 事件，可以获取 JavaScript `同步异常`和`资源加载`异常。

```js
// 捕获阶段全局监听
window.addEventListener(
  'error',
  (error) => {
    console.log(error.target);
  },
  true,
);
```

全局捕获 Promise 异常。

```js
window.addEventListener('unhandledrejection', (error) => {
  // 打印异常原因
  console.log(error.reason);
  // 阻止控制台打印
  error.preventDefault();
});
```

小程序异常监听：

```js
// 监听小程序错误事件。如脚本错误或 API 调用报错等
// 等于 App.onError();
Taro.onError(callback);

// 监听 Promise 异常事件。
// 等于 App.onUnhandledRejection()
Taro.onUnhandledRejection(callback);

// 监听页面未找到事件
Taro.onPageNotFound(callback);
```

小程序 HTTP 请求异常监听：

```js
wx.request({
  success() {
    console.log('成功');
  },
  fail() {
    console.log('失败');
  },
});
```

## 小程序如何监听页面切换？

如果是 Taro：在全局公共页面组件（CusPage）中，通过 useEfect() 来监听组件首次渲染。

如果是小程序：通过 Page() 中的 onLoad() 事件来记录页面的访问。监听 onUnload() 来监听页面卸载。

## React Native 如何监听页面切换？

在全局公共页面组件（CusPage）中，监听 navigation 的 `focus` 事件：

```js
const navigation = useNavigation();

useEffect(() => {
  let unsubscribe = navigation.addListener('focus', () => {
    console.log('Screen focused');
  });
  // 返回一个清理函数，在组件卸载时取消监听
  return unsubscribe;
}, [navigation]);
```
