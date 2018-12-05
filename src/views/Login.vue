<template>
  <div class="login">
    <Form ref="form" class="login-box" :model="user" :rules="rules" @validate="errors=$event">
      <div class="login-title">Sign In</div>
      <div class="mb20">
        <TextBox
          name="username"
          v-model="user.username"
          cls="w100"
          placeholder="Username"
          iconCls="icon-man"
          @keyup.enter.native="handleLogin"
        ></TextBox>
        <div class="input-error">{{getError('username')}}</div>
      </div>
      <div class="mb20">
        <PasswordBox
          ref="token"
          name="token"
          v-model="user.token"
          cls="w100"
          placeholder="Token"
          @keyup.enter.native="handleLogin"
        ></PasswordBox>
        <div class="input-error">{{getError('token')}}</div>
      </div>
      <el-button
        type="primary"
        class="login-btn"
        :disabled="isLogining"
        @click="handleLogin"
      >Sign In</el-button>
    </Form>
  </div>
</template>

<script>
import Jira from '@/libs/jira'
export default {
  name: 'login',
  data() {
    return {
      isLogining: false,
      user: {
        username: null,
        token: null
      },
      rules: {
        username: ['required'],
        token: ['required']
      },
      errors: {}
    }
  },
  methods: {
    getError(name) {
      return this.errors[name] && this.errors[name].length
        ? this.errors[name][0]
        : null
    },
    hasError(name) {
      return this.getError(name) != null
    },
    handleLogin() {
      this.$refs.form.validate(async valid => {
        if (
          Object.values(valid).every((element, index, array) => {
            return element.length === 0
          })
        ) {
          try {
            this.isLogining = true
            let loginData = await Jira.http.post(
              `jira_api/${Jira.apis.authentication()}`,
              {
                user_name: this.user.username,
                token: this.user.token
              }
            )
            if (loginData.status === 200) {
              // let userInfoData = await Jira.http.get(
              //   `jira_api/${Jira.apis.myself()}`
              // )
              this.$storejs.set('user_name', this.user.username)
              this.$cookies.set('user_name', this.user.username)
              this.$router.push({
                path: '/'
              })
            }
          } catch (err) {
            this.errors.token.push('token is not correct')
            this.$refs.token.focus()
          } finally {
            this.isLogining = false
          }
        }
      })
    }
  }
}
</script>

<style lang="less">
@import './Login.less';
</style>
