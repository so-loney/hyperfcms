<template>
  <div>
    <PageHeaderLayout>
      <div class="main-page-content">
        <el-row class="table-header">
          <el-col>
            <el-tooltip effect="dark" content="添加讲师" placement="top-start"  v-if="userPermissions.indexOf('lecturer_create') != -1 && buttonType=='icon'" >
              <el-button type="primary" size="medium" icon="iconfont icon-tianjiacaidan2" @click="addButton(0)"></el-button>
            </el-tooltip>
            <el-button type="primary" size="medium" icon="iconfont"  v-if="userPermissions.indexOf('lecturer_create') != -1 && buttonType=='text'"  @click="addButton(0)">添加讲师</el-button>
          </el-col>
        </el-row>
        <el-row class="table-search">
          <el-form size="medium" :inline="true" :model="searchCondition" class="demo-form-inline">
            <el-form-item label="知名昵称">
              <el-input v-model="searchCondition.famous_nickname" placeholder="输入昵称" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchButton">查询</el-button>
            </el-form-item>
          </el-form>
        </el-row>
        <ApeTable ref="apeTable" :data="lecturerList" :columns="columns" :loading="loadingStaus" :pagingData="pagingData" @switchPaging="switchPaging" highlight-current-row>
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
            width="240">
            <template slot-scope="scope">
              <span>
                <el-tooltip effect="dark" content="编辑" placement="top-start"  v-if="userPermissions.indexOf('lecturer_edit') != -1" >
                  <el-button size="mini" icon="el-icon-edit" @click="editButton(scope.row.id)"></el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="删除" placement="top-start">
                  <span>
                    <el-popover
                      v-if="userPermissions.indexOf('lecturer_delete') != -1" 
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
            width="240">
            <template slot-scope="scope">
              <span>
                <el-button size="mini" v-if="userPermissions.indexOf('lecturer_edit') != -1"  @click="editButton(scope.row.id)">编辑</el-button>
                <el-popover
                  v-if="userPermissions.indexOf('lecturer_delete') != -1" 
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
    <ApeDrawer :drawerData="drawerData"  @drawerClose="drawerClose" @drawerConfirm="drawerConfirm">
      <template slot="ape-drawer">
        <el-form :model="formData" :rules="rules" ref="lecturerForm" label-position="right" label-width="96px">
          <el-row>
            <el-col :span="22">
              <el-form-item label="关联用户" prop="mobile_alias">
                <el-autocomplete
                  class="search-user"
                  v-model="formData.mobile_alias"
                  :fetch-suggestions="searchUser"
                  placeholder="输入手机号检索用户"
                  @select="handleUserSelect"
                  @clear="initMobileVerify"
                  clearable>
                </el-autocomplete>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="知名昵称" prop="famous_nickname">
                <el-input v-model="formData.famous_nickname"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="形象照" prop="image"  ref="imageItem">
                <ApeUploader :limit="1" @handleUploadSuccess="handleUploadSuccess" @handleUploadRemove="handleUploadRemove" :upload-file-list="uploadFileList"></ApeUploader>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="附加字段" prop="additional">
                <el-input type="textarea" :rows="2" v-model="formData.additional"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="简介" prop="intro">
                <el-input type="textarea" :rows="4" v-model="formData.intro"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="详情" prop="details">
                <ApeEditor :init-html="formData.details" :editorHeight="360" @handleTinymceInput="handleTinymceInput"></ApeEditor>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>     
      </template>
    </ApeDrawer>
  </div >
</template>

<script>
import PageHeaderLayout from '@/layouts/PageHeaderLayout'
import ApeTable from '@/components/ApeTable'
import ApeDrawer from '@/components/ApeDrawer'
import ApeUploader from '@/components/ApeUploader'
import ApeEditor from '@/components/ApeEditor'
import { mapGetters } from 'vuex'

