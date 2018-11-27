<template>
  <div class="project_list_all">
    <DataGrid :data="projects">
      <GridColumn field="id" title="Project ID"></GridColumn>
      <GridColumn field="name" title="Project Name"></GridColumn>
      <GridColumn field="key" title="Project Key"></GridColumn>
      <GridColumn field="projectTypeKey" title="Project TypeKey"></GridColumn>
    </DataGrid>
  </div>
</template>

<script>
import Jira from '@/libs/jira'
export default {
  name: 'project_list_all',
  data() {
    return {
      selection: null,
      projects: []
    }
  },
  methods: {},
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

<style lang="less">
@import './ListAll.less';
</style>
