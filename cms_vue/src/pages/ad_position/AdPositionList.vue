<template>
  <div>
    <PageHeaderLayout>
      <div class="main-page-content">
        <el-row class="table-header">
          <el-col>
            <el-tooltip effect="dark" content="添加广告位" placement="top-start"  v-if="userPermissions.indexOf('ad_position_create') != -1 && buttonType=='icon'" >
              <el-button type="primary" size="medium" icon="iconfont icon-tianjiacaidan2" @click="addButton(0)"></el-button>
            </el-tooltip>
            <el-button type="primary" size="medium" icon="iconfont "  v-if="userPermissions.indexOf('ad_position_create') != -1 && buttonType=='text'"  @click="addButton(0)">添加广告位</el-button>
          </el-col>
        </el-row>
        <ApeTable ref="apeTable" :data="adPositionList" :columns="columns" :loading="loadingStaus" :pagingData="pagingData" @switchPaging="switchPaging" highlight-current-row>
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
                <!-- <el-tooltip effect="dark" content="预览" placement="top-start">
                  <el-button v-if="scope.row.video_status" size="mini" class="view-video" icon="iconfont icon-shipin2" @click="videoPreview(scope.row)"></el-button>
                </el-tooltip> -->
                <el-tooltip effect="dark" content="编辑" placement="top-start"  v-if="userPermissions.indexOf('ad_position_edit') != -1" >
                  <el-button size="mini" icon="el-icon-edit" @click="editButton(scope.row.id)"></el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="删除" placement="top-start">
                  <span>
                    <el-popover
                      v-if="userPermissions.indexOf('ad_position_delete') != -1" 
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
                <!-- <el-button v-if="scope.row.video_status" size="mini" class="view-video" icon="iconfont" @click="videoPreview(scope.row)">预览</el-button> -->
                <el-button size="mini" v-if="userPermissions.indexOf('ad_position_edit') != -1"  @click="editButton(scope.row.id)">编辑</el-button>
                <el-popover
                  v-if="userPermissions.indexOf('ad_position_delete') != -1" 
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
        <el-form :model="formData" :rules="rules" ref="adPositionForm" label-position="right" label-width="96px">
          <el-row>
            <el-col :span="22">
              <el-form-item label="标题" prop="title">
                <el-input v-model="formData.title"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="唯一标识" prop="unique_identify">
                <el-input v-model="formData.unique_identify"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="类别" prop="c_type">
                <el-select v-model="formData.c_type" filterable clearable placeholder="请选择">
                  <el-option
                    v-for="item in typeList"
                    :key="item.id"
                    :label="item.display_name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="跳转链接" prop="url">
                <el-input v-model="formData.url"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="状态" prop="is_show">
                <el-radio-group v-model="formData.is_show">
                  <el-radio label="1" border>显示</el-radio>
                  <el-radio label="0" border>隐藏</el-radio>  
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="附加字段" prop="additional_field">
                <el-input type="textarea" :rows="2" v-model="formData.additional_field"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="简介" prop="description">
                <el-input type="textarea" :rows="4" v-model="formData.description"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="图片" prop="image"  ref="imageItem">
                <ApeUploader :limit="1" @handleUploadSuccess="handleUploadSuccess" @handleUploadRemove="handleUploadRemove" :upload-file-list="uploadFileList"></ApeUploader>
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
import { mapGetters } from 'vuex'

