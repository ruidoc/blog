# Gradle 介绍

Gradle 是 Android 官方的自动化构建工具，运行在 JVM 之上。它不光可以构建 Android 应用程序，也可以构建 Java、Kotlin JVM、C++、Swift 等多种应用程序。

更多细节，请查阅[入门介绍](https://docs.gradle.org/8.0/userguide/getting_started.html)。

## Gradle DSL

Gradle 面向开发者的脚本语言是 Groovy 和 Kotlin，最终表现为 DSL（一种与原始语法稍有差异的专有语法），即 `Groovy DSL` 和 `Kotlin DSL`。

默认情况下，Gradle 使用 Groovy DSL，像我们常见的配置文件 `build.gradle` 就是使用 Groovy 语法。如果使用 Kotlin DSL，则配置文件名为 `build.gradle.kts`。

## 项目结构

全局安装 Gradle 之后，使用 `gradle` 命令可以快速初始化项目（类似于前端的 Vite CLI）。

执行 `gradle init` 命令，终端会提示创建项目的选项，我们选择创建一个 Kotlin 应用程序，生成的项目结构如下：

```
├── gradle
│   └── wrapper
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties
├── gradlew
├── gradlew.bat
├── settings.gradle
├── build.gradle
└── app
    ├── build.gradle
    └── src
        ├── main
        │   └── kotlin
        │       └── demo
        │           └── App.kt
        └── test
            └── kotlin
                └── demo
                    └── AppTest.kt
```

上述目录结构，解释如下：

- gradle 文件夹：存放 Wrapper 包装器。
- gradlew/gradlew.bat：与包装器配合，代替 gradle 命令。
- settings.gradle：设置文件，用于定义构建名称和子模块。
- build.gradle：项目级别的构建配置。
- app 文件夹：子模块。
- app/build.gradle：模块级别的构建配置。

一般情况下，电脑中需要安装 Gradle 之后，才能使用 `gradle` 命令构建应用。包装器的作用是在没有安装 Gradle 的情况下，允许使用 `gradlew` 或 `./gradlew.bat` 来替代 gradle 命令。

## build.gradle

Gradle 最主要的配置文件就是 `build.gradle`，它表示构建脚本。

构建脚本由多个 `脚本块` 和 `语句` 组成。常见脚本块如下：

- allprojects：项目及其子项目的通用配置。
- buildscript：项目的构建脚本类路径。
- configurations：项目的依赖配置。
- dependencies：项目的依赖项。
- repositories：项目的存储库。
- subprojects：子项目的配置。

详细配置请参考[这里](https://docs.gradle.org/8.0/dsl/index.html)。
