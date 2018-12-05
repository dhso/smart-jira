<template>
  <div class="sprint_board">
    <div class="header-title">
      <span>Sprint</span>
      <el-select
        class="sprint-select"
        v-model="selectdSprint"
        @change="changeSprintHandler"
        :loading="sprintLoading"
        size="mini"
        placeholder="Please select sprint"
      >
        <el-option v-for="(val, key) in sprints" :key="val" :label="key" :value="val"></el-option>
      </el-select>
    </div>
    <el-form class="sprint-board-buttons">
      <el-button type="primary" @click="statusUpdate">Status Update</el-button>
      <el-button type="primary">Export As Excel</el-button>
    </el-form>
    <div class="clear-both"></div>
    <el-form>
      <TreeGrid
        :data="sprintBoard"
        idField="id"
        treeField="id"
        :loading="treeGridLoading"
        class="sprit-board-tree-grid"
      >
        <GridColumn field="id" title width="30">
          <template slot="cell" slot-scope="scope">{{scope.none}}</template>
        </GridColumn>
        <GridColumn field="business_value" title="P" width="40" :sortable="true">
          <template
            slot="cell"
            slot-scope="scope"
          >{{scope.row.business_value?parseFloat(scope.row.business_value):''}}</template>
        </GridColumn>
        <GridColumn field="issue_key" title="Key" width="80"></GridColumn>
        <GridColumn field="summary" title="Summary" width="200"></GridColumn>
        <GridColumn field="assignee_display_name" title="Assignee" width="80"></GridColumn>
        <GridColumn field="status" title="Status" width="100"></GridColumn>
        <GridColumn field="time_track" title="Estimated" width="70" align="center"></GridColumn>
        <GridColumn field="logged_track" title="Logged Work" width="90" align="center"></GridColumn>
        <GridColumn field="time_to_test" title="Time to Test" width="100"></GridColumn>
        <GridColumn field="released" title="Released" width="120"></GridColumn>
      </TreeGrid>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[5, 10, 20, 50]"
        :page-size.sync="currentSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        :background="true"
        class="sprit-board-tree-pagination"
      ></el-pagination>
    </el-form>
  </div>
</template>

<script>
import Jira from '@/libs/jira'

export default {
  name: 'create_story',
  data() {
    return {
      sprints: [],
      selectdSprint: null,
      sprintLoading: false,
      sprintBoard: [],
      totalCount: null,
      treeGridLoading: false,
      currentPage: 1,
      currentSize: 10,
      options: [
        {
          value: '1',
          label: 'CORE-823'
        },
        {
          value: '2',
          label: 'WEB-823'
        }
      ],
      value: '1'
    }
  },
  methods: {
    changeSprintHandler(val) {
      this.fetchSpringBoard(223, val)
    },
    fetchSpringBoard(boardId, sprintId) {
      this.sprintBoard = []
      this.treeGridLoading = true
      Jira.http
        .post(`jira_api/${Jira.apis.sprint_board()}`, {
          board_id: boardId,
          sprint_id: sprintId,
          page: this.currentPage,
          rows: this.currentSize
        })
        .then(sprintBoardRes => {
          this.sprintBoard = sprintBoardRes.data.results.story_report_list
          this.totalCount = sprintBoardRes.data.results.total
        })
        .finally(() => {
          this.treeGridLoading = false
        })
    },
    handleSizeChange(val) {
      this.fetchSpringBoard(223, this.selectdSprint)
    },
    handleCurrentChange(val) {
      this.fetchSpringBoard(223, this.selectdSprint)
    },
    statusUpdate() {
      Jira.http
        .get(
          `jira_api/${Jira.apis.story_status_update(223, this.selectdSprint)}`
        )
        .then(updateRes => {
          console.log(updateRes)
          this.$message.success('Story status update success!')
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    }
  },
  async mounted() {
    try {
      this.sprintLoading = true
      let sprintsRes = await Jira.http.get(`jira_api/${Jira.apis.sprints()}`)
      this.sprints = sprintsRes.data.results
      // setTimeout(() => {
      //   this.selectdSprint =
      //     Object.values(this.sprints).length > 0
      //       ? Object.values(this.sprints)[0]
      //       : null
      //   if (this.selectdSprint) {
      //     this.fetchSpringBoard(223, this.selectdSprint)
      //   }
      // }, 50)
    } catch (err) {
      console.log(err)
    } finally {
      this.sprintLoading = false
    }
  }
}
</script>

<style lang="less">
@import './SprintBoard.less';
</style>
