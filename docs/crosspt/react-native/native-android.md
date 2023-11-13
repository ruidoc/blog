# 与 Android 原生交互

React Native 不仅仅是用 JavaScript 开发原生应用。当涉及到一些复杂功能时，还可以直接调用 Android 原生的代码，这通过 `NativeModule` 模块来实现。

`NativeModule` 是 JavaScript 与原生代码通信的桥梁，我们以安卓中的 Java 代码为例，介绍下如何在 React 代码中调用 Java 代码中的方法。

## 安卓部分实现

安卓代码的实现主要分为三步：① 创建原生模块，② 添加原生模块，③ 注册原生模块。

### 1. 创建原生模块

创建原生模块就是新建一个 Java 类，在这个类中定义可被 JavaScript 调用的方法。该类必须继承 `ReactContextBaseJavaModule`，并且类中方法必须被 `@ReactMethod()` 修饰才能被 JavaScript 成功调用，否则无效。

在源码目录（app/java/xxx）下新建一个 NativeClass 类，代码如下：

```java
public class NativeClass extends ReactContextBaseJavaModule {

  NativeClass(ReactApplicationContext context) {
    super(context);
  }

  @Override
  public String getName() {
    return "NativeClass";
  }

  @ReactMethod()
  public void getLogs(String log) {
    Log.d("NativeClass", "getLogs: "+log);
  }
}
```

在 NativeClass 类中定义了 `getLogs()` 方法，该方法允许被 JavaScript 调用。

### 2. 添加原生模块

上一步创建了原生模块 NativeClass 类，现在要把它添加到 `ReactPackage` 中。ReactPackage 是 React Native 注册原生模块的方式。

在源码目录（app/java/xxx）下新建一个 `AppPackage` 类，该类继承 ReactPackage，代码如下：

```java
public class AppPackage implements ReactPackage {

  @Override
  public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
    List<NativeModule> modules = new ArrayList<>();
    modules.add(new NativeClass(reactContext));
    return modules;
  }

  @Override
  public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
    return Collections.emptyList();
  }
}
```

上述代码中，在 `createNativeModules()` 方法内添加了 NativeClass 模块，并返回模块列表。我们可以在此处添加多个原生模块。

### 3. 注册原生模块

React Native 通过 ReactPackage 来注册原生模块，我们需要在默认生成的 `MainApplication` 类中注册原生模块。

找到 `new DefaultReactNativeHost()` 代码块，注册上一步创建的 AppPackage 类，代码如下：

```java
new DefaultReactNativeHost(this) {
  @Override
  protected List<ReactPackage> getPackages() {
    @SuppressWarnings("UnnecessaryLocalVariable")
    List<ReactPackage> packages = new PackageList(this).getPackages();
    packages.add(new AppPackage());
    return packages;
  }
}
```

上面的代码中的 `getPackages()` 方法，添加了 AppPackage 类并返回，这样我们模块注册的部分就实现了。

最后，因为原生代码不存在热更新，所以修改完成后，使用 `yarn run android` 命令重新运行项目。

## JS 部分实现

JavaScript 中的实现方式比较简单，首先导入 `NativeModules`：

```js
import { NativeModules } from 'react-native';
```

接着在 NativeModules 中导出我们注册的 NativeClass：

```js
const { NativeClass } = NativeModules;
```

现在，你可以调用 NativeClass 类中被 @ReactMethod() 修饰的任意方法了，如：

```js
NativeClass.getLogs('呵呵');
```

现在打开你的 Android Studio，即可看到 Android 端打印的日志。

## 原生代码向 JS 发送事件

原生 Android 端可以接收到一些系统事件，比如电池耗尽、网络断开等。有时候需要在 React Native 中捕获这些事件，那么就可以通过原生代码主动向 JavaScript 推送事件。

（1）发送事件需要 ReactContext，首先我们在原生模块中将其保存为一个类属性：

```java
public class NativeClass extends ReactContextBaseJavaModule {
  ReactApplicationContext reactContext;
  NativeClass(ReactApplicationContext context) {
    super(context);
    reactContext = context;
  }
}
```

（2）新建 sendEvent() 方法，使用 `RCTDeviceEventEmitter` 在 ReactContext 下获取 JSModule，并向该 JSModule（对应 JavaScript 代码）发送事件，代码如下：

```java
private void sendEvent(
  ReactContext reactContext,
  String eventName,
  WritableMap params
) {
 reactContext
  .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
  .emit(eventName, params);
}
```

（3）定义一个 toToast()方法，向 JavaScript 发送一个 `toast` 事件并传参，方法如下：

```java
public void toToast() {
  WritableMap params = Arguments.createMap();
  params.putInt("msg", "我来自原生模块");
  this.sendEvent(reactContext, "toast", params);
}
```

（4）在 JavaScript 中通过 `NativeEventEmitter` 注册监听器并监听事件，代码如下：

```js
import { NativeModules, NativeEventEmitter } from 'react-native';
const { NativeClass } = NativeModules;

useEffect(() => {
  let emitter = new NativeEventEmitter(NativeClass);
  let listener = emitter.addListener('toast', (event) => {
    console.log('收到参数：', event);
  });
  return async () => {
    listener.remove();
  };
});
```

通过以上四个步骤，就可以实现安卓原生模块主动向 JavaScript 发送事件了。
