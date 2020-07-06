<template>
  <div>
    <PageHeaderLayout>
      <div class="main-page-content">
        <el-row class="table-header">
          <el-col>
            <el-tooltip effect="dark" content="添加友链" placement="top-start"  v-if="userPermissions.indexOf('link_create') != -1 && buttonType=='icon'" >
              <el-button type="primary" size="medium" icon="iconfont icon-tianjiacaidan2" @click="addButton(0)"></el-button>
            </el-tooltip>
            <el-button type="primary" size="medium" icon="iconfont"  v-if="userPermissions.indexOf('link_create') != -1  && buttonType=='text'"  @click="addButton(0)">添加</el-button>
          </el-col>
        </el-row>
        <ApeTable ref="apeTable" :data="linkList" :columns="columns" :loading="loadingStaus" :pagingData="pagingData" @switchPaging="switchPaging" highlight-current-row>
          <el-table-column
            slot="first-column"
            width="80"
            align="center"
            label="Drag">
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="拖动排序" placement="top-start">
                <span class="drag-handle" :data-id="scope.row.id"><i class="el-icon-rank"></i></span>
              </el-tooltip>
            </template>
          </el-table-column>
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
                <el-tooltip effect="dark" content="编辑" placement="top-start"  v-if="userPermissions.indexOf('link_edit') != -1" >
                  <el-button size="mini" icon="el-icon-edit" @click="editButton(scope.row.id)"></el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="删除" placement="top-start">
                  <span>
                    <el-popover
                      v-if="userPermissions.indexOf('link_delete') != -1" 
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
                <el-button size="mini" v-if="userPermissions.indexOf('link_edit') != -1"  @click="editButton(scope.row.id)">编辑</el-button>
                <el-popover
                  v-if="userPermissions.indexOf('link_delete') != -1" 
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

    <ApeDrawer :drawerData="drawerData"  @drawerClose="drawerClose" @drawerConfirm="drawerConfirm">
      <template slot="ape-drawer">
        <el-form :model="formData" :rules="rules" ref="linkForm" label-position="right" label-width="96px">
          <el-row>
            <el-col :span="22">
              <el-form-item label="名称" prop="title">
                <el-input v-model="formData.title"></el-input>
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
            <el-col>
              <el-form-item label="图片" prop="image"  ref="imageItem">
                <ApeUploader :limit="1" @handleUploadSuccess="handleUploadSuccess" @handleUploadRemove="handleUploadRemove" :upload-file-list="uploadFileList"></ApeUploader>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="打开方式" prop="target">
                <el-radio-group v-model="formData.target">
                  <el-radio label="_blank" border>新开页</el-radio>
                  <el-radio label="_self" border>当前页</el-radio>
                </el-radio-group>
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
              <el-form-item label="附加内容" prop="additional">
                <el-input type="textarea" :rows="4" v-model="formData.additional"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="备注" prop="description">
                <el-input type="textarea" :rows="4" v-model="formData.description"></el-input>
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
import Sortable from 'sortablejs'
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
          title: '名称',
          value: 'title'
        },
        {
          title: '链接地址',
          value: 'url'
        },
        {
          title: '目标方式',
          value: 'target'
        },
        {
          title: '状态',
          value: 'show_alias'
        }
        
      ],
      // 表格列表数据
      linkList:[],
      // 分页信息
      pagingData:{
        is_show: false,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0
      },
      // 分页的offset,序号列使用
      offset:0,
      // 表单结构
      formData: {
        target: '_blank',
        is_show: '1',
      },
      // 已上传文件列表
      uploadFileList:[],
      // 表单验证
      rules: {
        title: [
          {required: true, message: '输入标题', trigger: 'blur' },
        ],
        url: [
          {required: true, message: '输入URL地址', trigger: 'blur' },
        ],
        target: [
          {required: true, message: '选择打开发方式', trigger: 'blur' },
        ],
        is_show: [
          {required: true, message: '选择状态', trigger: 'blur' },
        ]
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
      typeList:[],
    }
  },
  computed: {
    ...mapGetters(['userPermissions','buttonType'])
  },
  methods: {
    // 切换页码操作
    async switchPaging() {
      this.initLinkList()
    },
    // 响应添加按钮
    async addButton() {
      this.drawerData.loading_text = '玩命加载中……'
      this.drawerData.visible = true
      this.drawerData.title = '添加友情链接'
      let list = await this.$api.getLinkTypeList()
      this.typeList = list
      this.$nextTick(() => {
        this.drawerData.loading = false
      })
    },
    // 响应编辑按钮
    async editButton(id) {
      this.drawerData.loading_text = '玩命加载中……'
      this.drawerData.visible = true
      this.drawerData.title = '编辑友情链接(ID：'+id+')'
      let list = await this.$api.getLinkTypeList()
      this.typeList = list
      let {info} = await this.$api.getLinkInfo(id)
      this.formData = info
      if (info.image_info.id) {
        this.uploadFileList = [{id:info.image_info.id,name:info.image_info.title,url:info.image_info.full_path}]
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
      this.$refs['linkForm'].validate((valid) => {
        if (valid) {
          this.formSubmit()
        } else {
          this.$message.error('数据验证失败，请检查必填项数据！')
        }
      })
    },
    // form数据提交，请求接口
    async formSubmit() {
      this.drawerData.loading_text = '玩命提交中……'
      this.drawerData.loading = true
      let id = await this.$api.saveLink(this.formData)
      this.$nextTick(() => {
        this.drawerData.visible = false
      })
      this.$nextTick(() => {
        if (id) {
          this.initLinkList()
        }
      })
      this.$nextTick(() => {
        this.$message.success('保存成功!')
      })
      this.initFormData()
    },
    // 相应删除按钮
    async deleteButton(id) {
      let info = await this.$api.deleteLink(id)
      if (info == 'ok') {
        this.$nextTick(() => {
          this.initLinkList('del')
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
          target: '_blank',
          is_show: '1',
        }
        this.$refs['linkForm'].resetFields()
        this.uploadFileList = []
      })
    },
    // 初始化友情链接列表
    async initLinkList(type) {
      this.loadingStaus=true
      let pagingInfo = this.$refs['apeTable'].getPagingInfo(type)
      let {list,pages}= await this.$api.getLinkList(pagingInfo)
      this.linkList = []
      this.$nextTick(() => {
        this.linkList=list
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
    // 拖拽排序数据提交，请求接口
    async dragSortSubmit(orderIds) {
      let info = await this.$api.orderLink(orderIds)
      if (info == 'ok') {
        this.$nextTick(() => {
          this.initLinkList()
        })
      }
      this.$message.success('保存成功!')
    },
    // 表格拖拽排序，同层级移动有效果
    dragSort() {
      const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el,{
        handle: ".drag-handle", 
        setData: function(dataTransfer) {
          dataTransfer.setData('Text', '')
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
        },
        onEnd: () => {
          let Ids = []
          let tmp = el.querySelectorAll('.drag-handle')
          for (let i=0,len=tmp.length; i < len; i++) {
            Ids.push(tmp[i].dataset.id)
          }
          this.dragSortSubmit(Ids)
        },
      })
    }
  },
  mounted() {
    this.initLinkList()
    this.$nextTick(() => {
      this.dragSort()
    })
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
