<template>
  <div>
    <PageHeaderLayout>
      <div class="main-page-content">
        <el-row class="table-header">
          <el-col>
            <el-tooltip effect="dark" content="添加附件" placement="top-start"  v-if="userPermissions.indexOf('attachment_create') != -1 && buttonType=='icon'" >
              <el-button type="primary" size="medium" icon="iconfont icon-tianjiacaidan2" @click="addButton(0)"></el-button>
            </el-tooltip>
            <el-button type="primary" size="medium" icon="iconfont"  v-if="userPermissions.indexOf('attachment_create') != -1  && buttonType=='text'"  @click="addButton(0)">添加</el-button>
          </el-col>
        </el-row>
        <ApeTable ref="apeTable" :data="attachmentList" :columns="columns" :loading="loadingStaus" :pagingData="pagingData" @switchPaging="switchPaging" highlight-current-row border align=center>
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
            label="操作"
            width="180">
            <template slot-scope="scope">
              <span>
                <el-tooltip effect="dark" content="编辑" placement="top-start"  v-if="userPermissions.indexOf('attachment_edit') != -1" >
                  <el-button size="mini" icon="el-icon-edit" @click="editButton(scope.row.id)"></el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="删除" placement="top-start">
                  <span>
                    <el-popover
                      v-if="userPermissions.indexOf('attachment_delete') != -1" 
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
            label="操作"
            width="180">
            <template slot-scope="scope">
              <span>
                <el-button size="mini" v-if="userPermissions.indexOf('attachment_edit') != -1"  @click="editButton(scope.row.id)">编辑</el-button>
                <el-popover
                  v-if="userPermissions.indexOf('attachment_delete') != -1" 
                  placement="top"
                  width="150"
                  v-model="scope.row.visible">
                  <p>确定要删除记录吗？</p>
                  <div style="text-align: right; margin: 0;">
                    <el-button type="text" size="mini" @click="scope.row.visible=false">取消</el-button>
                    <el-button type="danger" size="mini" @click="deleteButton(scope.row.id)">确定</el-button>
                  </div>
                  <el-button slot="reference" type="danger" size="mini" >删除</el-button>
                </el-popover>
              </span>
            </template>
          </el-table-column>
        </ApeTable>
      </div>
    </PageHeaderLayout>
    <ModalDialog :dialogData="dialogData"  @dialogClose="dialogClose" @dialogConfirm="dialogConfirm">
      <template slot="content">
        <el-form :model="formData" :rules="rules" ref="attachmentForm" label-position="right" label-width="96px">
          <el-row>
            <el-col :span="22">
              <el-form-item label="名称" prop="title">
                <el-input v-model="formData.title"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="isAddStatus">
            <el-col>
              <el-form-item label="附件" prop="attachment_id">
                <ApeUploader :limit="1" :isImage="false" uploadTip="请上传文件，最多上传1份，最大500MB。" :allowSize="1024*1024*500" @handleUploadSuccess="handleUploadSuccess" @handleUploadRemove="handleUploadRemove" :upload-file-list="uploadFileList"></ApeUploader>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>     
      </template>
    </ModalDialog>
  </div >
</template>

<script>
import PageHeaderLayout from '@/layouts/PageHeaderLayout'
import ApeTable from '@/components/ApeTable'
import ModalDialog from '@/components/ModalDialog'
import ApeUploader from '@/components/ApeUploader'
import { mapGetters } from 'vuex'

