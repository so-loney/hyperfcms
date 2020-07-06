<template>
  <el-container>
    <el-aside>
      <SiderMenu />
    </el-aside>
    <el-container class="mars-ape-layout">
      <el-header class="mars-ape-layout-header">
        <Header />
      </el-header>
      <el-main>
          <div v-if="isRootRoutePath">
            <div class="mod-index">
              <h3>项目介绍</h3>
              <ul>
                <li>Gitee地址：<a href="https://gitee.com/beijing_youmi/youmi_hyperfcms_open" target="_blank">https://gitee.com/beijing_youmi/youmi_hyperfcms_open</a></li>
                <li>如需关注项目最新动态，请Watch、Star项目，同时也是对项目最好的支持</li>
              </ul>
              <h3>项目沟通</h3>
              <ul class="xm-gt">
                <li>QQ群：233671475</li>
                <li>
                  <p>微信群：（由于微信群无法直接加入，故可先加下方二维码好友，并声明目的，再拉您入群。）</p>
                  <p><img src="@/assets/123456789.jpeg" alt="加群主微信拉群"></p>
                </li>
              </ul>
              <h3>捐献及赞助</h3>
              <ul class="jx-zz">
                <li>如果您觉得HyperfCMS给您带来了帮助，可以用扫个码来表示您的谢意 —— 偶然请我们喝杯茶 :)</li>
                <div>
                  <img src="@/assets/zhifubaoshoukuan.png" alt="支付宝付款">
                  <img src="@/assets/weixinshoukuan.png" alt="微信付款">
                  <img src="@/assets/zhongxinxinyongka.png" alt="中信信用卡">
                </div>
              </ul>
            </div>
          </div>
          <router-view />
      </el-main>
      <el-footer>
        <Footer />
      </el-footer>
    </el-container>
  </el-container>
</template>
<script>
import SiderMenu from './SiderMenu'
import Header from './Header'
import Footer from './Footer'

export default {
  components: {
    SiderMenu,
    Header,
    Footer,
  },
  data(){
    return {

    }
  },
  computed: {
    isRootRoutePath: function() {
      return this.$route.path=='/'
    },
  }
}
</script>
<style lang="stylus">
.mod-index
  border-radius 5px
  background #fff
  padding 24px
  min-height 800px
  line-height 1.5
  p
    margin 0
  h3
    margin-block-start 0
    margin-block-end 0.5em
  .xm-gt img
    height 240px
    margin-left -16px
  .jx-zz img 
    height 400px
    margin-top 24px
    margin-right 24px
.el-container
  background #f0f2f5
.el-aside
  min-height 100vh
  box-shadow 2px 0 6px rgba(0,21,41,.35)
  position relative
  width auto !important
  z-index 10
  transitionall .3s
  background #001529
.el-header 
  height 64px !important
  padding 0px
  width 100%
.el-main
  padding 0px
  margin 24px
  overflow inherit
  flexnone !important
  min-height 720px
.main-page-content
  border-radius 5px
  background #ffffff
  padding 24px
.el-footer
  height auto !important
</style>


