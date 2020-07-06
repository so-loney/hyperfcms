<template>
  <div class="ape-drawer" :class="classObject">
    <div class="ape-drawer-mask" @click="maskClick"></div>
    <div class="ape-drawer-content-wrapper" :style="styleObject">
      <div class="ape-drawer-content">
        <div class="ape-drawer-content-header">
          <span>{{ typeof(drawerData.title)==='undefined'?'Ape Drawer':drawerData.title}}</span>
          <button class="ape-drawer-content-header-btn" @click="drawerClose"><i class="el-icon el-icon-close"></i></button>
        </div>
        <div class="ape-drawer-content-body"
        v-loading="drawerData.loading"
        :element-loading-text="drawerData.loading_text?drawerData.loading_text:'玩命加载中……'"
        element-loading-spinner="el-icon-loading">
          <slot name="ape-drawer">
            <span>这是一段信息</span>
          </slot>
        </div>
        <div class="ape-drawer-content-footer" v-if="isShowFooter">
          <el-button size="medium" :type="closeType" @click="drawerClose">{{drawerData.close_name?drawerData.close_name:'取 消'}}</el-button>
          <el-button size="medium" :type="confirmType" :disabled="drawerData.loading" @click="drawerConfirm">{{drawerData.confirm_name?drawerData.confirm_name:'确 定'}}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script scoped>
export default {
  props: {
    // 抽屉数据
    drawerData: {
      type: Object,
      default: function() {
        return {
          // visible: false,
          // direction: 'right',
          // title: 'Ape Drawer',
          // width_height: '240px',
          // loading: true,
          // loading_text: '玩命加载中……',
          // show_footer:false,
          // mask: true,
          // close_type:'',
          // confirm_type:'primary',
          // close_name: '取 消',
          // confirm_name: '确 定'
        }
      }
    }
  },
  data() {
    return {
      widthHeight: typeof(this.drawerData.width_height)==='undefined'?'240px':this.drawerData.width_height
    };
  },
  computed: {
    // 是否显示底部
    isShowFooter() {
      if (this.drawerData.show_footer===false) {
        return false
      } else {
        return true
      }
    },
    // 设置抽屉组件样式class
    classObject() {
      if (this.drawerData.visible) {
        document.body.classList.add('el-popup-parent--hidden')
      }
      return {
        'ape-drawer-top' : this.drawerData.direction==='top',
        'ape-drawer-bottom' : this.drawerData.direction==='bottom',
        'ape-drawer-left' : this.drawerData.direction==='left',
        'ape-drawer-right' : (this.drawerData.direction==='right' || typeof(this.drawerData.direction)==='undefined'),
        'ape-drawer-open' : this.drawerData.visible
      }
    },
    // 设置抽屉内容样式style
    styleObject() {
      return {
        width: this.drawerData.direction==='left' || this.drawerData.direction==='right' || typeof(this.drawerData.direction)==='undefined'?this.widthHeight:'',
        height:  this.drawerData.direction==='top' || this.drawerData.direction==='bottom'?this.widthHeight:'',
        transform: this.drawerData.visible?'':this.transformDirection
      }
    },
    // transform方向效果，上下左右
    transformDirection() {
      if (this.drawerData.direction==='top') {
        return 'translateY(-100%)'
      }
      if (this.drawerData.direction==='bottom') {
        return 'translateY(100%)'
      }
      if (this.drawerData.direction==='left') {
        return 'translateX(-100%)'
      }
      return 'translateX(100%)'
    },
    // 确认按钮样式
    confirmType() {
      if (this.drawerData.confirm_type) {
        return this.drawerData.confirm_type
      }
      return 'primary'
    },
    // 取消按钮样式
    closeType() {
      if (this.drawerData.close_type == 'text') {
        return 'text'
      }
      return ''
    }
  },
  methods: {
    // mask遮罩层的点击事件
    maskClick() {
      if (this.drawerData.mask || typeof(this.drawerData.mask)==='undefined') {
        this.drawerClose()
      }
    },
    // 关闭抽屉
    drawerClose() {
      document.body.classList.remove('el-popup-parent--hidden')
      this.$emit('drawerClose')
    },
    // 确认抽屉
    drawerConfirm() {
      document.body.classList.remove('el-popup-parent--hidden')
      this.$emit('drawerConfirm')
    }

  },
  mounted() {

  },
};
</script>
<style lang="stylus">
  .ape-drawer
    position fixed
    top 0
    left 0
    z-index 1000
  .ape-drawer>*
    transition transform .3s
  .ape-drawer-left, .ape-drawer-right
    width 0%
    height 100%
  .ape-drawer-top, .ape-drawer-bottom
    width 100%
    height 0%
  .ape-drawer-mask
    position fixed
    width 100%
    height 0
    opacity 0
    background-color rgba(0,0,0,0.65)
    transition opacity .3s linear,height 0s ease .3s
  .ape-drawer-left.ape-drawer-open, .ape-drawer-right.ape-drawer-open
    width: 100%
  .ape-drawer-top.ape-drawer-open, .ape-drawer-bottom.ape-drawer-open
    height: 100%;
  .ape-drawer.ape-drawer-open>.ape-drawer-mask
    opacity 0.6
    height 100%
    transition opacity ease-in-out 0.38s, visibility ease-in-out 0.38s
  .ape-drawer-content-wrapper
    position fixed
  .ape-drawer-right .ape-drawer-content-wrapper
    right 0
  .ape-drawer-bottom .ape-drawer-content-wrapper
    bottom 0
  .ape-drawer-left .ape-drawer-content-wrapper, .ape-drawer-right .ape-drawer-content-wrapper
    height 100%
  .ape-drawer-top .ape-drawer-content-wrapper, .ape-drawer-bottom .ape-drawer-content-wrapper
    width  100%
  .ape-drawer-right.ape-drawer-open .ape-drawer-content-wrapper
    box-shadow -2px 0 8px rgba(0,21,41,.35)
  .ape-drawer-left.ape-drawer-open .ape-drawer-content-wrapper
    box-shadow 2px 0 8px rgba(0,21,41,.35)
  .ape-drawer-top.ape-drawer-open .ape-drawer-content-wrapper
    box-shadow 0 2px 8px rgba(0,21,41,.35)
  .ape-drawer-bottom.ape-drawer-open .ape-drawer-content-wrapper
    box-shadow 0 -2px 8px rgba(0,21,41,.35)
  .ape-drawer-content
    width 100%
    height 100%
    position relative
    background-color #ffffff
    border 0
    background-clip padding-box
    z-index 1
  .ape-drawer-content-header
    padding 16px 24px
    border-radius 4px 4px 0 0
    background #ffffff
    color rgba(0,0,0,0.85)
    border-bottom 1px solid #e8e8e8
    position relative
    font-size 16px
    font-weight 500
  .ape-drawer-content-header-btn
    position absolute
    top 20px
    right 20px
    padding 0
    background transparent
    border none
    outline none
    cursor pointer
    font-size 16px
  .ape-drawer-content-footer
    line-height 72px
    text-align right 
    position absolute
    background #fff
    bottom 0
    width 100%
    padding-right 4px
    border-top 1px solid #e8e8e8
    box-sizing border-box
    .el-button
      margin-right 12px
    .el-button:nth-child(2)
      margin-right 24px
  .ape-drawer-content-body
    padding 24px
    font-size 14px
    line-height 1.5
    word-wrap break-word
    min-height 120px
    max-height 800px
    overflow auto 
</style>
