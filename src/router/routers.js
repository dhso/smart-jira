import Index from '@/views/Index.vue'

const indexRouter = {
  path: '/',
  component: Index,
  redirect: '/index',
  meta: {
    title: ''
  },
  children: [
    {
      path: '/index',
      name: 'index',
      meta: {
        title: '首页'
      },
      component: resolve => require(['@/views/Home.vue'], resolve)
    },
    {
      path: '/project_list_all',
      name: 'project_list_all',
      meta: {
        title: '项目'
      },
      component: resolve => require(['@/views/Project/ListAll.vue'], resolve)
    }
  ]
}

const loginRouter = {
  path: '/login',
  name: 'login',
  meta: {
    title: '登录'
  },
  component: resolve => require(['@/views/Login.vue'], resolve)
}

export const routers = [indexRouter, loginRouter]
