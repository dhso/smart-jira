import Vue from 'vue'
import VueRouter from 'vue-router'
import cookies from 'js-cookie'
import store from '@/store'
import { routers } from '@/router/routers'

Vue.use(VueRouter)

// 路由配置
const RouterConfig = {
  mode: 'history',
  routes: routers
}

export const router = new VueRouter(RouterConfig)

router.beforeEach((to, from, next) => {
  // console.log(to, from)
  if (
    ['information', 'login'].indexOf(to.name) < 0 &&
    !cookies.get('user_name')
  ) {
    // 跳转到登录页面
    return next({
      name: 'login',
      query: to.query
    })
  }
  store.dispatch('app/update_app_title', to.meta.title)
  store.commit('app/update_app_loading', { state: 'start' })
  next()
})

router.afterEach(to => {
  store.commit('app/update_app_loading', { state: 'finish' })
  window.scrollTo(0, 0)
})
