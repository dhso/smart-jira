import Vue from 'vue'

import VueEvents from 'vue-events'
Vue.use(VueEvents)

import 'vx-easyui/dist/themes/material-teal/easyui.css'
import 'vx-easyui/dist/themes/icon.css'
import 'vx-easyui/dist/themes/vue.css'
import EasyUI from 'vx-easyui'
Vue.use(EasyUI)

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI, {
  size: 'small'
})

import cookies from 'js-cookie'
Vue.cookies = Vue.prototype.$cookies = cookies

import storejs from 'store'
Vue.storejs = Vue.prototype.$storejs = storejs

import axios from 'axios'
Vue.http = Vue.prototype.$http = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})
Vue.http.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error && error.response && error.response.status === 401) {
      router.push({
        path: '/login',
        query: {
          unauthorized: 'true'
        }
      })
      throw Error('授权失败，请重新登录')
    }
    return Promise.reject(error)
  }
)

import VueProgressBar from 'vue-progressbar'
Vue.use(VueProgressBar, {})

import { router } from '@/router'
import store from '@/store'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
