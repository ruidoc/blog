## 认识 gPhoto2

`gphoto2` 命令用于在 Linux 下与移动设备进行连接。

gphoto2 最初是为了与数码相机通信而开发的，那时的数码相机只有传统的相机功能，现在的 gphoto2 可以和许多不同种类的移动设备通讯。

## 查找设备

查找已连接的移动设备，使用一下命令：

```shell
$ gphoto2 --auto-detect
```

如果未查找到设备，说明未连接成功。找到设备后再查询该设备支持哪些功能：

```shell
$ gphoto2 --abilities
```

## 与设备交互

首先是最基本的功能 —— 拍摄照片：

```shell
$ gphoto2 --capture-image
```

拍摄照片并立即将其传输到连接的计算机：

```shell
$ gphoto2 --capture-image-and-download
```

查看当前设备的文件夹：

```shell
$ gphoto2 --list-folders
```

这个命令一般会在设备（相机）的根目录下列出俩个文件夹：

- store_00010001
- store_00020002

`store_00010001` 是内部存储器，`store_00020002` 是 SD 卡。
