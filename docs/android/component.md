---
order: 2
---

# 安卓四大组件

Android 系统没有常见的入口方法（例如 main() 方法），应用程序是由组件构成的。Android 划分了 4 类核心组件，各个组件之间通过 `Intent` 传递消息。

这四大组件分别是：

- Activity：视图。
- Service：服务。
- BroadcastReceiver：广播接收器。
- ContentProvider：内容提供者。

## Activity

`Activity` 是 Android 应用程序中最基本的组件。一个 Activity 通常对应一个单独的视图，应用程序是由一个或多个 Activity 组成的，这些 Activity 相当于 Web 应用程序中的网页。

所有的 Activity 都保存在一个栈中。因为 App 中会有多个视图之间的切换，所以每个 Activity 都有自己的生命周期方法，常见如下：

- onCreate()：创建。
- onStart()：激活。
- onResume()：恢复。
- onPause()：暂停。
- onStop()：停止。
- onDestroy()：销毁。
- onRestart()：重启。

## Service

`Service` 是一个在后台运行的服务，但它没有用户界面，通常与 Activity 配合工作。

Service 包含两种类型：`本地 Service` 和 `远程 Service`。前者只能在当前应用程序中使用，而后者可以与设备上的其他应用程序共享使用。

## BroadcastReceiver

`BroadcastReceiver` 的意思是“广播接收者”，顾名思义，它用来接收来自系统和其他应用程序的广播，并做出回应。

一般情况下，Android 系统在事件发生时都会发出一条广播，如来电话、电池能量低等。在程序开发中如果要监听这类事件，用 BroadcastReceiver 就可以实现。

BroadcastReceiver 的 2 种注册方式：

- 在 `AndroidManifest.xml` 中进行静态注册；
- 在代码中使用 `Context.registerReceiver()` 动态注册。

此外，用户还可以通过 `Context.sendBroadcast()` 将自己的 `Intent 对象` 广播给其他的应用程序。

## ContentProvider

文件、数据库等资源在 Android 系统内是私有的。如果要从系统中读取数据、或是在两个程序之间共享数据，都需要用 `ContentProvider` 来实现。

ContentProvider 类实现了一组标准方法的接口，从而能够让其他的应用保存或读各种数据类型。

## Intent

Intent 并不是 Android 应用程序四大核心组件之一，但是其重要性无可替代。

`Intent` 是对即将要进行的操作的抽象描述。三大核心组件 —— Activity、Service、BroadcastReceiver 传递的消息就是 Intent，它承担了三大核心组件相互之间的通信功能。
