<template>
  <div>
    <PageHeaderLayout>
      <div class="main-page-content">
        <el-row class="table-header">
          <el-col>
            <el-tooltip effect="dark" content="添加友链" placement="top-start"  v-if="userPermissions.indexOf('live_create') != -1 && buttonType=='icon'" >
              <el-button type="primary" size="medium" icon="iconfont icon-tianjiacaidan2" @click="addButton(0)"></el-button>
            </el-tooltip>
            <el-button type="primary" size="medium" icon="iconfont"  v-if="userPermissions.indexOf('live_create') != -1 && buttonType=='text'"  @click="addButton(0)">添加直播</el-button>
          </el-col>
        </el-row>
        <el-row class="table-search">
          <el-form size="medium" :inline="true" :model="searchCondition" class="demo-form-inline">
            <el-form-item label="标题">
              <el-input v-model="searchCondition.title" placeholder="输入标题" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchButton">查询</el-button>
            </el-form-item>
          </el-form>
        </el-row>
        <ApeTable ref="apeTable" :data="liveList" :columns="columns" :loading="loadingStaus" :pagingData="pagingData" @switchPaging="switchPaging" highlight-current-row>
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
            label="操作">
            <template slot-scope="scope">
              <span>
                <!-- <el-tooltip effect="dark" content="直播信息" placement="top-start">
                  <el-button size="mini" type="primary" icon="iconfont icon-zhibo2" @click="getLiveStreamInfo(scope.row.id)" plain></el-button>
                </el-tooltip> -->
                <el-tooltip effect="dark" content="编辑" placement="top-start"  v-if="userPermissions.indexOf('live_edit') != -1" >
                  <el-button size="mini" icon="el-icon-edit" @click="editButton(scope.row.id)"></el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="删除" placement="top-start">
                  <span>
                    <el-popover
                      v-if="userPermissions.indexOf('live_delete') != -1" 
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
            label="操作">
            <template slot-scope="scope">
              <span>
                <!-- <el-button size="mini" type="primary" icon="iconfont" @click="getLiveStreamInfo(scope.row.id)" plain>直播信息</el-button> -->
                <el-button size="mini" v-if="userPermissions.indexOf('live_edit') != -1"  @click="editButton(scope.row.id)">编辑</el-button>
                <el-popover
                  v-if="userPermissions.indexOf('live_delete') != -1" 
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
          <el-form :model="formData" :rules="rules" ref="liveForm" label-position="right" label-width="96px">
            <el-row>
              <el-col :span="22">
                <el-form-item label="标题" prop="title">
                  <el-input v-model="formData.title"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="22">
                <el-form-item label="封面" prop="cover">
                  <ApeUploader :limit="1" @handleUploadSuccess="handleUploadSuccess" @handleUploadRemove="handleUploadRemove" :upload-file-list="uploadFileList"></ApeUploader>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="22">
                <el-form-item label="讲师" prop="mobile_alias">
                  <el-autocomplete
                    class="search-user"
                    v-model="formData.mobile_alias"
                    :fetch-suggestions="searchLecturer"
                    placeholder="输入手机号检索用户"
                    @select="handleLecturerSelect"
                    @clear="initMobileVerify"
                    clearable>
                  </el-autocomplete>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="22">
                <el-form-item label="直播时间" prop="time_value">
                  <el-date-picker
                    class="live-datetimerang-1"
                    v-model="formData.time_value"
                    type="datetimerange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    value-format="yyyy-MM-dd HH:mm:ss">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="22">
                <el-form-item label="简介" prop="intro">
                  <el-input type="textarea" :rows="6" v-model="formData.intro"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>     
        </template>
      </ApeDrawer>
      <ModalDialog :dialogData="dialogliveStreamData" @dialogConfirm="dialogliveStreamButton" @dialogClose="dialogliveStreamButton">
        <template slot="content">
          <div class="live-stream">
            <span>推流地址</span>
            <span>{{liveStreamInfo.push_info}}</span>
          </div>
          <div class="live-stream">
            <span>播流地址</span>
            <div>
              <span v-for="playInfo in liveStreamInfo.play_info" :key="playInfo">{{playInfo}}</span>
            </div>
          </div>
        </template>
      </ModalDialog>
  </div >
</template>

<script>
import PageHeaderLayout from '@/layouts/PageHeaderLayout'
import ApeTable from '@/components/ApeTable'
import ApeDrawer from '@/components/ApeDrawer'
import ModalDialog from '@/components/ModalDialog'
import ApeUploader from '@/components/ApeUploader'
import { mapGetters } from 'vuex'

