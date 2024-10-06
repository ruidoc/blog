# 本地数据存储

在 Kotlin 中，设置和获取本地数据有两种方式：`SharedPreferences` 和 `文件存储`。

## SharedPreferences

SharedPreferences 用于存储简单的键值对数据。

（1）导入依赖包，并初始化实例。

```kotlin
import android.content.SharedPreferences
import android.preference.PreferenceManager

// 获取默认的SharedPreferences实例
val pref: SharedPreferences = PreferenceManager.getDefaultSharedPreferences(context)
```

（2）设置数据的方法。

```kotlin
fun setPreference(key: String, value: String) {
    val editor = preferences.edit()
    editor.putString(key, value) // 设置字符串类型
    editor.putBoolean("tag", true) // 设置布尔类型
    editor.apply() // 或者 editor.commit()
}
```

（3）获取数据的方法。

```kotlin
// 获取数据
fun getPreference(key: String, defaultValue: String?): String? {
    var val1 = preferences.getString(key, defaultValue) // 获取字符串
    var val2 = preferences.getBoolean("tag", true)  // 获取布尔
}
```

## 文件存储

文件的读取通过流（Stream）的方式进行，方法如下。

（1）导入依赖包，无需初始化。

```kotlin
import android.content.Context
import java.io.File
import java.io.FileOutputStream
import java.io.ObjectOutputStream
```

（2）保存对象到文件。

```kotlin
fun saveObjectToFile(context: Context, obj: Any, fileName: String) {
    val file = File(context.filesDir, fileName)
    ObjectOutputStream(FileOutputStream(file)).use {
      it.writeObject(obj)
    }
}
```

（3）从文件读取对象。

```kotlin
fun getObjectFromFile(context: Context, fileName: String): Any? {
    val file = File(context.filesDir, fileName)
    return if (file.exists()) {
        ObjectInputStream(FileInputStream(file)).use {
          it.readObject()
        }
    } else {
        null
    }
}
```
