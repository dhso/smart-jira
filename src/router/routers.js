import Index from '@/views/Index.vue'

const indexRouter = {
  path: '/',
  component: Index,
  redirect: '/my_issues',
  meta: {
    title: ''
  },
  children: [
    {
      path: '/my_issues',
      name: 'my_issues',
      meta: {
        title: 'my issues'
      },
      component: resolve => require(['@/views/Issue/MyIssues.vue'], resolve)
    },
    {
      path: '/project_list_all',
      name: 'project_list_all',
      meta: {
        title: '项目'
      },
      component: resolve => require(['@/views/Project/ListAll.vue'], resolve)
    },
    {
      path: '/create_story',
      name: 'create_story',
      meta: {
        title: 'create story'
      },
      component: resolve => require(['@/views/Story/CreateStory.vue'], resolve)
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
