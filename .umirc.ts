import { defineConfig } from 'dumi';

export default defineConfig({
  title: '杨成功的博客',
  favicon: 'https://www.ruims.top/static/logo-round.png',
  logo: 'https://www.ruims.top/static/logo-round.png',
  outputPath: 'docs-dist',
  mode: 'site',
  navs: [
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
    {
      title: '更多',
      children: [
        {
          title: '跨平台',
          path: '/crosspt',
        },
      ],
    },
    {
      title: 'GitHub',
      path: 'https://github.com/ruidoc/blog',
    },
  ],
  ssr: {
    devServerRender: true,
  },
  // more config: https://d.umijs.org/config
});
