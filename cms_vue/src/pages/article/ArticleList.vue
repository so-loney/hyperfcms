<template>
  <div>
    <router-view v-show="$route.matched.length==3"></router-view>
    <PageHeaderLayout v-show="$route.matched.length==2">
      <div class="main-page-content">
        <el-row class="table-header">
          <el-col>
            <el-tooltip effect="dark" content="添加文章" placement="top-start"  v-if="userPermissions.indexOf('article_create') != -1 && buttonType=='icon'" >
              <el-button type="primary" size="medium" icon="iconfont icon-tianjiacaidan2" @click="addButton(0)"></el-button>
            </el-tooltip>
            <el-button type="primary" size="medium" icon="iconfont"  v-if="userPermissions.indexOf('article_create') != -1 && buttonType=='text'"  @click="addButton(0)">添加文章</el-button>
          </el-col>
        </el-row>
        <el-row class="table-search">
          <el-form size="medium" :inline="true" :model="searchCondition" class="demo-form-inline">
            <el-form-item label="分类">
              <el-cascader
                placeholder="选择分类"
                :props="cascaderProps"
                :options="searchCategory"
                v-model="searchCondition.selected_category"
                show-all-levels
                clearable
                filterabl
              ></el-cascader>
            </el-form-item>
            <el-form-item label="标题">
              <el-input v-model="searchCondition.title" placeholder="输入标题" clearable></el-input>
            </el-form-item>
            <el-form-item label="发布时间">
              <el-date-picker
                v-model="searchCondition.time_value"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchButton">查询</el-button>
            </el-form-item>
          </el-form>
        </el-row>
        <ApeTable ref="apeTable" :data="articleList" :columns="columns" :loading="loadingStaus" :pagingData="pagingData" @switchPaging="switchPaging" highlight-current-row border>
          <el-table-column
            slot="second-column"
            width="64"
            label="序号">
            <template slot-scope="scope">
              <span>{{offset+scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="buttonType=='icon'"
            width="160"
            label="操作">
            <template slot-scope="scope">
              <span>
                <el-tooltip effect="dark" content="附件集" placement="top-start"  v-if="userPermissions.indexOf('article_attachment') != -1" >
                  <el-button size="mini" icon="iconfont icon-fujian2" @click="articleAttachment(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="编辑" placement="top-start"  v-if="userPermissions.indexOf('article_edit') != -1" >
                  <el-button size="mini" icon="el-icon-edit" @click="editButton(scope.row.id)"></el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="删除" placement="top-start">
                  <span>
                    <el-popover
                      v-if="userPermissions.indexOf('article_delete') != -1" 
                      placement="top"
                      width="150"
                      v-model="scope.row.visible">
                      <p>确定要删除记录吗？</p>
                      <div style="text-align: right; margin: 0;">
                        <el-button type="text" size="mini" @click="scope.row.visible=false">取消</el-button>
                        <el-button type="danger" size="mini" @click="deleteButton(scope.row.id)">确定</el-button>
                      </div>
                      <el-button slot="reference" type="danger" size="mini" icon="el-icon-delete"></el-button>
                    </el-popover>
                  </span>
                </el-tooltip>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="buttonType=='text'"
            width="160"
            label="操作">
            <template slot-scope="scope">
              <span>
                <el-button size="mini" v-if="userPermissions.indexOf('article_attachment') != -1"  @click="articleAttachment(scope.row)">附件集</el-button>
                <el-button size="mini" v-if="userPermissions.indexOf('article_edit') != -1"  @click="editButton(scope.row.id)">编辑</el-button>
                <el-popover
                  v-if="userPermissions.indexOf('article_delete') != -1" 
                  placement="top"
                  width="150"
                  v-model="scope.row.visible">
                  <p>确定要删除记录吗？</p>
                  <div style="text-align: right; margin: 0;">
                    <el-button type="text" size="mini" @click="scope.row.visible=false">取消</el-button>
                    <el-button type="danger" size="mini" @click="deleteButton(scope.row.id)">确定</el-button>
                  </div>
                  <el-button slot="reference" type="danger" size="mini">删除</el-button>
                </el-popover>
              </span>
            </template>
          </el-table-column>
        </ApeTable>
      </div>
    </PageHeaderLayout>
    <ApeDrawer :drawerData="drawerData"  @drawerClose="drawerClose" >
      <template slot="ape-drawer">
        <el-row class="table-header">
          <el-col>
            <el-tooltip effect="dark" content="添加附件" placement="top-start"  v-if="userPermissions.indexOf('article_attachment') != -1 && buttonType=='icon'" >
              <el-button type="primary" size="medium" icon="iconfont icon-tianjiacaidan2" @click="addAttachment()"></el-button>
            </el-tooltip>
            <el-button type="primary" size="medium" icon="iconfont"  v-if="userPermissions.indexOf('article_attachment') != -1 && buttonType=='text'"  @click="addAttachment()">添加附件</el-button>
          </el-col>
        </el-row>
        <ApeTable :data="attachmentList" :columns="attachmentColumns" :loading="loadingStaus" highlight-current-row border>
          <el-table-column
            slot="second-column"
            width="60"
            label="序号">
            <template slot-scope="scope">
              <span>{{offset+scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="buttonType=='icon'"
            label="操作"
            width="80">
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="删除" placement="top-start">
                <span>
                  <el-popover
                    v-if="userPermissions.indexOf('article_attachment') != -1" 
                    placement="top"
                    width="150"
                    v-model="scope.row.visible">
                    <p>确定要删除记录吗？</p>
                    <div style="text-align: right; margin: 0;">
                      <el-button type="text" size="mini" @click="scope.row.visible=false">取消</el-button>
                      <el-button type="danger" size="mini" @click="deleteArticleAttachmentButton(scope.row.id)">确定</el-button>
                    </div>
                    <el-button slot="reference" type="danger" size="mini" icon="el-icon-delete"></el-button>
                  </el-popover>
                </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            v-if="buttonType=='text'"
            label="操作"
            width="80">
            <template slot-scope="scope">
              <el-popover
                v-if="userPermissions.indexOf('article_attachment') != -1" 
                placement="top"
                width="150"
                v-model="scope.row.visible">
                <p>确定要删除记录吗？</p>
                <div style="text-align: right; margin: 0;">
                  <el-button type="text" size="mini" @click="scope.row.visible=false">取消</el-button>
                  <el-button type="danger" size="mini" @click="deleteArticleAttachmentButton(scope.row.id)">确定</el-button>
                </div>
                <el-button slot="reference" type="danger" size="mini" v-if="buttonType=='text'">删除</el-button>
              </el-popover>
            </template>
          </el-table-column>
        </ApeTable>
      </template>
    </ApeDrawer>
    <ModalDialog :dialogData="dialogData" @dialogConfirm="handleConfirm" @dialogClose="dialogClose">
      <template slot="content">
        <el-form :model="formData" :rules="dialogRules" ref="articleAttacmentForm" label-position="right" label-width="96px">
          <el-form-item label="名称" prop="title">
            <el-input v-model="formData.title"></el-input>
          </el-form-item>
          <el-form-item label="附件" prop="attachment">
            <ApeUploader :limit="1" :isImage="false" :allowSize="1024*1024*500" :allowTypeList="attachmentType" @handleUploadSuccess="handleAttachmentUploadSuccess" @handleUploadRemove="handleAttachmentUploadRemove" :upload-file-list="attachmentUploadFileList"></ApeUploader>
          </el-form-item>
          <el-form-item label="备注" prop="intro">
            <el-input type="textarea" v-model="formData.intro"></el-input>
          </el-form-item>
        </el-form>        
      </template>
    </ModalDialog>
  </div >
</template>

<script>
import PageHeaderLayout from '@/layouts/PageHeaderLayout'
import ApeTable from '@/components/ApeTable'
import ApeDrawer from '@/components/ApeDrawer'
import ApeUploader from '@/components/ApeUploader'
import ModalDialog from '@/components/ModalDialog'
import { mapGetters } from 'vuex'

export default {
  components: {
    PageHeaderLayout,
    ApeDrawer,
    ApeTable,
    ApeUploader,
    ModalDialog
  },
  data() {
    return {
      // element的cascader的props值
      cascaderProps:{
        label:'display_name',
        value:'id',
      },
      searchCategory: [],
      // 搜索条件
      searchCondition:{
        selected_category:[]
      },
      loadingStaus: true,
      columns: [
        {
          title: '封面',
          type: 'image',
          value: 'cover_pc_url',
          width: 65
        },
        {
          title: '标题',
          value: [
            {label:'ID号：',value:'id'},
            {label:'标题：',value:'title_alias',value_alias:'title'},
          ]
        },
        {
          title: '信息',
          value: [
            {label:'分类：',value:'category_alias'},
            {label:'作者：',value:'author_name'},
            {label:'发布时间：',value:'published_time'},
          ],
          width: 240
        },
        {
          title: '状态',
          value: [
            {label:'发布：',value:'published_alias'},
            {label:'置顶：',value:'top_alias'},
            {label:'推荐：',value:'recommend_alias'},
          ],
          width:160
        }
      
        
      ],
      // 表格列表数据
      articleList:[],
      // 分页信息
      pagingData:{
        is_show: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0
      },
      // 分页的offset,序号列使用
      offset:0,
      // 已上传文件列表
      uploadFileList:[],
      // 表单验证
      rules: {
        title: [
          {required: true, message: '输入标题', trigger: 'blur' },
        ],
        type: [
          {required: true, message: '选择类型', trigger: 'blur' },
        ],
        is_new_win: [
          {required: true, message: '选择打开发方式', trigger: 'blur' },
        ],
        is_show: [
          {required: true, message: '选择状态', trigger: 'blur' },
        ],
        image: [
          {required: true, message: '上传图片', trigger: 'blur', validator:this.apeUploaderVerify},
        ],
      },
      // 抽屉数据，附件列表
      drawerData: {
        visible: false,
        loading: true,
        loading_text: '玩命加载中……',
        // direction: 'right',
        title: '',
        width_height: '640px',
        show_footer:false,
        // mask: false,
        // close_name: '关 闭',
        // confirm_name: '打 印',
      },
      // 附件列表
      attachmentList:[],
      // 附件列表字段定义
      attachmentColumns: [
        {
          title: '标题',
          value: 'title',
        }
      ],
      // 添加附件
      dialogData:{
        visible: false,
        title: '',
        width: '24%',
        loading: true,
        modal: false
      },
      // 附件表单内容
      formData:{},
      // 附件添加表单验证
      dialogRules: {
        title: [{required: true, message: '输入标题', trigger: 'blur' }],
      },
      // 附件类型
      attachmentType:['application/pdf','application/caj','','application/zip','application/rar','application/doc'],
      // 已上传附件列表
      attachmentUploadFileList:[],
      // 当前需要操作附件的文章id
      currentArticleId:0,
    }
  },
  computed: {
    ...mapGetters(['userPermissions','buttonType'])
  },
  watch: {
    "$route.matched" : function(n,o) {
      console.log(o)
      if (n.length === 2) {
        this.initArticleList()
      }
    }
  },
  methods: {
    // 搜索
    searchButton() {
      this.initArticleList()
    },
    // 切换页码操作
    async switchPaging() {
      this.initArticleList()
    },
    // 响应添加按钮
    async addButton() {
      this.$router.push(this.$route.path+'/create')
    },
    // 响应编辑按钮
    async editButton(id) {
      this.$router.push(this.$route.path+'/'+id+'/edit')
    },
    // 相应删除按钮
    async deleteButton(id) {
      let info = await this.$api.deleteArticle(id)
      if (info == 'ok') {
        this.$nextTick(() => {
          this.initArticleList('del')
        })
      } else {
        this.$message.error(info)
      }
      
    },
    // 文章添加附件
    articleAttachment(row) {
      this.currentArticleId = row.id
      this.drawerData.loading_text = '玩命加载中……'
      this.drawerData.visible = true
      this.drawerData.title = '附件列表（'+row.title+'）'
      this.initArticleAttachmentList()
      this.$nextTick(() => {
        this.drawerData.loading = false
      })
    },
    // 处理抽屉关闭
    drawerClose() {
      this.drawerData.visible = false
      this.drawerData.loading = true
    },
    // 初始化文章列表
    async initArticleList(type) {
      this.loadingStaus=true
      let pagingInfo = this.$refs['apeTable'].getPagingInfo(type)
      let searchCondition = this.handleSearchCondition()
      Object.assign(searchCondition,pagingInfo)
      let {list,pages}= await this.$api.getArticleList(searchCondition)
      this.articleList = []
      this.$nextTick(() => {
        this.articleList=list
      })
      this.pagingData.total = pages.total
      this.offset = pages.offset
      this.loadingStaus=false
    },
    // 处理搜索条件
    handleSearchCondition() {
      let condition = {}
      if (this.searchCondition.selected_category.length) {
        condition.category_id = this.searchCondition.selected_category[this.searchCondition.selected_category.length-1]
      }
      if (this.searchCondition.title) {
        condition.title = this.searchCondition.title
      }
      if (this.searchCondition.time_value) {
        condition.start_time = this.searchCondition.time_value[0]
        condition.end_time = this.searchCondition.time_value[1]
      }

      return condition
    },
    // 获取文章分类列表
    async getCategoryList() {
      // 获取文章分类列表
      let {list} = await this.$api.getArticleCategoryList()
      this.searchCategory = list
    },
    // 初始化文件附件列表
    async initArticleAttachmentList() {
      let list = await this.$api.getArticleAttachment(this.currentArticleId)
      this.attachmentList = list
    },
    // 附件上传成功回调
    handleAttachmentUploadSuccess(file, fileList) {
      this.formData.attachment_id = file.id
      this.attachmentUploadFileList = fileList
    },
    // 附件删除回调
    handleAttachmentUploadRemove(file, fileList) {
      this.formData.attachment_id = 0
      this.attachmentUploadFileList = fileList
    },
    // form数据提交，请求接口,文章附件
    async formSubmit() {
      this.dialogData.loading_text = '玩命提交中……'
      this.dialogData.loading = true
      this.formData.article_id = this.currentArticleId
      let id = await this.$api.saveArticleAttachment(this.formData)
      this.$nextTick(() => {
        this.dialogClose()
      })
      this.$nextTick(() => {
        if (id) {
          this.initArticleAttachmentList()
        }
      })
      this.$nextTick(() => {
        this.$message.success('保存成功!')
      })
    },
    // 处理模态框，确定事件
    handleConfirm() {
      // 调用组件的数据验证方法
      this.$refs['articleAttacmentForm'].validate((valid) => {
        if (valid) {
          this.formSubmit()
        } else {
          this.$message.error('数据验证失败，请检查必填项数据！')
        }
      })
    },
    // 处理模态框，关闭事件
    dialogClose() {
      this.dialogData.visible = false
      this.dialogData.loading = true
      this.formData = {}
      this.attachmentUploadFileList = []
    },
    // 响应添加附件按钮
    async addAttachment() {
      this.dialogData.visible = true
      this.dialogData.loading = false
      this.dialogData.title = '添加附件'
    },
    // 相应删除文章附件按钮
    async deleteArticleAttachmentButton(id) {
      let info = await this.$api.deleteArticleAttachment(id)
      if (info == 'ok') {
        this.$nextTick(() => {
          this.initArticleAttachmentList()
        })
      } else {
        this.$message.error(info)
      }
      
    },
  },

  mounted() {
    this.getCategoryList()
    this.initArticleList()
  },
}
</script>

<style lang="stylus">
  .el-button
    margin-right 4px
    margin-bottom 4px
  .table-header
    margin-bottom 12px
  .el-input-group__prepend, .el-input-group__append
    background #ffffff
    padding 0 12px
  .el-input-group__append
    color #ffffff
    background #1890ff
  .el-popover .el-checkbox-group .el-checkbox
    margin-left 0px
    margin-right 12px
</style>
