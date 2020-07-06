<template>
  <div>
    <PageHeaderLayout> 
      <div class="main-page-content">
        <router-view></router-view>
      </div>
    </PageHeaderLayout>
  </div >
</template>

<script>
import PageHeaderLayout from '@/layouts/PageHeaderLayout'


export default {
  components: {
    PageHeaderLayout,
  },
  data() {
    return {
    }
  },
  computed: {
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
