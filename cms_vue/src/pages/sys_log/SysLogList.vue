<template>
  <div>
    <PageHeaderLayout>
      <div class="main-page-content">
        <el-row class="table-search">
          <el-form size="medium" :inline="true" :model="searchCondition" class="demo-form-inline">
            <el-form-item label="用户">
              <el-input v-model="searchCondition.user_id" placeholder="输入用户id" clearable></el-input>
            </el-form-item>
            <el-form-item label="QID">
              <el-input v-model="searchCondition.qid" placeholder="输入qid" clearable></el-input>
            </el-form-item>
            <el-form-item label="类型">
              <el-input v-model="searchCondition.channel" placeholder="输入类型" clearable></el-input>
            </el-form-item>
            <el-form-item label="发布时间">
              <el-date-picker
                v-model="searchCondition.time_value"
                type="datetimerange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchButton">查询</el-button>
            </el-form-item>
          </el-form>
        </el-row>
        <ApeTable ref="apeTable" :data="sysLogList" :columns="columns" :loading="loadingStaus" :pagingData="pagingData" @switchPaging="switchPaging" highlight-current-row border align=center>
        </ApeTable>
      </div>
    </PageHeaderLayout>
  </div >
</template>

<script>
import PageHeaderLayout from '@/layouts/PageHeaderLayout'
import ApeTable from '@/components/ApeTable'

export default {
  components: {
    PageHeaderLayout,
    ApeTable
  },
  data() {
    return {
      loadingStaus: true,
      columns: [
        {
          title: 'ID',
          value: 'id',
          width: 88,
          header_align: 'center',
          align: 'center'
        },
        {
          title: '用户/访问',
          value: [
            {label:'用户：',value:'user_id_alias',value_alias:'user_id'},
            {label:'QID：',value:'qid_alias',value_alias:'qid'},
            {label:'类型：',value:'channel_alias',value_alias:'channel'},
            {label:'路径：',value:'uri_alias',value_alias:'uri'}, 
          ],
          header_align:'center',
          width: '320px'
        },
        {
          title: '访问设备',
          value: [
            {label:'设备：',value:'platform_device'},
            {label:'浏览器：',value:'browser'}, 
            {label:'日志级别：',value:'level_name'}, 
          ],
          header_align:'center',
          width: '220px'
        },
        {
          title: '请求响应',
          value: [
            {label:'方法：',value:'method'},
            {label:'请求大小：',value:'request_body_size_alias'},
            {label:'响应大小：',value:'response_body_size_alias'},
            {label:'执行时间：',value:'execution_time_alias'}, 
          ],
          header_align:'center',
          width: '180px'
        },
        {
          title: '传参/MSG',
          value: [
            {label:'传参：',value:'arguments_alias',value_alias:'arguments'},
            {label:'MSG：',value:'message_alias',value_alias:'message'},
          ],
          header_align:'center',
        },  
        {
          title: 'IP/时间',
          value: [
            {label:'客户IP：',value:'real_ip'}, 
            {label:'服务IP：',value:'server_addr'},
            {label:'访问时间：',value:'created_at'}
          ],
          header_align:'center'
        }
      ],
      // 搜索条件
      searchCondition:{},
      // 日志列表
      sysLogList:[],
      // 分页信息
      pagingData:{
        is_show: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0
      },
    }
  },
  computed: {
  },
  methods: {
    // 搜索
    searchButton() {
      this.initSysLogList()
    },
    // 切换页码操作
    async switchPaging() {
      this.initSysLogList()
    },
    // 初始化附件列表
    async initSysLogList(type) {
      this.loadingStaus=true
      let pagingInfo = this.$refs['apeTable'].getPagingInfo(type)
      let searchCondition = this.handleSearchCondition()
      Object.assign(searchCondition,pagingInfo)
      let {list,pages}= await this.$api.getSysLogList(searchCondition)
      this.sysLogList = []
      this.$nextTick(() => {
        this.sysLogList=list
      })
      this.pagingData.total = pages.total
      this.loadingStaus=false
    },
    // 处理搜索条件
    handleSearchCondition() {
      let condition = {}
      if (this.searchCondition.qid) {
        condition.qid = this.searchCondition.qid
      }
      if (this.searchCondition.channel) {
        condition.channel = this.searchCondition.channel
      }
      if (this.searchCondition.user_id) {
        condition.user_id = this.searchCondition.user_id
      }
      if (this.searchCondition.time_value) {
        condition.start_time = this.searchCondition.time_value[0]
        condition.end_time = this.searchCondition.time_value[1]
      }

      return condition
    },
  },
  mounted() {
    this.initSysLogList()
  },
}
</script>

<style lang="stylus">
  .el-button
    margin-right 4px
    margin-bottom 4px
  .table-header
    margin-bottom 12px
  .drag-handle
    font-size 24px
    cursor pointer
  .el-input-group__prepend, .el-input-group__append
    background #ffffff
    padding 0 12px
  .el-input-group__append
    color #ffffff
    background #1890ff
  .el-popover .el-checkbox-group .el-checkbox
    margin-left 0px
    margin-right 12px
  .el-select > .el-input 
    width 373.33px
  .el-radio.is-bordered
    width 100px
  .el-color-picker
    position absolute
</style>
