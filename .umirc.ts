import { defineConfig } from 'dumi';

export default defineConfig({
  title: '杨成功的博客',
  favicon: 'https://www.ruims.top/static/logo-round.png',
  logo: 'https://www.ruims.top/static/logo-round.png',
  outputPath: 'docs-dist',
  mode: 'site',
  navs: [
    {
      title: '最新文章',
      path: '/articles',
    },
    {
      title: '数据结构',
      path: '/data-structure',
    },
  ],
  // more config: https://d.umijs.org/config
});
