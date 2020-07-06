<template>
  <div  style="margin: -24px -24px 0;" >
    <div class="page-header">
      <BreadCrumb />
      <div class="page-header-detail">
        <slot name="page-header-detail"></slot>
      </div>
    </div>
    <div id="page-content" class="page-content">
        <slot />
    </div>
  </div>
</template>

<script>
import BreadCrumb from "@/components/BreadCrumb"
export default {
  components: {
    BreadCrumb
  }
}
</script>

<style lang="stylus">
.page-header
  background #fff
  padding 16px 32px 0 32px
  border-bottom 1px solid #e8e8e8
.page-content
  margin 24px 24px 0
.main-page-content
  min-height 600px
</style>

