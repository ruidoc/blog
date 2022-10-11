# Vim 指南

在 Linux 服务器上常用 `vim` 命令编辑文件。但是 Vim 有些地方使用起来很不方便，比如：

- 1. 不能用光标移动编辑位置
- 2. 不能用页面滚动翻页
- 3. 不能选中删除

对于这些问题，其实 Vim 也是提供支持的，只不过默认没有打开，需要我们单独配置一下：

```sh
$ vi ~/.vimrc
```

写入如下配置：

```
if has("autocmd")
  au BufReadPost * if line("'\"") > 1 && line("'\"") <= line("$") | exe "normal! g'\"" | endif
  set mouse=a
endif
```

保存后再使用 vim 编辑文件，发现问题 1，2 已经解决了。

问题 3 待定...
