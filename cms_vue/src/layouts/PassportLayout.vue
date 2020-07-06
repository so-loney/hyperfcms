<template>
  <div class="ape-container">
    <div class="ape-content">
      <div class="ape-top">
        <div class="ape-header">
            <router-link to="/">
            <img alt="logo" class="ape-logo" :src="logo" />
            <span class="ape-title">HyperfCMS</span>
            </router-link>
        </div>
        <div class="ape-desc">前后端分离架构下完整建站后台</div>
      </div>
      <router-view />
    </div>
    <Footer />
  </div>
</template>
<script>
import logo from "@/assets/logo.png";
import Footer from './Footer'

export default {
  components: {
    Footer,
  },
  data(){
    return {
      logo
    }
  },
  computed: {

  }
}
</script>

<style lang="stylus">
  $screen-md-min = 768px
  $heading-color = rgba(0, 0, 0, 0.85)
  $font-size-base = 14px
  $text-color-secondary = rgba(0, 0, 0, 0.45)

  .ape-container
      display flex
      flex-direction column
      height 100vh
      overflow auto
      background #f0f2f5
  .ape-content
    padding 32px 0
    flex 1
  @media (min-width $screen-md-min)
    .ape-container
      background-image url("https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg")
      background-repeat no-repeat
      background-position center 110px
      background-size 100%
    .ape-content
      padding 112px 0 24px 0
  .ape-top
    text-align center
  .ape-header
    height 44px
    line-height 44px
    a
      text-decoration none
  .ape-logo
    height 40px
    vertical-align top
    margin-right 4px
  .ape-title
      font-size 33px
      color $heading-color
      font-family "Myriad Pro", "Helvetica Neue", Arial, Helvetica, sans-serif
      font-weight 600
      position relative
      top -2px
  .ape-desc
    font-size $font-size-base
    color $text-color-secondary
    margin-top 8px
    margin-bottom 32px
</style>


