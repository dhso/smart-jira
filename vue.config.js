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
    port: appCfg.app.port,
    proxy: {
      '/jira_api': {
        target: appCfg.jira.host,
        changeOrigin: true,
        pathRewrite: {
          '^/jira_api': ''
        },
        secure: false,
        cookiePathRewrite: {
          '/jira-bot': '/'
        }
      }
    }
  }
}
