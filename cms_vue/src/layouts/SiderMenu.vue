<template>
  <div class="mars-ape-sider" :class="{'mars-ape-sider-collapse':isCollapse}">
    <div class="sider-logo">
      <a href="/">
        <img src="@/assets/logo.png" alt="logo">
        <h1>HyperfCMS</h1>
      </a>
    </div>
    <el-menu class="sider-menu"
    :default-active="routePath"
    :unique-opened="true"
    active-text-color="#ffffff"
    :collapse="isCollapse">
      <el-submenu 
      v-for="(v, k) in menuList"
      :key = "k"
      :index="v['id'].toString()">
        <template slot="title">
          <i class="iconfont" :class="[v['icon'],isCollapse?'is-collapse':'']"></i>
          <span>{{v['display_name']}}</span>
        </template>
        <div class="sider-menu-sub">
          <el-menu-item
          v-for="(v, k) in v['children']"
          :key="k"
          :index="v['url']">
            <router-link :to="v['url']" >{{v['display_name']}}</router-link>
          </el-menu-item>
        </div>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapGetters(['isCollapse','menuList','routePath'])
  },
  methods: {
    ...mapMutations([
      'handleMenuList',
      'handleRoutePath',
      'handleUserPermissions',
    ])
  },
  async created() {
    let userMenuList = await this.$api.getUserMenuList()
    let userPermissionsList = await this.$api.getUserPermissionsList()
    this.handleMenuList(userMenuList['list'])
    this.handleUserPermissions(userPermissionsList['list'])
    if (Object.keys(this.$route.params).length != 0 && this.$route.matched[1]) {
      this.handleRoutePath(this.$route.matched[1].path)
    } else {
      this.handleRoutePath(this.$route.path)
    }
  },
}
</script>

<style lang="stylus">
.mars-ape-sider:not(.mars-ape-sider-collapse)
  /* flex 0 0 256px */
  width 256px !important
  transition:all .3s
.mars-ape-sider-collapse,.el-menu--collapse
  /* flex 0 0 80px */
  width 80px !important
  transition:all .3s
/* 导航头部 */
.sider-logo
  height 64px
  position relative
  line-height 64px
  padding-left 24px
  transition all .3s
  background #002140
  overflow hidden
  img
    display inline-block
    vertical-align middle
    width 32px
  h1
    color #fff
    display inline-block
    vertical-align middle
    font-size 20px
    margin 0 0 0 12px
    font-family Avenir,Helvetica Neue,Arial,Helvetica,sans-serif
    font-weight 600
/* 导航内容 */
.sider-menu
  min-height 100vh
  width auto !important
  transition all .3s
.el-menu
  border-right solid 0px !important
  list-style none
  position relative
  margin 0
  padding-left 0
  background-color #001529
.sider-menu-sub
  background #000c17
  box-shadow inset 0 2px 8px rgba(0,0,0,.45)
.el-submenu__title,.el-submenu__title 
  color:#b8bec3
.el-submenu__title
  padding-left 24px !important
  padding-right 34px
  margin-top 4px
  margin-bottom 4px
  width 100%
  line-height 40px
  height 40px
.el-menu-item
  height 40px
  line-height 40px
  padding-left 48px !important
  padding-right 16px
  margin-top 4px
  margin-bottom 8px
  color:#b8bec3
  a
    color #b8bec3
    text-decoration none
    display:block
.el-submenu [class^="iconfont"].is-collapse
  padding-left 8px
  font-size 16px
.el-submenu [class^="iconfont"]:not(.is-collapse)
  vertical-align middle
  margin-right 10px
  display inline-block
  min-width 14px
  text-align center
  font-size 14px
.el-menu-item:hover, .el-menu-item:focus
  background-color:#000c17
.el-menu-item:hover a, .el-menu-item:focus a
  color #ffffff
.el-submenu__title:hover,.el-submenu__title:hover i, .el-submenu__title:focus i .el-submenu__title:focus
  background-color:#001529
  color #ffffff
.el-submenu.is-opened .el-submenu__title,.el-submenu.is-opened .el-submenu__title>i,.el-submenu.is-active .el-submenu__title,.is-active>a,.el-submenu.is-active .el-submenu__title>i
  color #ffffff
.el-menu-item.is-active
  background-color #179aff
/* 折叠后子菜单效果 */
.el-menu--vertical
  left 84px !important
.el-menu--popup
  border-radius 4px
  min-width 160px
  
</style>