export default {
  components: {
    PageHeaderLayout,
    ApeTable,
    ApeDrawer,
    ApeUploader,
    ApeEditor
  },
  data() {
    return {
      // 搜索条件
      searchCondition:{},
      loadingStaus: true,
      columns: [
        {
          title: '图片',
          type: 'image',
          value: 'image_url',
          width: 120
        },
        {
          title: '信息',
          value: [
            {label:'关联用户：',value:'relation_user'},
            {label:'知名昵称：',value:'famous_nickname'}
          ]
        },
        {
          title: '介绍',
          value: 'intro_alias',
          value_alias: 'intro'
        },
      ],
      // 表格列表数据
      lecturerList:[],
      // 分页信息
      pagingData:{
        is_show: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0
      },
      // 分页的offset,序号列使用
      offset:0,
      // 表单结构
      formData: {
        is_show: '1',
      },
      // 已上传文件列表
      uploadFileList:[],
      // 视频上传控制
      isStartUpload:false,
      // 是否选取了视频文件，既要不要执行上传
      isChangeVideo:false,
      // 是否视频预览
      isVideoPreview: false,
      // 已上传的视频列表，虽然只允许上传一个
      uploadVodList:[],
      // 表单验证
      rules: {
        // mobile_alias: [
        //   {required: true, message: '关联用户', trigger: 'blur', validator:this.searchUserVerify },
        // ],
        famous_nickname: [
          {required: true, message: '填写知名昵称', trigger: 'blur' },
        ],
        image: [
          {required: true, message: '上传图片', trigger: 'blur', validator:this.apeUploaderVerify},
        ],
      },
      // 抽屉数据
      drawerData: {
        visible: false,
        loading: true,
        loading_text: '玩命加载中……',
        // direction: 'right',
        title: '讲师管理',
        width_height: '720px',
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
    // 搜索
    searchButton() {
      this.initLecturerList()
    },
    // 切换页码操作
    async switchPaging() {
      this.initLecturerList()
    },
    // 响应添加按钮
    async addButton() {
      this.drawerData.loading_text = '玩命加载中……'
      this.drawerData.visible = true
      this.drawerData.title = '添加讲师'
      this.uploadVodList =[]
      this.$nextTick(() => {
        this.drawerData.loading = false
      })
    },
    // 响应编辑按钮
    async editButton(id) {
      this.drawerData.loading_text = '玩命加载中……'
      this.drawerData.visible = true
      this.drawerData.title = '编辑讲师(ID：'+id+')'
      let {info} = await this.$api.getLecturerInfo(id)
      this.formData = info
      this.uploadFileList = [{id:info.image_info.id,name:info.image_info.title,url:info.image_info.full_path}]
      this.uploadVodList =[]
      if (info.video_id && info.video_info && info.video_info.filename) {
        this.uploadVodList =[{name:info.video_info.filename}]
      }
      this.drawerData.loading = false
    },
    // 处理抽屉关闭
    drawerClose() {
      this.initFormData()
      this.drawerData.visible = false
      this.drawerData.loading = true
    },
    // 处理抽屉确认
    async drawerConfirm() {
      // 调用组件的数据验证方法
      this.$refs['lecturerForm'].validate((valid) => {
        if (valid) {
          if (this.isChangeVideo) {
            this.isStartUpload = true
          } else {
            this.formSubmit()
          }
        } else {
          this.$message.error('数据验证失败，请检查必填项数据！')
          this.$nextTick(() => {
            this.isStartUpload = false
          })
        }
      })
    },
    // form数据提交，请求接口
    async formSubmit() {
      this.drawerData.loading_text = '玩命提交中……'
      this.drawerData.loading = true
      let id = await this.$api.saveLecturer(this.formData)
      this.$nextTick(() => {
        this.drawerData.visible = false
      })
      this.$nextTick(() => {
        if (id) {
          this.initLecturerList()
        }
      })
      this.$nextTick(() => {
        this.$message.success('保存成功!')
      })
      this.initFormData()
    },
    // 相应删除按钮
    async deleteButton(id) {
      let info = await this.$api.deleteLecturer(id)
      if (info == 'ok') {
        this.$nextTick(() => {
          this.initLecturerList('del')
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
        this.$refs['lecturerForm'].resetFields()
        this.uploadFileList = []
      })
    },
    // 初始化讲师列表
    async initLecturerList(type) {
      this.loadingStaus=true
      let pagingInfo = this.$refs['apeTable'].getPagingInfo(type)
      let searchCondition = this.searchCondition
      // 合并
      Object.assign(searchCondition,pagingInfo)
      let {list,pages}= await this.$api.getLecturerList(searchCondition)
      this.lecturerList = []
      this.$nextTick(() => {
        this.lecturerList=list
      })
      this.pagingData.total = pages.total
      this.offset = pages.offset
      this.loadingStaus=false
    },
    // 图片上传成功回调
    handleUploadSuccess(file, fileList) {
      this.formData.image = file.id
      this.uploadFileList = fileList
    },
    // 图片删除回调
    handleUploadRemove(file, fileList) {
      this.formData.image = 0
      this.uploadFileList = fileList
    },
    // 图片上传自定义验证
    apeUploaderVerify(rule, value, callback) {
      if (rule.required && !this.formData.image) {
        callback(new Error(rule.message))
      }
      callback()
    },
    // 搜索用户验证
    searchUserVerify(rule, value, callback) {
      if (rule.required && !this.formData.user_id) {
        callback(new Error(rule.message))
      }
      callback()
    },
    // 搜索用户,qs请求参数，cb回调函数，详见组件用法
    async searchUser(qs, cb) {
      let list = await this.$api.lecturerSearchUser(qs)
      cb(list)
    },
    // 处理搜索结果的选中
    handleUserSelect(item) {
      this.formData.user_id = item.id
      if (this.formData.user_id) {
        this.$refs['lecturerForm'].validateField('mobile_alias')
      }
    },
    // 初始化选择验证
    initMobileVerify() {
      this.formData.user_id = ''
      this.$refs['lecturerForm'].validateField('mobile_alias')
    },
    // 处理编辑器内容输入
    handleTinymceInput(val) {
      this.formData.details = val
    },
  },
  mounted() {
    this.initLecturerList()
  },
}
</script>

<style lang="stylus" scoped>
  .el-button
    margin-right 4px
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
    width 300px
  .el-radio.is-bordered
    width 100px
  .el-color-picker
    position absolute
  .search-user
    width 520px
</style>

