module.exports = {
  devServer: {
    https: true,
  },

  transpileDependencies: ['vuetify'],
  publicPath: process.env.NODE_ENV === 'production' ? '/push-up-counter/' : '/',

  pwa: {
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: './src/sw.js',
      swDest: 'service-worker.js',
    },
  },
}
