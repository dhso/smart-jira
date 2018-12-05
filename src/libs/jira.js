import appCfg from '@/../app.config.json'
import axios from 'axios'
import { router } from '@/router'
import cookies from 'js-cookie'
const Jira = {}

Jira.host = appCfg.jira.host

Jira.http = axios.create({
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})
Jira.http.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error && error.response && error.response.status === 401) {
      cookies.remove('user_name')
      router.push({
        name: 'login',
        query: {
          unauthorized: 'true'
        }
      })

      throw Error('授权失败，请重新登录')
    }
    return Promise.reject(error)
  }
)

Jira.apis = {
  authentication: () => {
    return 'login'
  },
  story_types: () => {
    return `basic/data/story/type`
  },
  teams: issue => {
    return `basic/data/teams`
  },
  fix_versions: storyType => {
    return `basic/data/fixversion/storytype/${storyType}`
  },
  team_members: storyType => {
    return `basic/data/user/storytype/${storyType}`
  },
  sprints: () => {
    return `basic/data/sprint/toc/core`
  },
  create_issue: () => {
    return `jira/issue`
  },
  sprint_board: () => {
    return `jira/story/report`
  },
  sprint_bug_summary: sprintId => {
    return `jira/report/bug/summary/sprintid/${sprintId}`
  },
  story_status_update: (boardId, sprintId) => {
    return `jira/story/update/${boardId}/${sprintId}`
  }
}

Jira.fixHost = url => {
  let urlSplit = url.split('/')
  if (urlSplit.slice(2, 3).join() === 'www.gravatar.com') {
    return url
  }
  let removeHostUrl = urlSplit.slice(3).join('/')
  return `${Jira.host}/${removeHostUrl}`
}

export default Jira
