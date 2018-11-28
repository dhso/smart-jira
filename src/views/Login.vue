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
          ref="password"
          name="password"
          v-model="user.password"
          cls="w100"
          placeholder="Password"
          @keyup.enter.native="handleLogin"
        ></PasswordBox>
        <div class="input-error">{{getError('password')}}</div>
      </div>
      <el-button type="primary" class="login-btn" :disabled="isLogining" @click="handleLogin">Sign In</el-button>
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
        password: null
      },
      rules: {
        username: ['required'],
        password: ['required']
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
                username: this.user.username,
                password: this.user.password
              }
            )
            if (loginData.status === 200) {
              let userInfoData = await Jira.http.get(`jira_api/${Jira.apis.myself()}`)
              this.$storejs.set('user_info',userInfoData.data)
              this.$cookies.set('user_name', this.user.username)
              this.$router.push({
                path: '/'
              })
            }
          } catch (err) {
            this.errors.password.push('password is not correct')
            this.$refs.password.focus()
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
