<template>
  <el-dialog
    :visible.sync="dialogData.visible"
    :title="dialogData.title"
    :width="dialogData.width"
    :before-close="dialogClose"
    :close-on-click-modal="dialogData.modal">
    <div class="dialog-content"
      v-loading="dialogData.loading"
      :element-loading-text="dialogData.loading_text?dialogData.loading_text:'玩命加载中……'"
      element-loading-spinner="el-icon-loading">
      <slot name="content">
        <span>这是一段信息</span>
      </slot>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="medium" @click="dialogClose">取 消</el-button>
      <el-button size="medium" type="primary" :disabled="dialogData.loading" @click="dialogConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    dialogData: {
      type: Object,
      default: function() {
        return {
          // visible: false,
          // title: 'dialog',
          // width: '30%',
          // loading: true,
          // modal: true
        }
      }
    }
  },
  data() {
    return {
      
    }
  },
  methods: {
    // 模态框确定触发，父组件需要实现此方法，例如： @dialogConfirm="handleConfirm"
    dialogConfirm() {
      this.$emit('dialogConfirm')
    },
    // 模态框关闭触发，父组件需要实现此方法，例如：@dialogClose="dialogClose" 
    dialogClose() {
      this.$emit('dialogClose')
    }
  },
}
</script>

<style lang="stylus">
  .el-dialog__header
    padding 0
    line-height 48px
    padding-left 24px
    border-bottom 1px solid #d9d9d9
  .el-dialog__title
    font-size 14px
  .el-dialog__headerbtn
    top 15px
  .el-dialog__footer
    border-top 1px solid #d9d9d9
    padding 0
    padding-right 8px
    line-height 48px
  .el-dialog__body
    padding 24px 24px
    word-wrap break-word
  .el-button
    margin-right 4px
  .el-form-item__label
    height 36px
  .el-cascader
    display block
</style>