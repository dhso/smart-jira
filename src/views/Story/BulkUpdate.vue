<template>
  <div class="bulk_update">
    <div class="header-title">
      <span>Bulk</span>
    </div>
    <el-form
      :model="bulk"
      :rules="rules"
      ref="bulkForm"
      label-width="120px"
      label-position="left"
      :hide-required-asterisk="true"
    >
      <el-form-item label="Tickets" prop="tickets">
        <el-input type="textarea" :rows="5" v-model="bulk.tickets"></el-input>
      </el-form-item>
      <el-form-item label="Fix Version" prop="fixVersion">
        <el-input v-model="bulk.fixVersion"></el-input>
      </el-form-item>
      <el-form-item label="Ticket Type" prop="ticketType">
        <el-select v-model="bulk.ticketType">
          <el-option label="Feature" value="1"></el-option>
          <el-option label="Tech" value="2"></el-option>
          <el-option label="Tech Without Testing" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Sprint" prop="sprint">
        <el-input v-model="bulk.sprint"></el-input>
      </el-form-item>
      <el-form-item label="Epic" prop="epic">
        <el-input v-model="bulk.epic"></el-input>
      </el-form-item>
      <el-form-item label="Time To Test" prop="timeToTest">
        <el-date-picker v-model="bulk.timeToTest" type="date"></el-date-picker>
      </el-form-item>
    </el-form>
    <el-form class="bulk-buttons">
      <el-button @click="resetForm('bulkForm')">Cancel</el-button>
      <el-button type="primary" @click="submitForm('bulkForm')">Save</el-button>
    </el-form>
  </div>
</template>

<script>
// import Jira from '@/libs/jira'
export default {
  name: 'create_story',
  data() {
    return {
      bulk: {
        tickets: null,
        ticketType: '1',
        fixVersion: null,
        sprint: null,
        epic: null,
        timeToTest: null
      },
      rules: {
        tickets: [
          { required: true, message: '请输入tickets', trigger: 'blur' }
        ],
        ticketType: [
          { required: true, message: '请选择ticketType', trigger: 'change' }
        ],
        fixVersion: [
          { required: true, message: '请填写fixVersion', trigger: 'blur' }
        ],
        sprint: [{ required: true, message: '请填写sprint', trigger: 'blur' }],
        epic: [{ required: true, message: '请填写epic', trigger: 'blur' }],
        timeToTest: [
          { required: true, message: '请选择date', trigger: 'change' }
        ]
      }
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
@import './BulkUpdate.less';
</style>
