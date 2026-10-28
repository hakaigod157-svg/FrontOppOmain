const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: '/erpo/',
  transpileDependencies: true,
  lintOnSave: false,
  pluginOptions: {
    vuetify: {
      treeShake: true,
      defaultAssets: {
        font: {
          family: 'Libre Baskerville'
        }
      }
    }
  },
  devServer: {
    client: {
      overlay: {
        errors: false,
        warnings: false,
        runtimeErrors: false,
      },
    },
  },

})
