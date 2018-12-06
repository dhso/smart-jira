import Index from '@/views/Index.vue'

const indexRouter = {
  path: '/',
  component: Index,
  redirect: '/create_story',
  meta: {
    title: ''
  },
  children: [
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
      path: '/sprint_board',
      name: 'sprint_board',
      meta: {
        title: 'Smart JIRA - Sprint Board',
        name: 'Sprint Board'
      },
      component: resolve => require(['@/views/Board/SprintBoard.vue'], resolve)
    },
    {
      path: '/sprint_summary',
      name: 'sprint_summary',
      meta: {
        title: 'Smart JIRA - Sprint Summary',
        name: 'Sprint Summary'
      },
      component: resolve =>
        require(['@/views/Board/SprintSummary.vue'], resolve)
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