export default {
  components: {
    PageHeaderLayout,
    ApeTable,
    ModalDialog,
    ApeUploader
  },
  data() {
    return {
      loadingStaus: true,
      columns: [
        {
          title: '信息',
          value: [
            {label:'ID：',value:'id'},
            {label:'名称：',value:'title_alias',value_alias:'title'},
            {label:'用户：',value:'username'}
          ],
          width: 260,
          header_align:'center'
        },
        {
          title: '信息',
          value: [
            {label:'文件名：',value:'filename'},
            {label:'访问路径：',value:'path_alias',value_alias:'path'}
          ],
          header_align:'center'
        },
        {
          title: '信息',
          value: [
            {label:'类型：',value:'type'},
            {label:'大小：',value:'size_alias'},
            {label:'创建时间：',value:'created_at'}
          ],
          width: 240,
          header_align:'center'
        }, 
      ],
      // 附件类型
      attachmentType:['image/tiff', 'image/bmp','image/jpg', 'image/gif','image/jpeg', 'image/png','application/pdf','application/caj','','application/zip','application/rar','application/doc'],
      // 表格列表数据
      attachmentList:[],
      // 分页信息
      pagingData:{
        is_show: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0
      },
      // 分页的offset,序号列使用
      offset:0,
      // 是否为增加状态
      isAddStatus:true,
      // 表单结构
      formData: {},
      // 已上传文件列表
      uploadFileList:[],
      // 表单验证
      rules: {
        title: [
          {required: true, message: '输入标题', trigger: 'blur' },
        ],
        attachment_id: [
          {required: true, message: '上传图片', trigger: 'blur', validator:this.apeUploaderVerify},
        ],
      },
      // 抽屉数据
      dialogData: {
        visible: false,
        loading: true,
        loading_text: '玩命加载中……',
        // direction: 'right',
        title: '附件',
        width: '560px',
        // mask: false,
        // close_name: '关 闭',
        // confirm_name: '打 印',
      },
    }
  },
  computed: {
    ...mapGetters(['userPermissions','buttonType'])
  },
  methods: {
    // 切换页码操作
    async switchPaging() {
      this.initAttachmentList()
    },
    // 响应添加按钮
    async addButton() {
      this.isAddStatus = true
      this.dialogData.loading_text = '玩命加载中……'
      this.dialogData.visible = true
      this.dialogData.title = '添加附件'
      this.$nextTick(() => {
        this.dialogData.loading = false
      })
    },
    // 响应编辑按钮
    async editButton(id) {
      this.isAddStatus = false
      this.dialogData.loading_text = '玩命加载中……'
      this.dialogData.visible = true
      this.dialogData.title = '编辑友情链接(ID：'+id+')'
      let {info} = await this.$api.getAttachmentInfo(id)
      this.formData = info
      this.dialogData.loading = false
    },
    // 处理抽屉关闭
    dialogClose() {
      this.initFormData()
      this.dialogData.visible = false
      this.dialogData.loading = true
    },
    // 处理抽屉确认
    async dialogConfirm() {
      // 调用组件的数据验证方法
      this.$refs['attachmentForm'].validate((valid) => {
        if (valid) {
          this.formSubmit()
        } else {
          this.$message.error('数据验证失败，请检查必填项数据！')
        }
      })
    },
    // form数据提交，请求接口
    async formSubmit() {
      this.dialogData.loading_text = '玩命提交中……'
      this.dialogData.loading = true
      let id = await this.$api.saveAttachment(this.formData)
      this.$nextTick(() => {
        this.dialogData.visible = false
      })
      this.$nextTick(() => {
        if (id) {
          this.initAttachmentList()
        }
      })
      this.$nextTick(() => {
        this.$message.success('保存成功!')
      })
      this.initFormData()
    },
    // 相应删除按钮
    async deleteButton(id) {
      let info = await this.$api.deleteAttachment(id)
      if (info == 'ok') {
        this.$nextTick(() => {
          this.initAttachmentList('del')
        })
      } else {
        this.$message.error(info)
      }
      
    },
    // 初始化数据
    initFormData() {
      // 初始化form表单
      this.$nextTick(() => {
        this.formData = {}
        this.$refs['attachmentForm'].resetFields()
        this.uploadFileList = []
      })
    },
    // 初始化附件列表
    async initAttachmentList(type) {
      this.loadingStaus=true
      let pagingInfo = this.$refs['apeTable'].getPagingInfo(type)
      let {list,pages}= await this.$api.getAttachmentList(pagingInfo)
      this.attachmentList = []
      this.$nextTick(() => {
        this.attachmentList=list
      })
      this.pagingData.total = pages.total
      this.offset = pages.offset
      this.loadingStaus=false
    },
    // 附件上传成功回调
    handleUploadSuccess(file, fileList) {
      this.formData.attachment_id = file.id
      this.uploadFileList = fileList
    },
    // 附件删除回调
    handleUploadRemove(file, fileList) {
      this.formData.attachment_id = 0
      this.uploadFileList = fileList
    },
    // 附件上传自定义验证
    apeUploaderVerify(rule, value, callback) {
      if (rule.required && !this.formData.attachment_id) {
        callback(new Error(rule.message))
      }
      callback()
    },
  },
  mounted() {
    this.initAttachmentList()
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
