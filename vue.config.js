const path = require('path')
const appCfg = require('./app.config.json')

module.exports = {
  baseUrl: '/',
  configureWebpack: {
    resolve: {
      alias: {
        vue$: 'vue/dist/vue.esm.js',
        '@': path.join(__dirname, 'src')
      }
    }
  },
  devServer: {
    port: 8080,
    proxy: {
      '/jira_api': {
        target: appCfg.jira.host,
        changeOrigin: false,
        pathRewrite: {
          '^/jira_api': ''
        },
        secure: false
      }
    }
  }
}
