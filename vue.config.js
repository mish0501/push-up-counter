const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

module.exports = {
  // devServer: {
  //   https: true,
  // },

  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'Push-up counter'
      return args
    })
  },

  configureWebpack: {
    plugins: [new BundleAnalyzerPlugin()],
  },

  publicPath: process.env.NODE_ENV === 'production' ? '/push-up-counter/' : '/',

  transpileDependencies: ['vuetify'],
  pwa: {
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: './src/sw.js',
      swDest: 'service-worker.js',
    },
    name: 'Push-up counter',
    themeColor: '#4CAF50',
    msTileColor: '#4CAF50',
    manifestOptions: {
      background_color: '#4CAF50',
      short_name: 'Counter',
    },
  },

  productionSourceMap: false,
}
