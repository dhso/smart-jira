import appCfg from '@/../app.config.json'
import axios from 'axios'
import { router } from '@/router'
import cookies from 'js-cookie'
const Jira = {}

Jira.host = appCfg.jira.host

Jira.http = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'X-Atlassian-Token': 'no-check'
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
    return 'rest/auth/1/session'
  },
  projects: () => {
    return `rest/api/2/project`
  },
  issue: issue => {
    return `rest/api/2/issue/${issue}`
  },
  search_issues: issue => {
    return `rest/api/2/search`
  }
}

export default Jira
