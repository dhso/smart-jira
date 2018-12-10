<template>
  <div class="sprint_summary">
    <el-form>
      <div class="header-title">
        <span>Sprint Summary</span>
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
                <i class="fa fa-table"></i> Sprint Report
              </span>
            </div>
            <div
              class="el-table w100 el-table--fit el-table--border el-table--striped el-table--enable-row-hover el-table--small"
            >
              <div class="el-table__header-wrapper w100">
                <table
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  class="el-table__body w100 customer-table-center"
                  v-loading="tableLoading"
                >
                  <thead>
                    <tr>
                      <th class="cell">Team</th>
                      <th colspan="3">Total</th>
                      <th colspan="3">Actual Done</th>
                      <th colspan="3">Not Done</th>
                    </tr>
                  </thead>
                  <tr>
                    <td rowspan="3" class="cell table-gray-font">Core Product</td>
                    <td
                      colspan="3"
                      class="cell"
                    >{{JSON.stringify(sprintReport)!='{}'?sprintReport['Total']['total']:'0'}}</td>
                    <td
                      colspan="3"
                    >{{JSON.stringify(sprintReport)!='{}'?sprintReport['Actual Done']['total']:'0'}}</td>
                    <td
                      colspan="3"
                    >{{JSON.stringify(sprintReport)!='{}'?sprintReport['Not Done']['total']:'0'}}</td>
                  </tr>
                  <tr class="table-gray-font">
                    <td class="cell">Feature</td>
                    <td>Tech</td>
                    <td>Tech without Testing</td>
                    <td>Feature</td>
                    <td>Tech</td>
                    <td>Tech without Testing</td>
                    <td>Feature</td>
                    <td>Tech</td>
                    <td>Tech without Testing</td>
                  </tr>
                  <tr>
                    <td
                      class="cell"
                    >{{JSON.stringify(sprintReport)!='{}'?sprintReport['Total']['feature']:'0'}}</td>
                    <td>{{JSON.stringify(sprintReport)!='{}'?sprintReport['Total']['tech']:'0'}}</td>
                    <td>{{JSON.stringify(sprintReport)!='{}'?sprintReport['Total']['tech_with_testing']:'0'}}</td>
                    <td
                      class="cell"
                    >{{JSON.stringify(sprintReport)!='{}'?sprintReport['Actual Done']['feature']:'0'}}</td>
                    <td>{{JSON.stringify(sprintReport)!='{}'?sprintReport['Actual Done']['tech']:'0'}}</td>
                    <td>{{JSON.stringify(sprintReport)!='{}'?sprintReport['Actual Done']['tech_with_testing']:'0'}}</td>
                    <td
                      class="cell"
                    >{{JSON.stringify(sprintReport)!='{}'?sprintReport['Not Done']['feature']:'0'}}</td>
                    <td>{{JSON.stringify(sprintReport)!='{}'?sprintReport['Not Done']['tech']:'0'}}</td>
                    <td>{{JSON.stringify(sprintReport)!='{}'?sprintReport['Not Done']['tech_with_testing']:'0'}}</td>
                  </tr>
                </table>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb20">
        <el-col :span="24">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>
                <i class="fa fa-list"></i> Feature Stories
                <span
                  class="small-number"
                  v-if="stories['Feature'].length>0"
                >- {{stories['Feature'].length}}</span>
              </span>
            </div>
            <el-table
              :data="stories['Feature']"
              stripe
              class="w100"
              max-height="500"
              v-loading="tableLoading"
            >
              <el-table-column prop="issue_key" label="Tickets" width="150px"></el-table-column>
              <el-table-column prop="status" label="Status" width="100px">
                <template slot-scope="scope">
                  <el-tag
                    class="status-tag"
                    type="success"
                    v-if="scope.row.status==='Done'"
                  >{{scope.row.status}}</el-tag>
                  <el-tag
                    class="status-tag"
                    type="warning"
                    v-else-if="scope.row.status==='In Progress'"
                  >{{scope.row.status}}</el-tag>
                  <el-tag
                    class="status-tag"
                    type="danger"
                    v-else-if="scope.row.status==='Open'"
                  >{{scope.row.status}}</el-tag>
                  <el-tag class="status-tag" v-else>{{scope.row.status}}</el-tag>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="ticket_type" label="Ticket Type"></el-table-column> -->
              <el-table-column prop="summary" label="Summary"></el-table-column>
              <el-table-column prop="assignee" label="Assignee" width="150px"></el-table-column>
              <el-table-column prop="time_to_test" label="Time To Test" width="150px"></el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb20">
        <el-col :span="24">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>
                <i class="fa fa-list"></i> Tech Stories
                <span
                  class="small-number"
                  v-if="stories['Tech'].length>0"
                >- {{stories['Tech'].length}}</span>
              </span>
            </div>
            <el-table
              :data="stories['Tech']"
              stripe
              class="w100"
              max-height="500"
              v-loading="tableLoading"
            >
              <el-table-column prop="issue_key" label="Tickets" width="150px"></el-table-column>
              <el-table-column prop="status" label="Status" width="100px">
                <template slot-scope="scope">
                  <el-tag
                    class="status-tag"
                    type="success"
                    v-if="scope.row.status==='Done'"
                  >{{scope.row.status}}</el-tag>
                  <el-tag
                    class="status-tag"
                    type="warning"
                    v-else-if="scope.row.status==='In Progress'"
                  >{{scope.row.status}}</el-tag>
                  <el-tag
                    class="status-tag"
                    type="danger"
                    v-else-if="scope.row.status==='Open'"
                  >{{scope.row.status}}</el-tag>
                  <el-tag class="status-tag" v-else>{{scope.row.status}}</el-tag>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="ticket_type" label="Ticket Type"></el-table-column> -->
              <el-table-column prop="summary" label="Summary"></el-table-column>
              <el-table-column prop="assignee" label="Assignee" width="150px"></el-table-column>
              <el-table-column prop="time_to_test" label="Time To Test" width="150px"></el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mb20">
        <el-col :span="24">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>
                <i class="fa fa-list"></i> Tech without Testing Stories
                <span
                  class="small-number"
                  v-if="stories['Tech without Testing'].length>0"
                >- {{stories['Tech without Testing'].length}}</span>
              </span>
            </div>
            <el-table
              :data="stories['Tech without Testing']"
              stripe
              class="w100"
              max-height="500"
              v-loading="tableLoading"
            >
              <el-table-column prop="issue_key" label="Tickets" width="150px"></el-table-column>
              <el-table-column prop="status" label="Status" width="100px">
                <template slot-scope="scope">
                  <el-tag
                    class="status-tag"
                    type="success"
                    v-if="scope.row.status==='Done'"
                  >{{scope.row.status}}</el-tag>
                  <el-tag
                    class="status-tag"
                    type="warning"
                    v-else-if="scope.row.status==='In Progress'"
                  >{{scope.row.status}}</el-tag>
                  <el-tag
                    class="status-tag"
                    type="danger"
                    v-else-if="scope.row.status==='Open'"
                  >{{scope.row.status}}</el-tag>
                  <el-tag class="status-tag" v-else>{{scope.row.status}}</el-tag>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="ticket_type" label="Ticket Type"></el-table-column> -->
              <el-table-column prop="summary" label="Summary"></el-table-column>
              <el-table-column prop="assignee" label="Assignee" width="150px"></el-table-column>
              <el-table-column prop="time_to_test" label="Time To Test" width="150px"></el-table-column>
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
  name: 'sprint_summary',
  data() {
    return {
      sprints: [],
      selectdSprint: null,
      sprintLoading: false,
      tableLoading: false,
      sprintReport: {},
      stories: {
        Feature: [],
        Tech: [],
        'Tech without Testing': []
      }
    }
  },
  methods: {
    changeSprintHandler(val) {
      this.sprintReport = {}
      this.stories = {
        Feature: [],
        Tech: [],
        'Tech without Testing': []
      }
      this.fetchBoardSprintSummary('223', val)
    },
    fetchBoardSprintSummary(boardId, sprintId) {
      this.sprintReport = {}
      this.stories = {
        Feature: [],
        Tech: [],
        'Tech without Testing': []
      }
      this.tableLoading = true
      Jira.http
        .get(`jira_api/${Jira.apis.board_sprint_summary(boardId, sprintId)}`)
        .then(boardSprintSummaryRes => {
          let boardSprintSummaryData = boardSprintSummaryRes.data.results
          this.stories = boardSprintSummaryData
          let _sprintReport = boardSprintSummaryData.DoneStatistics
          _sprintReport['Actual Done']['total'] =
            parseInt(_sprintReport['Actual Done']['tech']) +
            parseInt(_sprintReport['Actual Done']['feature']) +
            parseInt(_sprintReport['Actual Done']['tech_with_testing'])
          _sprintReport['Not Done']['total'] =
            parseInt(_sprintReport['Not Done']['tech']) +
            parseInt(_sprintReport['Not Done']['feature']) +
            parseInt(_sprintReport['Not Done']['tech_with_testing'])
          _sprintReport['Total'] = {}
          _sprintReport['Total']['total'] =
            parseInt(_sprintReport['Actual Done']['total']) +
            parseInt(_sprintReport['Not Done']['total'])
          _sprintReport['Total']['tech'] =
            parseInt(_sprintReport['Actual Done']['tech']) +
            parseInt(_sprintReport['Not Done']['tech'])
          _sprintReport['Total']['feature'] =
            parseInt(_sprintReport['Actual Done']['feature']) +
            parseInt(_sprintReport['Not Done']['feature'])
          _sprintReport['Total']['tech_with_testing'] =
            parseInt(_sprintReport['Actual Done']['tech_with_testing']) +
            parseInt(_sprintReport['Not Done']['tech_with_testing'])
          this.sprintReport = _sprintReport
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
      let sprintsRes = await Jira.http.get(`jira_api/${Jira.apis.sprints(223)}`)
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
@import './SprintSummary.less';
</style>