export default {
  components: {
    PageHeaderLayout,
    ApeTable,
    ApeDrawer,
    ApeUploader,
    ModalDialog
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
          title: '标题',
          value: 'title'
        },
        {
          title: '讲师',
          value: 'lecturer_info'
        },
        {
          title: '直播时间',
          value: [
            {label:'开始时间：',value:'start_time'},
            {label:'结束时间：',value:'end_time'},
          ],
          width: 320
        }
      ],
      // 表格列表数据
      liveList:[],
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
      // 表单验证
      rules: {
        title: [
          {required: true, message: '输入标题', trigger: 'blur'},
        ],
        time_value: [
          {required: true, message: '选择直播时间', trigger: 'blur'},
        ],
        mobile_alias: [
          {required: true, message: '选择讲师', trigger: 'blur', validator:this.searchLecturerVerify},
        ],
      },
      // 抽屉数据
      drawerData: {
        visible: false,
        loading: true,
        loading_text: '玩命加载中……',
        // direction: 'right',
        title: '直播管理',
        width_height: '600px',
        // mask: false,
        // close_name: '关 闭',
        // confirm_name: '打 印',
      },
      // 直播流信息，弹窗数据
      dialogliveStreamData:{
        visible: false,
        title: '',
        width: '40%',
        loading: true,
        modal: true
      },
      // 直播流信息
      liveStreamInfo:{}
      
    }
  },
  computed: {
    ...mapGetters(['userPermissions','buttonType'])
  },
  methods: {
    // 搜索
    searchButton() {
      this.initLiveList()
    },
    // 切换页码操作
    async switchPaging() {
      this.initLiveList()
    },
    // 响应添加按钮
    async addButton() {
      this.drawerData.loading_text = '玩命加载中……'
      this.drawerData.visible = true
      this.drawerData.title = '添加直播'
      this.$nextTick(() => {
        this.drawerData.loading = false
      })
    },
    // 响应编辑按钮
    async editButton(id) {
      this.drawerData.loading_text = '玩命加载中……'
      this.drawerData.visible = true
      this.drawerData.title = '编辑直播(ID：'+id+')'
      let {info} = await this.$api.getLiveInfo(id)
      this.formData = info
      this.uploadFileList = info.image_info.id?[{id:info.image_info.id,name:info.image_info.title,url:info.image_info.full_path}]:[]
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
      this.$refs['liveForm'].validate((valid) => {
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
      let id = await this.$api.saveLive(this.formData)
      this.$nextTick(() => {
        this.drawerData.visible = false
      })
      this.$nextTick(() => {
        if (id) {
          this.initLiveList()
        }
      })
      this.$nextTick(() => {
        this.$message.success('保存成功!')
      })
      this.initFormData()
    },
    // 相应删除按钮
    async deleteButton(id) {
      let info = await this.$api.deleteLive(id)
      if (info == 'ok') {
        this.$nextTick(() => {
          this.initLiveList('del')
        })
      } else {
        this.$message.error(info)
      }
      
    },
    // 初始化数据
    initFormData() {
      // 初始化form表单
      this.$nextTick(() => {
        this.formData = {
          is_show: '1',
        }
        this.isStartUpload = false
        this.isChangeVideo = false
        this.$refs['liveForm'].resetFields()
        this.uploadFileList = []
      })
    },
    // 初始化直播列表
    async initLiveList(type) {
      this.loadingStaus=true
      let pagingInfo = this.$refs['apeTable'].getPagingInfo(type)
      let searchCondition = this.searchCondition
      Object.assign(searchCondition,pagingInfo)
      let {list,pages}= await this.$api.getLiveList(searchCondition)
      this.liveList = []
      this.$nextTick(() => {
        this.liveList=list
      })
      this.pagingData.total = pages.total
      this.offset = pages.offset
      this.loadingStaus=false
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
    // 图片上传自定义验证
    apeUploaderVerify(rule, value, callback) {
      if (rule.required && !this.formData.cover) {
        callback(new Error(rule.message))
      }
      callback()
    },
    // 搜索用户验证
    searchLecturerVerify(rule, value, callback) {
      if (rule.required && !this.formData.lecturer_id) {
        callback(new Error(rule.message))
      }
      callback()
    },
    // 搜索用户,qs请求参数，cb回调函数，详见组件用法
    async searchLecturer(qs, cb) {
      let list = await this.$api.getSearchLecturer(qs)
      cb(list)
    },
    // 处理搜索结果的选中
    handleLecturerSelect(item) {
      this.formData.lecturer_id = item.id
      if (this.formData.lecturer_id) {
        this.$refs['liveForm'].validateField('mobile_alias')
      }
    },
    // 初始化选择验证
    initMobileVerify() {
      this.formData.lecturer_id = ''
      this.$refs['liveForm'].validateField('mobile_alias')
    },
    // 获取直播信息，推流播放等信息
    async getLiveStreamInfo(id) {
      this.dialogliveStreamData.visible = true
      this.dialogliveStreamData.title = '直播流信息'
      let {info} = await this.$api.getLiveStreamInfo(id)
      this.liveStreamInfo = info
      this.dialogliveStreamData.loading = false
    },
    // 直播信息模态框事件
    dialogliveStreamButton() {
      this.dialogliveStreamData.visible = false
      this.dialogliveStreamData.loading = true
    }
  },
  mounted() {
    this.initLiveList()
  },
}
</script>

<style lang="stylus" scoped>
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
    width 300px
  .el-radio.is-bordered
    width 100px
  .el-color-picker
    position absolute
  .search-user,.live-datetimerang-1
    width 410px !important
  .live-stream
    margin-bottom 24px
    padding 0px 8px
    border-left 4px solid #179aff
    span
      display block
      padding-bottom 2px
      margin-bottom 8px
      border-bottom 1px solid #e8e8e8

</style>
