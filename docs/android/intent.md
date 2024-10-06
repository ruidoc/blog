---
order: 3
---

# Intent 详解

Intent 并不是 Android 应用程序四大核心组件之一，但是其重要性无可替代。

`Intent` 是一个消息传递对象。当应用需要进行跨页面、跨服务的跳转时，就需要初始化一个 Intent。该 Intent 中通常会包含当前上下文、跳转目标、跳转携带的数据。

三大核心组件 —— Activity、Service、BroadcastReceiver 都是基于 Intent 来描述操作动作和传递数据，下面我们介绍下如何使用。

## 启动 Activity

启动 Activity 通常表示跳转另一个页面，方法如下：

```kotlin
val intent = Intent(this, AnotherActivity::class.java)
startActivity(intent)
```

上述代码中，Intent 接受的两个参数，分别表示如下：

- Context：当前 Activity 上下文，也就是 this。
- Class：目标 Activity 对应的类。

如果需要传递参数，方法如下：

```kotlin
val intent = Intent()
intent.putExtra("key1", "value1")
intent.putExtra("key2", "value2")
```

很多时候，我们还可能需要打开系统页面，这个时候不需要传递上下文，只需要提供一个 Action 参数即可。

比如我要打开 WIFI 设置页面，方法如下：

```kotlin
val intent = Intent(Settings.ACTION_WIFI_SETTINGS)
startActivity(intent)
```

## 启动 Service

启动 Service 表示启动一个后台服务，可能是应用中的服务，也可能是系统服务。

启动应用中的服务，方法如下：

```kotlin
val intent = Intent(this, AnotherService::class.java)
startService(intent)
```

从代码中可以看出，上述方法与启动普通的 Activity 基本一致。

大多数情况，开发者不会直接启动系统服务，而是通过 `getSystemService()` 获取系统服务信息。

获取不同的系统服务，会返回不同的服务管理对象，如下：

```kotlin
// 获取电池服务
val powerManager = this.getSystemService(Context.POWER_SERVICE) as PowerManager
// 获取音频服务
val audioManager = this.getSystemService(Context.AUDIO_SERVICE) as AudioManager
```

不同的服务管理对象，会有该服务特定的属性和方法。

## Intent 类型

Intent 分为两种类型：

- 显式 Intent：指定启动目标的类名，比如启动普通 Activity。
- 隐式 Intent：不指定类名，而是通过 Action 过滤，如启动系统 Activity。

一般情况下，应用内的跳转都使用显式 Intent；如果要启动系统级别的页面或服务，则需要隐式 Intent 实现。

隐式 Intent 的原理是什么？其实就是 `Intent 过滤器`。

安卓中所有的 Activity 和 Service 都要在清单文件（AndroidManifest.xml）中定义。假设某个 Service 需要通过隐式 Intent 启动，则必须定义 <intent-filter>，即 Intent 过滤器。

下面是一个测试 Activity，定义如下：

```xml
<activity
    android:name=".TestActivity"
    android:exported="true">
    <intent-filter>
        <action android:name="com.yourpackage.TEST_ACTION" />
    </intent-filter>
</activity>
```

因为通过 Intent 过滤器定义了 Action，所以可以通过以下方式启动：

```kotlin
val intent = Intent("com.yourpackage.TEST_ACTION")
startActivity(intent)
```

这样的隐式启动方式，不光本应用可以使用，其他应用也可以使用。当然 Action 的名称必须唯一。
