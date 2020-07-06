<template>
  <div
    v-loading="loading"
    element-loading-text="玩命加载中……"
    element-loading-spinner="el-icon-loading">
    <el-table
      ref="elTable"
      :data="tableData"
      v-bind="$attrs"
      :row-class-name="tableRowClassName"
      @selection-change="handleSelectionChange"
      @row-click="rowClick"
      @expand-change="expandChange">
        <slot name="first-column"></slot>
        <slot name="second-column"></slot>
        <el-table-column
          v-if="typeof(pagingData.offset)!='undefined'"
          width="64"
          label="序号">
          <template slot-scope="scope">
            <span>{{dataOffset+scope.$index+1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(v,k) in columns"
          :key="k"
          :label="v.title"
          :width="v.width"
          :header-align="v.header_align?v.header_align:'left'"
          :align="v.align?v.align:'left'">
          <template slot-scope="scope">
            <span v-if="typeof(v.value)=='string'">
              <span v-if="v.type == 'image'"> <img :src="scope.row[v.value]" :alt="scope.row[v.value]" width="40px"></span>
              <span v-else-if="v.value_alias">
                <el-tooltip effect="dark" :content="scope.row[v.value_alias]" placement="top-start" popper-class="ape-table-tooltip"  v-if="scope.row[v.value]">
                  <span v-html="scope.row[v.value]"></span>
                </el-tooltip>
                 <span v-else v-html="scope.row[v.value_alias]"></span>
              </span>
              <span v-else v-html="scope.row[v.value]"></span>
            </span>
            <span v-else-if="typeof(v.value)=='object'">
              <span v-for="(v1,k1) in v.value" :key="k1">
                <template v-if="v.key">
                  <template v-for="(item, idx) in scope.row[v.key]">
                    <el-tooltip :key="idx" effect="dark" placement="top-start">
                      <div slot="content" v-html="item[v1.value_alias]"></div>
                      <p class="is-value">{{ item[v1.value] }}</p>
                    </el-tooltip>
                  </template>
                </template>
                <span class="more-info-display" v-else-if="scope.row[v1.value] || scope.row[v1.value_alias] || scope.row[v1]" >
                  <span class="is-value" v-if="typeof(v1)=='string'" v-html="scope.row[v1]"></span>
                  <span class="is-label" v-if="typeof(v1)=='object' && v1.label" :style="{width:v1.width?parseInt(v1.width)+'px':'72px'}" v-html="v1.label"></span>
                  <template v-if="v1.value_alias && v1.value">
                    <el-tooltip effect="dark" placement="top-start" popper-class="ape-table-tooltip" v-if="scope.row[v1.value]">
                      <div slot="content" v-html="scope.row[v1.value_alias]"></div>
                      <span class="is-value" v-if="typeof(v1)=='object'" v-html="scope.row[v1.value]"></span>
                    </el-tooltip>
                    <span class="is-value" v-else v-html="scope.row[v1.value_alias]"></span>
                  </template>
                  <template v-else>
                    <span class="is-value" v-if="typeof(v1)=='object'" v-html="scope.row[v1.value]"></span>
                  </template>
                </span>
              </span>
            </span>
          </template>
        </el-table-column>
        <slot/>
    </el-table>
    <el-pagination
      v-if="initPaging"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :layout="defaultLayout"
      :total="dataTotal"
      background>
    </el-pagination>
  </div>
</template>

<script>

export default {
  props: {
    // ------ 表格相关 ---------
    data: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      default: () => []
    },
    loading: {
      default: true
    },
    // ------ 分页相关 ---------
    pagingData: {
      type: Object,
      default: () => {
        return {
          offset:0
        }
      },
      // required: true
    },
    // 其它参数
    otherParam: {
      type: Object,
      default: function() {
        return {
          expanded_all: false, // 默认只展开一个
        }
      }
    }
  },
  data() {
    return {
      // ------ 表格相关 ---------
      currentRowId: null,
      // ---- 分页相关配置 -------
      apePageSize: 0, // 用于组件切换了每一页数据后的显示
      currentPage: 1,
      // dataTotal: this.pagingData.total,
      // defaultLayout: 'total, sizes, prev, pager, next, jumper',
    }
  },
  computed: {
    // 表格数据
    tableData() {
      return this.data
    },
    // ---- 分页相关配置 -------
    // 每页条数，切换
    pageSizes() {
      if (!(typeof(this.pagingData.page_size) == 'undefined') && this.pagingData.page_size < 10) {
        return [this.pagingData.page_size]
      }
      return [10, 20, 50, 100]
    },
    // 每一页大小，默认
    pageSize() {
      if (this.pagingData && !(typeof(this.pagingData.page_size) == 'undefined')) { 
        return this.pagingData.page_size
      }
      return 10
    },
    // 初始化分页
    initPaging() {
      if (!(typeof(this.pagingData) == 'undefined')) {
        if (this.pagingData.is_show && this.pagingData.total > this.pageSize) {
          return true
        }
      }
      return false
    },
    // 数组总数
    dataTotal() {
      return this.pagingData.total
    },
    // 数据偏移量，分页序号使用
    dataOffset() {
      return typeof(this.pagingData.offset) == 'undefined'?0:this.pagingData.offset
    },
    // 默认分页结构
    defaultLayout() {
      if (!(typeof(this.pagingData) == 'undefined')) {
        if (this.pagingData.layout) {
          return this.pagingData.layout
        }
      }
      return 'total, sizes, prev, pager, next, jumper'
    }
  },
  methods: {
    // ------ 表格相关 ---------
    /**
     * @name: luo1o1o1o
     * @desc: 选中项发生变化
     */
    handleSelectionChange(list) {
      this.$emit('selectList', list)
    },
    /**
     * @description 通过数据id，转换对应的行index，并且选中
     * @author YM
     * @date 2019-01-10
     * @returns string
     */
    defaultSelectedRow(rowId) {
      if (rowId) {
        let list = this.tableData
        for (let i = 0,len=list.length; i < len; i++) {
          if (list[i].id == rowId) {
            this.$refs['elTable'].setCurrentRow(list[i])
          }
        }
      } else {
         this.$refs['elTable'].setCurrentRow()
      }
    },
    /**
     * @description 监听行的点击事件,
     * @author YM
     * @date 2019-01-10
     * @returns string
     */
    rowClick(row) {
      this.currentRowId = row.id
      this.$emit('rowClick',row)
    },
    // ------ 分页相关 ---------
    // 获取当前分页相关信息,type类型主要处理删除删除后的情况处理
    // 解决当前页数据全部删除完空白作用
    getPagingInfo(type = 'no_del') {
      if (type == 'del' && (this.pagingData.total-1) <= (this.currentPage-1)*this.pageSize) {
        this.currentPage = this.currentPage-1>0?this.currentPage-1:1
      }
      let pagingInfo = {
        page_size: this.apePageSize?this.apePageSize:this.pageSize,
        current_page: this.currentPage
      }
      return pagingInfo
    },
    // pageSize 改变时处理
    handleSizeChange(val) {
      // this.pageSize = val
      this.apePageSize=val
      this.currentPage = 1
      this.$emit('switchPaging')
    },
    // currentPage 改变时处理
    handleCurrentChange(val) {
      this.currentPage = val
      this.$emit('switchPaging')
    },
    // 处理满足条件行的class类名，作用处理样式
    tableRowClassName({row}) {
      if (row.row_color == 'gray') {
        return 'gray-row'
      }
      if (row.row_color == 'red') {
        return 'red-row'
      }
      return ''
    },
    // 折叠展开change事件,当前操作行，所有展开的
    expandChange(expandedRows,expanded) {
      if (expanded.length > 1 && !this.otherParam.expanded_all) {
        for (let v of expanded) {
          this.$refs['elTable'].toggleRowExpansion(v,false)
        }
        this.$refs['elTable'].toggleRowExpansion(expandedRows,true)
      }
      this.$refs['elTable'].setCurrentRow(expandedRows)
    }
  },
  updated() {
    this.$nextTick(function () {
      if (this.currentRowId) {
        this.defaultSelectedRow(this.currentRowId)
      }
    }) 
  },
}
</script>

<style lang="stylus" scope>
  table td
    line-height: 26px
  .el-table__body tr.current-row > td
    background-color: #91d5ff !important
  .el-button + .el-button
    margin-left 0px
    margin-right 4px
  .iconfont
    font-size 12px
  .el-pagination
    text-align right
    margin-top 24px
  .el-pager li
    font-size 14px
  .el-pagination.is-background .btn-prev, .el-pagination.is-background .btn-next, .el-pagination.is-background .el-pager li 
    border: solid 1px #f5f5f5
    background-color #ffffff
  .more-info-display
    line-height 28px
    display block
    .is-label
      display inline-block
      text-align right 
    .is-value
      display inline-block
  .el-table .gray-row
    background-color #f5f5f5
  .el-table .red-row
    background-color #ffcc00
  .ape-table-tooltip
    max-width 640px
</style>