export default {
  components: {
    PageHeaderLayout,
    ApeTable,
    ApeDrawer,
    ApeUploader
  },
  data() {
    return {
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
            {label:'标题：',value:'title'},
            {label:'标识：',value:'unique_identify'},
            {label:'状态：',value:'show_alias'},
          ]
        },
        {
          title: '信息',
          value: [
            {label:'链接：',value:'url'},
            {label:'简介：',value:'description'},
          ]
        },
      ],
      // 表格列表数据
      adPositionList:[],
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
        title: [
          {required: true, message: '输入标题', trigger: 'blur' },
        ],
        // unique_identify: [
        //   {required: true, message: '选择类型', trigger: 'blur' },
        // ],
        is_show: [
          {required: true, message: '选择状态', trigger: 'blur' },
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
        title: '权限绑定',
        width_height: '560px',
        // mask: false,
        // close_name: '关 闭',
        // confirm_name: '打 印',
      },
      typeList: [], 
    }
  },
  computed: {
    ...mapGetters(['userPermissions','buttonType'])
  },
  methods: {
    // 切换页码操作
    async switchPaging() {
      this.initAdPositionList()
    },
    // 响应添加按钮
    async addButton() {
      this.drawerData.loading_text = '玩命加载中……'
      this.drawerData.visible = true
      this.drawerData.title = '添加广告位'
      this.uploadVodList =[]
      let list = await this.$api.getAdPositionTypeList()
      this.typeList = list
      this.$nextTick(() => {
        this.drawerData.loading = false
      })
    },
    // 响应编辑按钮
    async editButton(id) {
      this.drawerData.loading_text = '玩命加载中……'
      this.drawerData.visible = true
      this.drawerData.title = '编辑广告位(ID：'+id+')'
      let list = await this.$api.getAdPositionTypeList()
      this.typeList = list
      let {info} = await this.$api.getAdPositionInfo(id)
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
      this.$refs['adPositionForm'].validate((valid) => {
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
      let id = await this.$api.saveAdPosition(this.formData)
      this.$nextTick(() => {
        this.drawerData.visible = false
      })
      this.$nextTick(() => {
        if (id) {
          this.initAdPositionList()
        }
      })
      this.$nextTick(() => {
        this.$message.success('保存成功!')
      })
      this.initFormData()
    },
    // 相应删除按钮
    async deleteButton(id) {
      let info = await this.$api.deleteAdPosition(id)
      if (info == 'ok') {
        this.$nextTick(() => {
          this.initAdPositionList('del')
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
        this.$refs['adPositionForm'].resetFields()
        this.uploadFileList = []
      })
    },
    // 初始化广告位列表
    async initAdPositionList(type) {
      this.loadingStaus=true
      let pagingInfo = this.$refs['apeTable'].getPagingInfo(type)
      let {list,pages}= await this.$api.getAdPositionList(pagingInfo)
      this.adPositionList = []
      this.$nextTick(() => {
        this.adPositionList=list
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
    // 处理视频文件选择回调
    handleVodUploadChange(fileInfo) {
      this.formData.aliyun_video_id = fileInfo.video_id
      this.formData.filename = fileInfo.filename
      this.isChangeVideo = true
    },
    // 处理视频删除回调
    handleVodUploadRemove() {
      this.formData.aliyun_video_id = ''
      this.formData.filename = ''   
    },
    // 处理视频上传成功回调
    handleVodUploadSuccess() {
      this.formSubmit()
    },
    // 视频预览
    async videoPreview(data) {
      this.isVideoPreview = true
      let previewInfo = await this.$api.getAdPositionVideoPreview(data.aliyun_video_id);
      this.$refs.apeAliyunPlayer.replayByVidAndPlayAuth(previewInfo['auth_info']['VideoMeta']['VideoId'],previewInfo['auth_info']['PlayAuth'])
    },
    // 关闭视频预览
    closeVideoPreview() {
      this.isVideoPreview = false
      this.$refs.apeAliyunPlayer.pause()
    },
  },
  mounted() {
    this.initAdPositionList()
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
  .ape-aliyun-player-mask
    top 0
    left 0
    position fixed
    width 100%
    height 0
    z-index 99999
    display none
    transition opacity .3s linear,height 0s ease .3s
  .ape-aliyun-player-mask.is-video-preview
    height 100%
    display block
    background-color rgba(0,0,0,0.85)
    transition opacity ease-in-out 0.38s, visibility ease-in-out 0.38s
    .header-title
      color #ffffff
      text-align center
      margin-top 48px
      margin-bottom 24px
    .close-button
      position absolute
      top 32px
      right 120px
</style>
