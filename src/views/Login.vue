<template>
  <div class="login">
    <Form ref="form" class="login-box" :model="user" :rules="rules" @validate="errors=$event">
      <div class="login-title">Sign up</div>
      <div class="login-text">
        <p>Welcome to use smart jira.</p>
      </div>
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
      <LinkButton btnCls="login-btn" :disabled="isLogining" @click="handleLogin">Sign me up!</LinkButton>
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
            let res = await Jira.http.post(
              `jira_api/${Jira.apis.authentication()}`,
              {
                username: this.user.username,
                password: this.user.password
              }
            )
            if (res.status === 200) {
              this.$cookies.set('user_name', this.user.username)
              this.$router.push({
                name: 'index'
              })
            }
          } catch (err) {
            this.user.password = null
            this.$refs.password.blur()
            this.errors.password.push('password is not correct')
            setTimeout(() => {
              this.$refs.password.focus()
            }, 200)
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
