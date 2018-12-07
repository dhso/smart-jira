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

      throw Error('Current session has expired, please re-login.')
    }
    return Promise.reject(error)
  }
)
Jira.timeStrForamtSeconds = timeStr => {
  // 1d = 8h = 28800
  let secondsDict = {
    s: 1,
    m: 60,
    h: 3600,
    d: 28800
  }
  let seconds =
    timeStr.substr(0, timeStr.length - 1) *
    secondsDict[timeStr.substr(timeStr.length - 1)]
  return seconds
}
Jira.timeStrForamtDay = timeStr => {
  if (!timeStr) {
    return ''
  }
  let timeArr = timeStr.split(' ')
  let seconds = 0
  for (let time of timeArr) {
    seconds += Jira.timeStrForamtSeconds(time)
  }
  // 1d = 8h = 28800
  return `${Math.round((seconds / 28800) * 100) / 100}d`
}

Jira.apis = {
  authentication: () => {
    return 'login'
  },
  story_types: () => {
    return `basic/data/story/type`
  },
  ticket_types: () => {
    return `basic/data/ticket/type`
  },
  board_epic: boardId => {
    return `jira/board/${boardId}/epic`
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
  boards: () => {
    return `basic/data/sprint/toc/board`
  },
  sprints: (boardId, isIncludeClosed = 1) => {
    return `basic/data/sprint/board/${boardId}/${isIncludeClosed}`
  },
  create_issue: () => {
    return `jira/issue`
  },
  sprint_board: () => {
    return `jira/story/report`
  },
  sprint_board_fetch_issues_by_ids: issueIds => {
    return `jira/issue/ids/${issueIds}`
  },
  sprint_bug_summary: sprintId => {
    return `jira/report/bug/summary/sprintid/${sprintId}`
  },
  story_status_update: (boardId, sprintId) => {
    return `jira/story/update/${boardId}/${sprintId}`
  },
  board_sprint_summary: (boardId, sprintId) => {
    return `jira/report/sprint/summary/board/${boardId}/sprint/${sprintId}?boardId=${boardId}&sprintId=${sprintId}`
  },
  bulk_update: () => {
    return `jira/bulk/update`
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
