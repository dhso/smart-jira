<template>
  <div class="bulk_update">
    <el-form
      :model="bulk"
      :rules="rules"
      ref="bulkForm"
      label-width="120px"
      label-position="left"
      :hide-required-asterisk="true"
    >
      <div class="header-title">
        <span>Bulk Update</span>
      </div>
      <el-form-item label="Tickets" prop="tickets">
        <el-input
          type="textarea"
          :rows="5"
          v-model="bulk.tickets"
          placeholder="Please enter tickets, separated by a comma."
        ></el-input>
      </el-form-item>
      <el-form-item label="Ticket Type" prop="ticket_type">
        <el-select v-model="bulk.ticket_type" :loading="ticketTypesLoading" filterable clearable>
          <el-option
            v-for="ticketType in ticketTypes"
            :key="ticketType"
            :label="ticketType"
            :value="ticketType"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Fix Version" prop="fix_version">
        <el-select
          v-model="bulk.fix_version"
          filterable
          clearable
          class="w300"
          :loading="fixVersionLoading"
        >
          <el-option-group v-for="(items, group) in fixVersions" :key="group" :label="group">
            <el-option v-for="item in items" :key="item" :label="item" :value="item"></el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item label="Sprint" prop="sprint_id">
        <el-select
          v-model="bulk.sprint_id"
          filterable
          clearable
          class="w300"
          :loading="sprintsLoading"
        >
          <el-option v-for="(val, key) in sprints" :key="val" :label="key" :value="val"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Epic" prop="epic_key">
        <el-select v-model="bulk.epic_key" filterable clearable class="w100" :loading="epicsLoading">
          <el-option
            v-for="epic in epics"
            :key="epic.key"
            :label="epic.key +'  ' + epic.name"
            :value="epic.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Time To Test" prop="time_to_test">
        <el-date-picker
          v-model="bulk.time_to_test"
          type="datetime"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-ddTHH:mm:00.000ZZ"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <el-form class="bulk-buttons">
      <el-button @click="resetForm('bulkForm')">Cancel</el-button>
      <el-button type="primary" @click="submitForm('bulkForm')" :disabled="submiting">Save</el-button>
    </el-form>
  </div>
</template>

<script>
import Jira from '@/libs/jira'
export default {
  name: 'bulk_update',
  data() {
    return {
      ticketTypes: [],
      ticketTypesLoading: false,
      fixVersions: {},
      fixVersionLoading: false,
      sprints: {},
      sprintsLoading: false,
      epics: [],
      epicsLoading: false,
      submiting: false,
      bulk: {
        tickets: null,
        ticket_type: null,
        fix_version: null,
        sprint_id: null,
        epic_key: null,
        time_to_test: null
      },
      rules: {
        tickets: [
          { required: true, message: 'Please input tickets', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.submiting = true
          Jira.http
            .post(`jira_api/${Jira.apis.bulk_update()}`, this.bulk)
            .then(bulkUpdateRes => {
              this.$message.success('Bulk update success!')
              let bulkInfo = bulkUpdateRes.data.results
              let html = ''
              for (let item of bulkInfo) {
                html += `<p>${item}</p>`
              }
              this.$notify.success({
                title: 'Success Update Info',
                dangerouslyUseHTMLString: true,
                message: html
              })
            })
            .catch(err => {
              this.$message.error(err.message)
            })
            .finally(() => {
              this.submiting = false
            })
        } else {
          this.$message.error('Some fields are not correct!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  },
  async mounted() {
    this.ticketTypesLoading = true
    Jira.http
      .get(`jira_api/${Jira.apis.ticket_types()}`)
      .then(ticketTypeRes => {
        this.ticketTypes = ticketTypeRes.data.results
      })
      .catch(err => {
        this.$message.error(err.message)
      })
      .finally(() => {
        this.ticketTypesLoading = false
      })

    this.sprintsLoading = true
    Jira.http
      .get(`jira_api/${Jira.apis.sprints(223, 0)}`)
      .then(sprintsRes => {
        this.sprints = sprintsRes.data.results
      })
      .catch(err => {
        this.$message.error(err.message)
      })
      .finally(() => {
        this.sprintsLoading = false
      })
    this.fixVersionLoading = true
    Jira.http
      .get(`jira_api/${Jira.apis.fix_versions('FEATURE')}`)
      .then(fixVersionsRes => {
        this.fixVersions = fixVersionsRes.data.results
      })
      .catch(err => {
        this.$message.error(err.message)
      })
      .finally(() => {
        this.fixVersionLoading = false
      })

    this.epicsLoading = true
    Jira.http
      .get(`jira_api/${Jira.apis.board_epic(223)}`)
      .then(epicRes => {
        this.epics = epicRes.data.results.values
      })
      .catch(err => {
        this.$message.error(err.message)
      })
      .finally(() => {
        this.epicsLoading = false
      })
  }
}
</script>

<style lang="less">
@import './BulkUpdate.less';
</style>
