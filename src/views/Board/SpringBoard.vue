<template>
  <div class="spring_board">
    <div class="header-title">
      <span>Spring</span>
      <el-select class="spring-select" v-model="value" placeholder="请选择" size="mini">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <el-form class="spring-board-buttons">
      <el-button type="primary">Status Update</el-button>
      <el-button type="primary">Export As Excel</el-button>
    </el-form>
    <div class="clear-both"></div>
    <el-form>
      <TreeGrid :data="springData" :checkbox="true" idField="id" treeField="id">
        <GridColumn field="id" title="Action" width="80">
          <template slot="cell" slot-scope="scope">{{scope.none}}</template>
        </GridColumn>
        <GridColumn field="P" title="P" width="40" :sortable="true"></GridColumn>
        <GridColumn field="T" title="T" width="60"></GridColumn>
        <GridColumn field="Key" title="Key" width="80"></GridColumn>
        <GridColumn field="Summary" title="Summary"></GridColumn>
        <GridColumn field="Assignee" title="Assignee" width="80"></GridColumn>
        <GridColumn field="Status" title="Status" width="100"></GridColumn>
        <GridColumn field="Estimated" title="Estimated" width="70" align="center"></GridColumn>
        <GridColumn field="LoggedWork" title="Logged Work" width="90" align="center"></GridColumn>
        <GridColumn field="Sprint" title="Sprint" width="80"></GridColumn>
        <GridColumn field="Release" title="Release" width="80"></GridColumn>
      </TreeGrid>
    </el-form>
  </div>
</template>

<script>
// import Jira from '@/libs/jira'
export default {
  name: 'create_story',
  data() {
    return {
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
      value: '1',
      springData: [
        {
          id: 21,
          P: 'H',
          T: 'Story',
          Key: 'TOC-247',
          Summary: 'Feature - Redis clean and remove the version in redis',
          Assignee: 'Li ZHI',
          Status: 'IN PROGRESS',
          Estimated: '8d',
          LoggedWork: '4d',
          Sprint: 'CORE-843',
          Release: '20181206',
          children: [
            {
              id: 211,
              P: 'H',
              T: 'Task',
              Key: 'TOC-247',
              Summary: 'Feature - Redis clean and remove the version in redis',
              Assignee: 'Li ZHI',
              Status: 'IN PROGRESS',
              Estimated: '2d',
              LoggedWork: '1d',
              Sprint: 'WEB-843',
              Release: '20181206'
            },
            {
              id: 212,
              P: 'H',
              T: 'Task',
              Key: 'TOC-247',
              Summary: 'FE - Redis clean and remove the version in redis',
              Assignee: 'Li ZHI',
              Status: 'IN PROGRESS',
              Estimated: '2d',
              LoggedWork: '1d',
              Sprint: 'WEB-843',
              Release: '20181206'
            }
          ]
        },
        {
          id: 22,
          P: 'H',
          T: 'Story',
          Key: 'TOC-247',
          Summary: 'WEB - Redis clean and remove the version in redis',
          Assignee: 'Li ZHI',
          Status: 'IN PROGRESS',
          Estimated: '8d',
          LoggedWork: '2d',
          Sprint: 'BE-843',
          Release: '20181206',
          children: [
            {
              id: 221,
              P: 'H',
              T: 'Task',
              Key: 'TOC-247',
              Summary: 'BE - Redis clean and remove the version in redis',
              Assignee: 'Li ZHI',
              Status: 'IN PROGRESS',
              Estimated: '2d',
              LoggedWork: '1d',
              Sprint: 'QA-843',
              Release: '20181206'
            },
            {
              id: 222,
              P: 'H',
              T: 'Task',
              Key: 'TOC-247',
              Summary: 'QA - Redis clean and remove the version in redis',
              Assignee: 'Li ZHI',
              Status: 'IN PROGRESS',
              Estimated: '2d',
              LoggedWork: '1d',
              Sprint: 'CORE-843',
              Release: '20181206'
            },
            {
              id: 223,
              P: 'H',
              T: 'Task',
              Key: 'TOC-247',
              Summary: 'Feature - Redis clean and remove the version in redis',
              Assignee: 'Li ZHI',
              Status: 'IN PROGRESS',
              Estimated: '2d',
              LoggedWork: '1d',
              Sprint: 'CORE-843',
              Release: '20181206'
            }
          ]
        }
      ]
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  },
  async mounted() {
    try {
      // let res = await Jira.http.get(`jira_api/${Jira.apis.projects()}`)
      // this.projects = res.data
    } catch (err) {
      console.log(err)
    }
  }
}
</script>

<style lang="less">
@import './SpringBoard.less';
</style>
