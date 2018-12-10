<template>
  <div class="sprint_board">
    <div class="header-title">
      <span>Sprint Board</span>
      <el-select
        class="sprint-select"
        v-model="selectdSprint"
        @change="changeSprintHandler"
        :loading="sprintLoading"
        filterable
        size="mini"
        placeholder="Please select sprint"
        :disabled="treeGridLoading"
      >
        <el-option v-for="(val, key) in sprints" :key="val" :label="key" :value="val"></el-option>
      </el-select>
      <el-select
        class="board-select"
        v-model="selectdBoard"
        @change="changeBoardHandler"
        :loading="boardLoading"
        filterable
        size="mini"
        placeholder="Please select board"
        :disabled="treeGridLoading"
      >
        <el-option v-for="(val, key) in boards" :key="val" :label="key" :value="val"></el-option>
      </el-select>
    </div>
    <el-form class="sprint-board-buttons">
      <!-- <el-button
        type="primary"
        @click="statusUpdate"
        :disabled="statusUpdating"
        :loading="statusUpdating"
      >Status Update</el-button>-->
      <el-button type="primary">Export As Excel</el-button>
    </el-form>
    <div class="clear-both"></div>
    <el-form>
      <TreeGrid
        :data="sprintBoard"
        idField="id"
        treeField="id"
        class="sprit-board-tree-grid"
        v-loading="treeGridLoading"
        @rowExpand="onNodeExpand($event)"
      >
        <GridColumn field="id" title width="30">
          <template slot="cell" slot-scope="scope">{{scope.none}}</template>
        </GridColumn>
        <GridColumn field="this_issue_type" title="T" width="60">
          <template slot="cell" slot-scope="scope">
            <el-tag
              class="issue-type-tag"
              type="success"
              v-if="scope.row.this_issue_type==='Story'"
            >Story</el-tag>
            <el-tag class="issue-type-tag" type="warning" v-else>Task</el-tag>
          </template>
        </GridColumn>
        <GridColumn field="issue_key" title="Key" width="80">
          <template slot="cell" slot-scope="scope">
            <a
              :href="'https://patsnap.atlassian.net/browse/'+scope.row.issue_key"
              target="_blank"
            >{{scope.row.issue_key}}</a>
          </template>
        </GridColumn>
        <GridColumn field="summary" title="Summary" width="300">
          <template slot="cell" slot-scope="scope">
            <el-popover width="300" :content="scope.row.summary" trigger="hover" placement="right">
              <span class="ellipsis-1 summary-cell" slot="reference">{{scope.row.summary}}</span>
            </el-popover>
          </template>
        </GridColumn>
        <GridColumn field="assignee_display_name" title="Assignee" width="120" align="center"></GridColumn>
        <GridColumn field="status" title="Status" width="100">
          <template slot="cell" slot-scope="scope">
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
        </GridColumn>
        <GridColumn field="time_track" title="Estimated" width="70" align="center">
          <template slot="cell" slot-scope="scope">
            <span>{{strToDay(scope.row.time_track)}}</span>
          </template>
        </GridColumn>
        <GridColumn field="logged_track" title="Logged Work" width="90" align="center">
          <template slot="cell" slot-scope="scope">
            <span>{{strToDay(scope.row.logged_track)}}</span>
          </template>
        </GridColumn>
        <GridColumn field="time_to_test" title="Time to Test" width="100"></GridColumn>
        <GridColumn field="fix_version" title="Fix Version" width="120">
          <template slot="cell" slot-scope="scope">
            <el-popover
              width="200"
              :content="calcFixVersion(scope.row.fix_version)"
              trigger="hover"
              placement="left"
            >
              <span
                class="ellipsis-1 summary-cell"
                slot="reference"
              >{{calcFixVersion(scope.row.fix_version)}}</span>
            </el-popover>
          </template>
        </GridColumn>
      </TreeGrid>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[5, 10, 20]"
        :page-size.sync="currentSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        :background="true"
        class="sprit-board-tree-pagination"
        :disabled="treeGridLoading"
      ></el-pagination>
    </el-form>
  </div>
