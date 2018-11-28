<template>
  <div class="create_story">
    <div class="header-title">
      <span>Base Information</span>
    </div>
    <el-form
      :model="story"
      :rules="rules"
      ref="storyForm"
      label-width="120px"
      label-position="left"
      :hide-required-asterisk="true"
    >
      <el-form-item label="Story Summary" prop="summary">
        <el-input v-model="story.summary"></el-input>
      </el-form-item>
      <el-form-item label="Story Type" prop="type">
        <el-radio-group v-model="story.type">
          <el-radio label="Feature - Epic"></el-radio>
          <el-radio label="Tech - Epic"></el-radio>
          <el-radio label="Feature"></el-radio>
          <el-radio label="Tech"></el-radio>
          <el-radio label="Tech Without Testing"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-row :gutter="100">
        <el-col :span="12">
          <el-form-item label="Spring" prop="spring">
            <el-input v-model="story.spring"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Fix Version" prop="fixVersion">
            <el-input v-model="story.fixVersion"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="Time To Test" prop="timeToTest">
        <el-date-picker v-model="story.timeToTest" type="date"></el-date-picker>
      </el-form-item>
      <el-form-item label="Description" prop="description">
        <el-input type="textarea" :rows="5" v-model="story.description"></el-input>
      </el-form-item>
      <el-form-item label="Team" prop="team">
        <el-checkbox-group v-model="story.team">
          <el-checkbox label="Core" name="team"></el-checkbox>
          <el-checkbox label="WEB" name="team"></el-checkbox>
          <el-checkbox label="BE" name="team"></el-checkbox>
          <el-checkbox label="QA" name="team"></el-checkbox>
          <el-checkbox label="Growth" name="team"></el-checkbox>
          <el-checkbox label="Chemical&Bio" name="team"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div class="header-title">
      <span>Virtural Team</span>
    </div>
    <el-form class="story-virtural-teams">
      <el-tag size="medium">PM Owner</el-tag>
      <el-tag size="medium" type="success">UX Owner</el-tag>
      <el-tag size="medium" type="info">Tech Owner</el-tag>
      <el-tag size="medium" type="warning">QA Owner</el-tag>
    </el-form>
    <el-form class="story-buttons">
      <el-button @click="resetForm('storyForm')">Cancel</el-button>
      <el-button type="primary" @click="submitForm('storyForm')">Save</el-button>
      <el-button type="primary" @click="submitForm('storyForm')">Save & Create</el-button>
    </el-form>
  </div>
</template>

<script>
import Jira from '@/libs/jira'
export default {
  name: 'create_story',
  data() {
    return {
      story: {
        summary: null,
        type: null,
        spring: null,
        fixVersion: null,
        timeToTest: null,
        description: null,
        team: []
      },
      rules: {
        summary: [
          { required: true, message: 'Please input summary', trigger: 'blur' }
        ],
        type: [{ required: true, message: 'Please select type', trigger: 'change' }],
        spring: [{ required: true, message: 'Please input spring', trigger: 'blur' }],
        fixVersion: [
          { required: true, message: 'Please input fix version', trigger: 'blur' }
        ],
        timeToTest: [
          { required: true, message: 'Please select date', trigger: 'change' }
        ],
        description: [
          { required: true, message: 'Please input description', trigger: 'blur' }
        ],
        team: [
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
      let res = await Jira.http.get(`jira_api/${Jira.apis.projects()}`)
      this.projects = res.data
    } catch (err) {
      console.log(err)
    }
  }
}
</script>

<style lang="less">
@import './CreateStory.less';
</style>
