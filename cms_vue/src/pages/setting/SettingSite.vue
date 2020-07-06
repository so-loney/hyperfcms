<template>
  <div>
    <PageHeaderLayout>
      <div class="main-page-content"
        v-loading="loadingStaus"
        :element-loading-text="loadingText">
        <el-row :gutter="48">
          <el-form ref="articleForm" :model="formData" :rules="rules" label-width="96px">
            <el-col :span="18" class="content-left">
              <el-form-item label="网站名称" prop="web_name">
                <el-input v-model="formData.web_name"></el-input>
              </el-form-item>
              <el-form-item label="版权" prop="copyright">
                <el-input v-model="formData.copyright"></el-input>
              </el-form-item>
              <el-form-item label="统计代码" prop="analytics">
                <el-input :rows="6" type="textarea" v-model="formData.analytics"></el-input>
              </el-form-item>
              <el-form-item label="SEO标题" prop="seo_title">
                <el-input v-model="formData.seo_title"></el-input>
              </el-form-item>
              <el-form-item label="SEO关键词" prop="seo_keywords">
                <el-input v-model="formData.seo_keywords"></el-input>
              </el-form-item>
              <el-form-item label="SEO描述" prop="seo_description">
                <el-input :rows="6" type="textarea" v-model="formData.seo_description"></el-input>
              </el-form-item>
            </el-col>
            <el-col class="content-right" :span="6">
              <el-form-item label="站点LOGO" prop="web_logo">
                <ApeUploader :limit="1" @handleUploadSuccess="handleUploadSuccess" @handleUploadRemove="handleUploadRemove" :upload-file-list="uploadFileList"></ApeUploader>
              </el-form-item>
              <div class="right-button" >
                <el-button size="medium" type="primary" :disabled="loadingStaus" @click="saveConfirm" v-if="userPermissions.indexOf('setting_site') != -1">保存</el-button>
              </div>
            </el-col>
          </el-form>
        </el-row>
      </div>
    </PageHeaderLayout>
  </div >
</template>

<script>
import PageHeaderLayout from '@/layouts/PageHeaderLayout'
import ApeUploader from '@/components/ApeUploader'
import { mapGetters } from 'vuex'

export default {
  components: {
    PageHeaderLayout,
    ApeUploader,
  },
  data() {
    return {
      hearTitle: '基本设置',
      loadingStaus: true,
      loadingText: '玩命提交中……',
      // 站点基本信息表单结构
      formData:{},
      // 已上传文件列表
      uploadFileList:[],
      // 站点基本信息规则
      rules: {
        web_name: [
          {required: true, message: '输入站点名称', trigger: 'blur' },
        ],
      },
    }
  },
  computed: {
    ...mapGetters(['userPermissions']),
  },
  methods: {
    // 确认保存按钮
    async saveConfirm() {
      // 调用组件的数据验证方法
      this.$refs['articleForm'].validate((valid) => {
        if (valid) {
          this.formSubmit()
        } else {
          this.$message.error('数据验证失败，请检查必填项数据！')
        }
      })
      return true
    },
    // 站点相关信息的保存处理
    async formSubmit() {
      this.loadingStaus = true
      let id = await this.$api.saveSettingSiteInfo(this.formData)
      if (id) {
        this.$notify.success('保存成功！')
      }
      this.$nextTick(() => {
        this.loadingStaus = false
      }) 
    },
    // 图片上传成功回调
    handleUploadSuccess(file, fileList) {
      this.formData.web_logo = file.id
      this.uploadFileList = fileList
    },
    // 图片删除回调
    handleUploadRemove(file, fileList) {
      this.formData.web_logo = 0
      this.uploadFileList = fileList
    },
    // 初始化站点基本信息
    async initSettingSiteForm() {
      // 获取站点分类列表
      let {info} = await this.$api.getSettingSiteInfo()
      this.formData = info
      if (info.web_logo_info) {
        this.uploadFileList = [{id:info.web_logo_info.id,name:info.web_logo_info.title,url:info.web_logo_info.full_path}]
      } 
    },
  },
  async mounted() {
    this.loadingStaus = true
    this.initSettingSiteForm()
    this.$nextTick(() => {
      this.loadingStaus = false
    }) 
  },
}
</script>

<style lang="stylus">
  .content-left
    min-height 640px
    border-right 1px solid  #e8e8e8
    .el-cascader
      display block
      width 320px
  .content-right
    .right-button
      border-top 1px solid #e8e8e8e8
      padding 12px 12px
    .el-form-item__label
      float none
      display inline-block
      text-align left
      padding 0 0 10px 0
    .el-form-item__content
      margin-left 0px !important
      .el-checkbox-group
        margin-top -12px


</style>
