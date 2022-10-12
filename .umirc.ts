import { defineConfig } from 'dumi';

export default defineConfig({
  title: '杨成功的博客',
  favicon: 'https://www.ruims.top/static/logo-round.png',
  logo: 'https://www.ruims.top/static/logo-round.png',
  outputPath: 'docs-dist',
  mode: 'site',
  navs: [
    // {
    //   title: '首页',
    //   path: '/index',
    // },
    {
      title: 'JavaScript',
      path: '/javascript',
    },
    {
      title: '数据结构',
      path: '/data-structure',
    },
    {
      title: '服务端',
      path: '/server',
    },
  ],
  // more config: https://d.umijs.org/config
});
