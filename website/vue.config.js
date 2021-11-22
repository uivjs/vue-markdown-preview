const path = require(`path`);

module.exports = {
  publicPath: '/vue-markdown-preview/',
  configureWebpack: {
    resolve: {
      symlinks: false,
      alias: {
        vue: path.resolve(`./node_modules/vue`),
      },
    },
  },
  chainWebpack: (conf) => {
    conf.module.rule('text').test(/\.md$/i).use('raw-loader').loader('raw-loader').end();
  },
};
