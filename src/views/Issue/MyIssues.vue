<template>
    <div class="my_issues">
        <DataGrid :data="myIssues.issues">
            <GridColumn field="id" title="Issue ID"></GridColumn>
            <GridColumn field="key" title="Issue Key"></GridColumn>
            <GridColumn field="summary" title="Issue Summary">
                <template slot="cell" slot-scope="scope">{{scope.row.fields.summary}}</template>
            </GridColumn>
            <GridColumn field="priority" title="Issue Priority">
                <template slot="cell" slot-scope="scope">{{scope.row.fields.priority.name}}</template>
            </GridColumn>
            <GridColumn field="assignee" title="Issue Assignee">
                <template slot="cell" slot-scope="scope">{{scope.row.fields.assignee.name}}</template>
            </GridColumn>
            <GridColumn field="status" title="Issue Status">
                <template slot="cell" slot-scope="scope">{{scope.row.fields.status.name}}</template>
            </GridColumn>
        </DataGrid>
    </div>
</template>

<script>
import Jira from '@/libs/jira'
export default {
  name: 'my_issues',
  data() {
    return {
      myIssues: []
    }
  },
  methods: {
    summaryFormatter(value, row, index) {
      console.log(value, row, index)
      return value.summary
    },
    assigneeNameFormatter(value, row, index) {
      return value.assignee.name
    },
    statusNameFormatter(value, row, index) {
      return value.status.name
    }
  },
  async mounted() {
    try {
      let res = await Jira.http.post(`jira_api/${Jira.apis.search_issues()}`, {
        jql: `assignee = currentUser() AND resolution = unresolved ORDER BY priority DESC, created ASC`,
        startAt: 0,
        maxResults: 100,
        fields: [
          'summary',
          'status',
          'assignee',
          'priority',
          'creator',
          'created',
          'duedate',
          'progress',
          'reporter'
        ]
      })
      this.myIssues = res.data
      console.log(res)
    } catch (err) {
      console.log(err)
    }
  }
}
</script>
<style lang="less">
@import './MyIssues.less';
</style>
