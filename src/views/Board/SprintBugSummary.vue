<template>
  <div class="sprint_bug_summary">
    <el-form>
      <div class="header-title">
        <span>Sprint Bug Summary</span>
        <el-select
          class="sprint-select"
          v-model="selectdSprint"
          @change="changeSprintHandler"
          :loading="sprintLoading"
          filterable
          size="mini"
          placeholder="Please select sprint"
          :disabled="tableLoading"
        >
          <el-option v-for="(val, key) in sprints" :key="val" :label="key" :value="val"></el-option>
        </el-select>
      </div>
      <div class="clear-both"></div>
      <el-row :gutter="20" class="mb20">
        <el-col :span="24">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>
                <i class="fa fa-bug"></i> Bug Summary
              </span>
            </div>
            <el-table :data="bugSummary" stripe class="w100" v-loading="tableLoading">
              <el-table-column prop="team" label="Team"></el-table-column>
              <el-table-column prop="total" label="Total"></el-table-column>
              <el-table-column prop="dev" label="Dev"></el-table-column>
              <el-table-column prop="prod" label="Prod"></el-table-column>
              <el-table-column prop="fixed" label="Fix of Total"></el-table-column>
              <el-table-column prop="opening" label="Open of Total"></el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import Jira from '@/libs/jira'

export default {
  name: 'sprint_bug_summary',
  data() {
    return {
      sprints: [],
      selectdSprint: null,
      sprintLoading: false,
      tableLoading: false,
      bugSummary: []
    }
  },
  methods: {
    changeSprintHandler(val) {
      this.fetchSprintBugSummary(val)
    },
    fetchSprintBugSummary(sprintId) {
      this.bugSummary = []
      this.tableLoading = true
      Jira.http
        .get(`jira_api/${Jira.apis.sprint_bug_summary(sprintId)}`)
        .then(sprintBugSummaryRes => {
          let bugSummaryData = Object.values(sprintBugSummaryRes.data.results)
          for (let bugSummary of bugSummaryData) {
            bugSummary.total =
              parseFloat(bugSummary.dev) + parseFloat(bugSummary.prod)
          }
          this.bugSummary = bugSummaryData
        })
        .catch(err => {
          this.$message.error(err.message)
        })
        .finally(() => {
          this.tableLoading = false
        })
    }
  },
  async mounted() {
    try {
      this.sprintLoading = true
      let sprintsRes = await Jira.http.get(`jira_api/${Jira.apis.sprints(228)}`)
      this.sprints = sprintsRes.data.results
    } catch (err) {
      this.$message.error(err.message)
    } finally {
      this.sprintLoading = false
    }
  }
}
</script>

<style lang="less">
@import './SprintBugSummary.less';
</style>
