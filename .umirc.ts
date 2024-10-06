import { defineConfig } from 'dumi';
import CompressionPlugin from 'compression-webpack-plugin';

export default defineConfig({
  title: '杨成功的博客',
  metas: [
    {
      name: 'keywords',
      content: '杨成功,前端架构师,前端',
    },
    {
      name: 'description',
      content: '杨成功的个人博客，记录和分享前端工程、跨端开发、Node.js、服务端等知识',
    },
    {
      name: 'anthor',
      content: '杨成功',
    },
    {
      name: 'robots',
      content: '杨成功,前端架构师',
    },
  ],
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
      title: '跨平台',
      path: '/crosspt',
    },
    {
      title: '服务端',
      path: '/server',
    },
    {
      title: '更多',
      children: [
        {
          title: 'Node.js',
          path: '/nodejs',
        },
        {
          title: 'Android',
          path: '/android',
        },
      ],
    },
    {
      title: 'GitHub',
      path: 'https://github.com/ruidoc/blog',
    },
  ],
  ssr: {},
  exportStatic: {},
  chunks: ['vendors', 'umi'],
  chainWebpack: function (config, { webpack }) {
    config.merge({
      optimization: {
        splitChunks: {
          chunks: 'all',
          automaticNameDelimiter: '.',
          name: true,
          minSize: 30000,
          minChunks: 1,
          cacheGroups: {
            vendors: {
              name: 'vendors',
              chunks: 'all',
              test: /[\\/]node_modules[\\/]/,
              priority: -12,
            },
          },
        },
      },
    });
    if (process.env.NODE_ENV === 'production') {
      //gzip压缩
      config.plugin('compression-webpack-plugin').use(CompressionPlugin, [
        {
          test: /\.js$|\.html$|\.css$/, //匹配文件名
          threshold: 10240, //对超过10k的数据压缩
          deleteOriginalAssets: false, //不删除源文件
        },
      ]);
    }
  },
  // more config: https://d.umijs.org/config
});
