<template>
  <div class="mars-ape-layout-header">
    <div class="header-left">
      <i class="iconfont header-index-trigger" :class="[isCollapse?'icon-menu-fold':'icon-menu-unfold']" @click="handleClick"></i>
    </div>
    <div class="header-middle">

    </div>
    <div class="header-right">
      <!-- <span class="right-notice">
        <el-badge :value="12" class="item">
          <i class="iconfont icon-lingdang"></i>
        </el-badge>
      </span> -->
      <el-dropdown @command="handleCommand">
        <span class="right-account">
          <span class="right-account-avatar">
            <img src="@/assets/avatar.png" alt="avatar">
          </span>
          <span class="right-account-name">{{userInfo['nickname']}}</span>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item disabled command="setting"><i class="iconfont icon-touxiang"></i><span>个人设置</span></el-dropdown-item>
          <el-dropdown-item divided command="logout"><i class="iconfont icon-tuichudenglu2"></i><span>退出登录</span></el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters,mapMutations } from 'vuex'

export default {
  data() {
    return {

    }
  },
  methods: {
    ...mapMutations([
      'handleUserInfo'
    ]),
    // 左侧菜单的展开折叠
    handleClick () {
      this.$store.commit('changeCollapse')
    },
    // 处理下拉菜单指令
    handleCommand(command) {
      if (command === 'logout') {
        this.handleLogout()
      }
    },
    // 处理退出
    async handleLogout() {
        this.$api.submitLogout()
        localStorage.removeItem('user_info')
        this.$message.success('退出成功！')
        this.$router.push('/login')
    }
  },
  computed: {
    ...mapGetters(['isCollapse','userInfo'])
  },
  mounted() {
    let userInfo = JSON.parse(localStorage.getItem('user_info'))
    this.handleUserInfo(userInfo)
  },
}
</script>

<style lang="stylus" scoped>
.mars-ape-layout-header .iconfont 
  display inline-block
  box-sizing border-box
  font-size 24px
.mars-ape-layout-header 
  height 64px
  background #fff
  box-shadow 0 1px 4px rgba(0,21,41,.08)
  position relative
  overflow hidden
.mars-ape-layout-header>.header-left,.mars-ape-layout-header>.header-middle 
  float left
  color #595959
.mars-ape-layout-header>.header-right 
  float right
  line-height 64px
  overflow hidden
.mars-ape-layout-header>.header-left>.header-index-trigger 
  font-size 20px
  height 64px
  cursor pointer
  transition all .3s,padding 0s
  padding 22px 24px
i.header-index-trigger:hover 
  background rgba(0,0,0,.025)
.header-right .right-account,.header-right .right-notice 
  padding 0 12px
  display inline-block
  transition all .3s
  cursor pointer
  color:rgba(0,0,0,.65)
.right-notice .el-badge 
  line-height 24px
.right-account-avatar>img 
  width 100%
  display block
.right-account-avatar 
  width 24px
  line-height 24px
  border-radius 50%
  display inline-block
  margin 20px 8px 20px 0
  vertical-align top
.right-account-name 
  font-size 14px
.right-notice:hover,.right-account:hover 
  background rgba(0,0,0,.025)
.el-dropdown-menu__item 
  padding 5px 12px
  line-height 22px
  font-weight 400
  color rgba(0,0,0,0.65)
.el-dropdown-menu__item > .iconfont 
  margin-right 8px
.el-dropdown-menu 
  padding 4px 0
  margin 0px
.el-dropdown-menu__item--divided 
  padding-top 0px
  line-height 28px
.el-dropdown-menu__item--divided::before 
  margin 0 -12px
.el-dropdown-menu.el-popper 
  min-width 160px
  top 56px !important
.el-popper .popper__arrow 
  border-width 0px
.el-popper .popper__arrow::after 
  border-width 0px
</style>