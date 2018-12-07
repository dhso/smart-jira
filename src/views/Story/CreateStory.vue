<template>
  <div class="create_story">
    <el-form
      :model="story"
      :rules="rules"
      ref="storyForm"
      label-width="120px"
      label-position="left"
      :hide-required-asterisk="true"
    >
      <div class="header-title">
        <span>Base Information</span>
      </div>
      <el-form-item label="Story Summary" prop="summary">
        <el-input v-model="story.summary"></el-input>
      </el-form-item>
      <el-form-item label="Story Type" prop="story_type">
        <el-radio-group v-model="story.story_type">
          <template v-for="storyType in storyTypes">
            <el-radio :label="storyType" :key="storyType" @change="storyTypeChangeHandler"></el-radio>
          </template>
        </el-radio-group>
      </el-form-item>
      <el-row :gutter="100">
        <el-col :span="12">
          <el-form-item label="Sprint" prop="sprint">
            <el-select v-model="story.sprint" filterable class="w300" :loading="sprintsLoading">
              <el-option v-for="(val, key) in sprints" :key="val" :label="key" :value="val"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Fix Version" prop="fix_version">
            <el-select
              v-model="story.fix_version"
              filterable
              class="w300"
              :disabled="JSON.stringify(fixVersions)==='{}'"
            >
              <el-option-group v-for="(items, group) in fixVersions" :key="group" :label="group">
                <el-option v-for="item in items" :key="item" :label="item" :value="item"></el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="Time To Test" prop="time_to_test">
        <el-date-picker
          v-model="story.time_to_test"
          type="datetime"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-ddTHH:mm:00.000ZZ"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="Description" prop="description">
        <el-input type="textarea" :rows="5" v-model="story.description"></el-input>
      </el-form-item>
      <el-form-item label="Team" prop="teams">
        <el-checkbox-group v-model="story.teams">
          <el-checkbox v-for="team in teams" :label="team" :key="team"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <div class="header-title">
        <span>Virtural Team</span>
      </div>
      <el-row :gutter="100">
        <el-col :span="12">
          <el-form-item label="PM" prop="pm">
            <el-select v-model="story.pm" filterable :disabled="teamMembers.length===0">
              <el-option
                v-for="teamMember in teamMembers"
                :key="teamMember"
                :label="teamMember"
                :value="teamMember"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="UX" prop="ux">
            <el-select v-model="story.ux" filterable :disabled="teamMembers.length===0">
              <el-option
                v-for="teamMember in teamMembers"
                :key="teamMember"
                :label="teamMember"
                :value="teamMember"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="100">
        <el-col :span="12">
          <el-form-item label="TECH" prop="tech">
            <el-select v-model="story.tech" filterable :disabled="teamMembers.length===0">
              <el-option
                v-for="teamMember in teamMembers"
                :key="teamMember"
                :label="teamMember"
                :value="teamMember"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="QA" prop="qa">
            <el-select v-model="story.qa" filterable :disabled="teamMembers.length===0">
              <el-option
                v-for="teamMember in teamMembers"
                :key="teamMember"
                :label="teamMember"
                :value="teamMember"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-form class="story-buttons">
      <el-button @click="resetForm('storyForm')">Cancel</el-button>
      <el-button type="primary" @click="submitForm('storyForm', false)" :disabled="submiting">Save</el-button>
      <el-button
        type="primary"
        @click="submitForm('storyForm', true)"
        :disabled="submiting"
      >Save & Create</el-button>
    </el-form>
  </div>
</template>

<script>
import Jira from '@/libs/jira'

export default {
  name: 'create_story',
  data() {
    return {
      storyTypes: [],
      teams: [],
      sprints: {},
      sprintsLoading: false,
      fixVersions: {},
      teamMembers: [],
      submiting: false,
      story: {
        summary: null,
        story_type: null,
        sprint: null,
        fix_version: null,
        time_to_test: null,
        description: null,
        teams: [],
        pm: null,
        ux: null,
        tech: null,
        qa: null
      },
      rules: {
        summary: [
          { required: true, message: 'Please input summary', trigger: 'blur' }
        ],
        story_type: [
          {
            required: true,
            message: 'Please select story type',
            trigger: 'change'
          }
        ],
        sprint: [
          { required: true, message: 'Please input sprint', trigger: 'blur' }
        ],
        fix_version: [
          {
            required: true,
            message: 'Please input fix version',
            trigger: 'blur'
          }
        ],
        time_to_test: [
          { required: true, message: 'Please select date', trigger: 'change' }
        ],
        description: [
          {
            required: true,
            message: 'Please input description',
            trigger: 'blur'
          }
        ],
        teams: [
          {
            type: 'array',
            required: true,
            message: 'Please choose at least one team',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    submitForm(formName, isReset) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.submiting = true
          Jira.http
            .post(`jira_api/${Jira.apis.create_issue()}`, this.story)
            .then(createIssueRes => {
              console.log(createIssueRes)
              this.$message.success('Create story success!')
              let issueInfo = createIssueRes.data.results
              let html = ''
              for (let key in issueInfo) {
                html += `<p>${key}: ${issueInfo[key]}</p>`
              }
              this.$notify.success({
                title: 'Success Create Info',
                dangerouslyUseHTMLString: true,
                message: html
              })
              if (isReset) {
                this.resetForm(formName)
              }
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
    },
    storyTypeChangeHandler(val) {
      this.fetchStoryTypeRelation(val)
    },
    resetData() {
      this.fixVersions = {}
      this.story.fix_version = null
      this.teamMembers = []
      this.story.teams = []
      this.story.qa = null
      this.story.pm = null
      this.story.ux = null
      this.story.tech = null
      this.story.qa = null
    },
    fetchStoryTypeRelation(storyType) {
      this.resetData()
      switch (storyType) {
        case 'TECH_EPIC':
          this.story.teams = []
          break
        case 'FEATURE':
        case 'TECH':
        case 'TECH_WITHOUT_TESTING':
          this.story.teams = ['CORE']
          break
      }
      Jira.http
        .get(`jira_api/${Jira.apis.fix_versions(storyType)}`)
        .then(fixVersionsRes => {
          this.fixVersions = fixVersionsRes.data.results
        })
        .catch(err => {
          this.$message.error(err.message)
        })
      Jira.http
        .get(`jira_api/${Jira.apis.team_members(storyType)}`)
        .then(teamMembersRes => {
          this.teamMembers = teamMembersRes.data.results
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    }
  },
  mounted() {
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
    Jira.http
      .get(`jira_api/${Jira.apis.story_types()}`)
      .then(storyTypeRes => {
        this.storyTypes = storyTypeRes.data.results
      })
      .catch(err => {
        this.$message.error(err.message)
      })
    Jira.http
      .get(`jira_api/${Jira.apis.teams()}`)
      .then(teamsRes => {
        this.teams = teamsRes.data.results
      })
      .catch(err => {
        this.$message.error(err.message)
      })
  }
}
</script>

<style lang="less">
@import './CreateStory.less';
</style>
