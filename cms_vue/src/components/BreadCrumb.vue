<template>
  <el-breadcrumb separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item
        v-for="(item) in crumbList" 
        :key="item.path">
        <router-link :to="item.redirect||item.path||'/'">{{item.meta.title}}</router-link>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
export default {
  data() {
    return {
      crumbList:null
    }
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.meta.title)
      this.crumbList = matched
    }
  },
  created: function () {
    this.getBreadcrumb()
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  }
}
</script>

<style lang="stylus">
.el-breadcrumb
  margin-bottom 16px
</style>
