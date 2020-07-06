<template>
  <div>
    <PageHeaderLayout>
      <div class="main-page-content"
        v-loading="loadingStaus"
        :element-loading-text="loadingText">
        <el-row :gutter="48">
          <el-form ref="articleForm" :model="formData" :rules="rules" label-width="80px">
            <el-col :span="18" class="content-left">
              <el-form-item label="分类" prop="selectedList" ref="categoryItem">
                <el-cascader
                  placeholder="选择分类"
                  :props="cascaderProps"
                  :options="categoryList"
                  v-model="selectedList"
                  @change="cascaderChange"
                  show-all-levels
                  clearable
                  filterable>
                </el-cascader>
              </el-form-item>
              <el-form-item label="标签" prop="selectedLabelList" ref="categoryLabelItem">
                <el-cascader
                  placeholder="选择分类"
                  :props="cascaderProps"
                  :options="categoryLabelList"
                  v-model="selectedLabelList"
                  @change="cascaderLabelChange"
                  show-all-levels
                  clearable
                  filterable>
                </el-cascader>
              </el-form-item>
              <el-form-item label="标题" prop="title">
                <el-input v-model="formData.title"></el-input>
              </el-form-item>
              <el-form-item label="文章来源" prop="source">
                <el-input v-model="formData.source"></el-input>
              </el-form-item>
              <el-form-item label="摘要" prop="excerpt">
                <el-input type="textarea" v-model="formData.excerpt"></el-input>
              </el-form-item>
              <el-form-item label="附加内容" prop="additional">
                <el-input type="textarea" v-model="formData.additional"></el-input>
              </el-form-item>
              <el-form-item label="内容" prop="content">
                <ApeEditor :init-html="formData.content" :editorHeight="480" @handleTinymceInput="handleTinymceInput"></ApeEditor>
              </el-form-item>
            </el-col>
            <el-col class="content-right" :span="6">
              <el-form-item label="封面" prop="cover">
                <ApeUploader :limit="1" @handleUploadSuccess="handleUploadSuccess" @handleUploadRemove="handleUploadRemove" :upload-file-list="uploadFileList"></ApeUploader>
              </el-form-item>
              <el-form-item label="附件" prop="attachment">
                <ApeUploader :limit="1" :isImage="false" :allowSize="1024*1024*500" :allowTypeList="attachmentType" @handleUploadSuccess="handleAttachmentUploadSuccess" @handleUploadRemove="handleAttachmentUploadRemove" :upload-file-list="attachmentUploadFileList"></ApeUploader>
              </el-form-item>
              <el-form-item label="发布时间" prop="published_time">
                <el-date-picker
                  v-model="formData.published_time"
                  type="datetime"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="状态" prop="article_status">
                <el-checkbox-group v-model="formData.article_status">
                  <el-checkbox label="is_published">发布</el-checkbox>
                  <el-checkbox label="is_top">置顶</el-checkbox>
                  <el-checkbox label="is_recommend">推荐</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <div class="right-button" >
                <el-button size="medium" type="primary" :disabled="loadingStaus" @click="saveConfirm">保存</el-button>
                <el-button size="medium" @click="returnList">返回</el-button>
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
import ApeEditor from '@/components/ApeEditor'
import { mapGetters } from 'vuex'

