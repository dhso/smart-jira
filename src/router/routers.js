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
        title: 'Smart JIRA - My Issues',
        name: 'My Issues'
      },
      component: resolve => require(['@/views/Issue/MyIssues.vue'], resolve)
    },
    {
      path: '/project_list_all',
      name: 'project_list_all',
      meta: {
        title: 'Smart JIRA - Project List',
        name: 'Project List'
      },
      component: resolve => require(['@/views/Project/ListAll.vue'], resolve)
    },
    {
      path: '/create_story',
      name: 'create_story',
      meta: {
        title: 'Smart JIRA - Create Story',
        name: 'Create Story'
      },
      component: resolve => require(['@/views/Story/CreateStory.vue'], resolve)
    },
    {
      path: '/spring_board',
      name: 'spring_board',
      meta: {
        title: 'Smart JIRA - Spring Board',
        name: 'Spring Board'
      },
      component: resolve => require(['@/views/Board/SpringBoard.vue'], resolve)
    },
    {
      path: '/bulk_update',
      name: 'bulk_update',
      meta: {
        title: 'Smart JIRA - Bulk Update',
        name: 'Bulk Update'
      },
      component: resolve => require(['@/views/Story/BulkUpdate.vue'], resolve)
    }
  ]
}

const loginRouter = {
  path: '/login',
  name: 'login',
  meta: {
    title: 'Smart JIRA - Login'
  },
  component: resolve => require(['@/views/Login.vue'], resolve)
}

export const routers = [indexRouter, loginRouter]