</template>

<script>
import Jira from '@/libs/jira'

export default {
  name: 'sprint_board',
  data() {
    return {
      boards: {},
      selectdBoard: null,
      boardLoading: false,
      sprints: [],
      selectdSprint: null,
      sprintLoading: false,
      sprintBoard: [],
      totalCount: null,
      treeGridLoading: false,
      currentPage: 1,
      currentSize: 20,
      statusUpdating: false
    }
  },
  methods: {
    calcFixVersion(fixVersion) {
      if (!fixVersion) return ''
      let fixVersions = []
      for (let item of fixVersion) {
        fixVersions.push(item.name)
      }
      return fixVersions.join()
    },
    strToDay(str) {
      return Jira.timeStrForamtDay(str)
    },
    changeBoardHandler(val) {
      this.sprintBoard = []
      this.currentPage = 1
      this.totalCount = null
      this.fetchSprints(val)
    },
    async fetchSprints(boardId) {
      try {
        this.sprintLoading = true
        this.selectdSprint = null
        this.sprints = {}
        let sprintsRes = await Jira.http.get(
          `jira_api/${Jira.apis.sprints(boardId)}`
        )
        this.sprints = sprintsRes.data.results
      } catch (err) {
        this.$message.error(err.message)
      } finally {
        this.sprintLoading = false
      }
    },
    changeSprintHandler(val) {
      this.sprintBoard = []
      this.currentPage = 1
      this.totalCount = null
      this.fetchSprintBoard(this.selectdBoard, val)
    },
    fetchSprintBoard(boardId, sprintId) {
      this.sprintBoard = []
      this.treeGridLoading = true
      Jira.http
        .post(`jira_api/${Jira.apis.sprint_board()}`, {
          board_id: boardId,
          sprint_id: sprintId,
          page: this.currentPage,
          rows: this.currentSize,
          is_include_children: false
        })
        .then(sprintBoardRes => {
          this.sprintBoard = sprintBoardRes.data.results.story_report_list
          this.totalCount = sprintBoardRes.data.results.total
        })
        .catch(err => {
          this.$message.error(err.message)
        })
        .finally(() => {
          this.treeGridLoading = false
        })
    },
    fetchSprintBoardLazyByIds(node) {
      this.treeGridLoading = true
      console.log(node)
      let linkedStoryIds = node.linked_stories.join(',')
      Jira.http
        .get(
          `jira_api/${Jira.apis.sprint_board_fetch_issues_by_ids(
            linkedStoryIds
          )}`
        )
        .then(issuesRes => {
          let issuesData = issuesRes.data.results
          this.$set(node, 'children', issuesData)
        })
        .catch(err => {
          this.$message.error(err.message)
        })
        .finally(() => {
          this.treeGridLoading = false
        })
    },
    handleSizeChange(val) {
      this.fetchSprintBoard(this.selectdBoard, this.selectdSprint)
    },
    handleCurrentChange(val) {
      this.fetchSprintBoard(this.selectdBoard, this.selectdSprint)
    },
    statusUpdate() {
      this.statusUpdating = true
      Jira.http
        .get(
          `jira_api/${Jira.apis.story_status_update(
            this.selectdBoard,
            this.selectdSprint
          )}`
        )
        .then(updateRes => {
          console.log(updateRes)
          this.$message.success('Story status update success!')
        })
        .catch(err => {
          this.$message.error(err.message)
        })
        .finally(() => {
          this.statusUpdating = false
        })
    },
    onNodeExpand(event) {
      console.log(event)
      let node = event
      if (!node.children) {
        this.fetchSprintBoardLazyByIds(node)
      }
    }
  },
  async mounted() {
    try {
      this.boardLoading = true
      let boardsRes = await Jira.http.get(`jira_api/${Jira.apis.boards()}`)
      this.boards = boardsRes.data.results
    } catch (err) {
      this.$message.error(err.message)
    } finally {
      this.boardLoading = false
    }
  }
}
</script>

<style lang="less">
@import './SprintBoard.less';
</style>
