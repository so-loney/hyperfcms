<template>
  <div>
    <router-view v-show="$route.matched.length==3"></router-view>
    <PageHeaderLayout v-show="$route.matched.length==2">
      <div class="main-page-content">
        系统配置
      </div>
    </PageHeaderLayout>
  </div >
</template>

<script>
import PageHeaderLayout from '@/layouts/PageHeaderLayout'
import { mapGetters } from 'vuex'

export default {
  components: {
    PageHeaderLayout,
  },
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters(['userPermissions'])
  },
  watch: {

  },
  methods: {
  },

  mounted() {
  },
}
</script>

<style lang="stylus">
</style>
