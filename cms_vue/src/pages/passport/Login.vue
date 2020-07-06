<template>
  <div class="auth-main">
    <el-tabs v-model="activeName" :before-leave="beforeSwitch">
      <el-tab-pane label="账号密码登录" name="login1">
        <el-form ref="loginForm" :model="loginData" :rules="rules">
          <el-form-item prop="account">
            <el-input v-model="loginData.account" placeholder="账号：13999999999" prefix-icon="iconfont icon-shouji4"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="loginData.password" placeholder="密码：13999999999" prefix-icon="iconfont icon-lock"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="login-button" type="primary" @click="loginClick">登 录</el-button>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="loginData.remember">记住密码</el-checkbox>
            <router-link class="login-register" to="login" @click.native="registerClick" >注册账户</router-link>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="钉钉登录" name="login2">
        扫码登录
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {mapMutations } from 'vuex'

export default {
  data() {
    return {
      activeName: 'login1',
      loginData: {},
      // 表单验证
      rules: {
        account: [
          {required: true, message: '输入账号手机号', trigger: 'blur' },
        ],
        password: [
          {required: true, message: '输入密码', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    ...mapMutations([
      'handleUserInfo'
    ]),
    registerClick() {
      this.$message.error('功能暂未开放。')
    },
    // tab标签切换前调用,activeName, oldActiveNam
    beforeSwitch(active,old) {
      console.log(old)
      if (active == 'login2') {
        this.$message.error('功能暂未开放。')
        return false
      }
    },
    // 点击登录按钮
    loginClick() {
      // 调用组件的数据验证方法
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          this.formSubmit()
        } else {
          this.$message.error('登录失败，请检查必填项数据！')
        }
      })
    },
    // 实际登录请求
    async formSubmit() {
      let userInfo = await this.$api.submitLoginInfo(this.loginData)
      if (userInfo) {
        localStorage.setItem('user_info',JSON.stringify(userInfo))
        this.handleUserInfo(userInfo)
        this.$message.success('登录成功！')
        this.go()
      } else {
        this.initRespErrMsgBoxMark()
        this.$message.error('登录失败，请联系管理员！')
      }
    },
    // 路由跳转
    go(url='/') {
      this.$router.push(url);
    },
    // 初始化响应错误弹窗标志
    initRespErrMsgBoxMark() {
      this.$store.commit('changeRespErrMsgBoxMark',false)
    }
  },
  mounted() {
    this.initRespErrMsgBoxMark()
  },
}
</script>

<style lang="stylus">
  .auth-main
    width 368px
    margin 0 auto
  .el-tabs__nav-wrap::after
    height 0px
  .el-tabs__nav
    display inline-block
    float none
  .el-tabs__header
    text-align center
  .el-input__prefix
    left 8px
  .el-tabs__header
    margin-bottom 24px
  .login-button
    width 100%
  .login-register
    float right
    text-decoration none
    color #1890ff
  .el-checkbox,.el-checkbox__input.is-checked + .el-checkbox__label
    color rgba(0,0,0,0.65)
  #tab-login2
    height 0px
</style>