export default {
  components: {
    PageHeaderLayout,
    ApeUploader,
    ApeEditor,
  },
  data() {
    return {
      activeTab: '0',
      hearTitle: '基本设置',
      loadingStaus: true,
      loadingText: '玩命提交中……',
      articleId:0, // 文章id，0表示创建，非零为编辑
      // element的cascader的props值
      cascaderProps:{
        label:'display_name',
        value:'id',
      },
      // 分类列表
      categoryList:[],
      // 标签
      categoryLabelList:[],
      // 已选中的分类列表，用于cascader组件选中效果
      selectedList:[],
      // 已选中标签
      selectedLabelList:[],
      // 文章基本信息表单结构
      formData:{article_status:[]},
      // 已上传图片列表
      uploadFileList:[],
      // 文章基本信息规则
      rules: {
        title: [
          {required: true, message: '输入文章名称', trigger: 'blur' },
        ],
        selectedList: [{required: true, message: '选择分类', trigger: 'change', validator:this.cascaderVerify}],
      },
      // 附件类型
      attachmentType:['application/pdf','application/caj','','application/zip','application/rar','application/doc'],
      // 已上传附件列表
      attachmentUploadFileList:[]
    }
  },
  computed: {
    ...mapGetters(['userPermissions']),
  },
  methods: {
    // 返回列表
    returnList() {
      this.$router.push('/article')
    },
    // 级联菜单组件change事件
    cascaderChange(v) {
      if (v.length) {
        this.formData.category_id = v[(v.length-1)]
        this.formData.category_ids = v
      }
    },
    // 级联菜单组件change事件
    cascaderLabelChange(v) {
      if (v.length) {
        this.formData.category_2_id = v[(v.length-1)]
        this.formData.category_2_ids = v
      } else {
         this.formData.category_2_id = ''
         this.formData.category_2_ids = []
      }
    },
    // 级联菜单自定义验证，选择分类
    cascaderVerify(rule, value, callback) {
      if (rule.required && !this.selectedList.length) {
        callback(new Error(rule.message))
      }
      callback()
    },
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
    // 文章相关信息的保存处理
    async formSubmit() {
      this.loadingStaus = true
      let id = await this.$api.saveArticle(this.formData)
      if (id) {
        this.$notify.success('保存成功！')
      }
      if (this.articleId === 0 && id) {
        // this.$router.push(this.$route.matched[1].path+'/'+id+'/edit')
        this.$router.push(this.$route.matched[1].path)
        // this.initArticleForm()
      }
      this.$nextTick(() => {
        this.loadingStaus = false
      }) 
    },
    // 图片上传成功回调
    handleUploadSuccess(file, fileList) {
      this.formData.cover = file.id
      this.uploadFileList = fileList
    },
    // 图片删除回调
    handleUploadRemove(file, fileList) {
      this.formData.cover = 0
      this.uploadFileList = fileList
    },
    // 附件上传成功回调
    handleAttachmentUploadSuccess(file, fileList) {
      this.formData.attachment = file.id
      this.attachmentUploadFileList = fileList
    },
    // 附件删除回调
    handleAttachmentUploadRemove(file, fileList) {
      this.formData.attachment = 0
      this.attachmentUploadFileList = fileList
    },
    // 图片上传自定义验证
    apeUploaderVerify(rule, value, callback) {
      if (rule.required && !this.formData.cover) {
        callback(new Error(rule.message))
      }
      callback()
    },
    // 处理编辑器内容输入
    handleTinymceInput(val) {
      this.formData.content = val
    },
    // 初始化文章基本信息
    async initArticleForm() {
      // 获取文章分类列表
      let {list} = await this.$api.getArticleCategoryList()
      this.categoryList = list
      // 获取文章分类标签列表
      let {label_list} = await this.$api.getArticleCategoryLabelList()
      this.categoryLabelList = label_list
      if (this.$route.params.article_id) {
        this.articleId = this.$route.params.article_id
      }
      if (this.articleId) {
        let {info} = await this.$api.getArticleInfo(this.articleId)
        this.formData = info
        this.selectedList = info.category_ids
        this.selectedLabelList = info.category_2_ids
        if (info.cover) {
          this.uploadFileList = [{id:info.cover_info.id,name:info.cover_info.title,url:info.cover_info.full_path}]
        }
        if (info.attachment) {
          this.attachmentUploadFileList = [{id:info.attachment_info.id,name:info.attachment_info.title,url:info.attachment_info.full_path}]
        }
      }
    },
  },
  async mounted() {
    this.loadingStaus = true
    this.initArticleForm()
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
