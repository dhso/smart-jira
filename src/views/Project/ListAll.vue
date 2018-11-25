<template>
  <div class="project_list_all">
    <DataList
      :data="projects"
      selectionMode="single"
      @selectionChange="selection=$event"
    >
      <template slot-scope="scope">
        <div class="product f-row">
          <img :src="getImage(scope.row)">
          <div class="detail">
            <p>{{scope.row.id}} - {{scope.row.name}}</p>
            <p>{{scope.row.key}}</p>
            <p>{{scope.row.projectTypeKey}}</p>
          </div>
        </div>
      </template>
    </DataList>
  </div>
</template>

<script>
import Jira from '@/libs/jira'
export default {
  name: 'project_list_all',
  data() {
    return {
      selection: null,
      projects: null
    }
  },
  methods: {
    getImage(row) {
      return `${Jira.host}\\${row.avatarUrls['48x48']
        .split('/')
        .slice(3)
        .join('/')}`
    }
  },
  async mounted() {
    try {
      let res = await Jira.http.get(`jira_api/${Jira.apis.projects()}`)
      this.projects = res.data
    } catch (err) {
      console.log(err)
    }
  }
}
</script>
