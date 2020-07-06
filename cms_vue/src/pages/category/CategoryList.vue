<template>
  <div>
    <PageHeaderLayout>
      <div class="main-page-content">
        <el-row class="table-header">
          <el-col>
            <el-tooltip effect="dark" content="添加主分类" placement="top-start"  v-if="userPermissions.indexOf('category_create') != -1 && buttonType=='icon'" >
              <el-button type="primary" size="medium" icon="iconfont icon-tianjiacaidan2" @click="addButton(0)"></el-button>
            </el-tooltip>
            <el-button type="primary" size="medium" icon="iconfont" v-if="userPermissions.indexOf('category_create') != -1 && buttonType=='text'" @click="addButton(0)">添加主分类</el-button>
          </el-col>
        </el-row>
        <TreeTable :data="categoryList" :columns="columns" :loading="loadingStaus" ref="treeTable" highlight-current-row >
          <el-table-column
          slot="first-column"
          width="80"
          align="center"
          label="Drag">
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="拖动排序" placement="top-start">
                <span class="drag-handle" :data-id="scope.row.id" :data-parent_id="scope.row.parent_id" :data-depth="scope.row.depth"><i class="el-icon-rank"></i></span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
          v-if="buttonType=='icon'"
          label="操作">
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="添加子分类" placement="top-start"  v-if="userPermissions.indexOf('category_create') != -1" >
                <el-button size="mini" icon="iconfont icon-zengjiazicaidan"  @click="addButton(scope.row.id)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="编辑" placement="top-start"  v-if="userPermissions.indexOf('category_edit') != -1" >
                <el-button size="mini" icon="el-icon-edit" @click="editButton(scope.row.id)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top-start" >
                <span>
                  <el-popover
                    v-if="userPermissions.indexOf('category_delete') != -1"
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
            </template>
          </el-table-column>
          <el-table-column
          v-if="buttonType=='text'"
          label="操作">
            <template slot-scope="scope">
              <el-button size="mini" icon="iconfont" @click="addButton(scope.row.id)">添加子类</el-button>
              <el-button size="mini"  @click="editButton(scope.row.id)">编辑</el-button>
              <el-popover
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
            </template>
          </el-table-column>
        </TreeTable>
      </div>
    </PageHeaderLayout>

    <ModalDialog :dialogData="dialogData" @dialogConfirm="handleConfirm" @dialogClose="dialogClose">
      <template slot="content">
        <el-form :model="formData" :rules="rules" ref="categoryForm" label-position="right" label-width="96px">
          <el-form-item label="分类名称" prop="display_name">
            <el-input v-model="formData.display_name"></el-input>
          </el-form-item>
          <el-form-item label="分类标识" prop="name">
            <el-input v-model="formData.name"></el-input>
          </el-form-item>
          <el-form-item label="跳转链接" prop="url">
            <el-input v-model="formData.url"></el-input>
          </el-form-item>
          <el-form-item label="附加内容" prop="additional">
            <el-input type="textarea" v-model="formData.additional"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="description">
            <el-input type="textarea" v-model="formData.description"></el-input>
          </el-form-item>
          <el-form-item label="图片" prop="image"  ref="imageItem">
            <ApeUploader :limit="1" @handleUploadSuccess="handleUploadSuccess" @handleUploadRemove="handleUploadRemove" :upload-file-list="uploadFileList"></ApeUploader>
          </el-form-item>
        </el-form>
      </template>
    </ModalDialog>
  </div >
</template>

<script>
import PageHeaderLayout from '@/layouts/PageHeaderLayout'
import TreeTable from '@/components/TreeTable'
import Sortable from 'sortablejs'
import ModalDialog from '@/components/ModalDialog'
import { mapGetters } from 'vuex'
import ApeUploader from '@/components/ApeUploader'


export default {
  components: {
    PageHeaderLayout,
    TreeTable,
    ModalDialog,
    ApeUploader
  },
  data() {
    return {
      loadingStaus: true,
      selectedList:[],
      dialogData:{
        visible: false,
        title: '',
        width: '24%',
        loading: true,
        modal: false
      },
      columns: [
        {
          title: 'ID',
          value: 'id',
          width: 40
        },
        {
          title: '图片',
          type: 'image',
          value: 'image_url',
          width: 60
        },
        {
          title: '分类名称',
          operation:true, // 作为展开操作列
          value: 'display_name',
          width: 180
        },
        {
          title: '分类标识',
          value: 'name'
        },
        {
          title: '备注',
          value: 'description'
        }

      ],
      // 表格列表数据
      categoryList:[],
      defaultFormData: {
        display_name:'',
        parent_id:0
      },
      // 表单结构
      formData: {},
      // 已上传文件列表
      uploadFileList:[],
      // 表单验证
      rules: {
        display_name: [{required: true, message: '输入分类名称', trigger: 'blur' }],
        name: [{required: true, message: '输入分类标识', trigger: 'blur' }],
      }
    }
  },
  computed: {
    ...mapGetters(['userPermissions','buttonType'])
  },
  methods: {
    // 响应添加按钮
    async addButton(pid) {
      if (pid) {
        this.rules.name[0].required = false
      } else {
        this.rules.name[0].required = true
      }
      this.dialogData.visible = true
      this.dialogData.title = '添加分类'
      this.formData.parent_id = pid
      this.dialogData.loading = false
    },
    // 响应编辑按钮
    async editButton(id) {
      this.dialogData.visible = true
      this.dialogData.title = '编辑分类'
      let {info} = await this.$api.getCategoryInfo(id)
      if (info.parent_id) {
        this.rules.name[0].required = false
      } else {
        this.rules.name[0].required = true
      }
      this.formData = info
      this.uploadFileList = info.image_info.id?[{id:info.image_info.id,name:info.image_info.title,url:info.image_info.full_path}]:[]
      this.dialogData.loading = false
    },
    // 相应删除按钮
    async deleteButton(id) {
      let ids = this.$refs['treeTable'].getExpandIds()
      let info = await this.$api.deleteCategoryInfo(id)
      if (info == 'ok') {
        let {list}= await this.$api.getCategoryList()
        this.categoryList=list
        this.$nextTick(() => {
          this.$refs['treeTable'].initTableExpand(ids) 
        })
        this.$message.success('删除成功!')
      } else {
        this.$message.error(info)
      }
    },
    //添加,保存
    async formSubmit() {
      let ids = this.$refs['treeTable'].getExpandIds()
      let id = await this.$api.saveCategory(this.formData)
      if (id) {
        let {list}= await this.$api.getCategoryList()
        this.categoryList=list
      }
      this.initData()
      this.$nextTick(() => {
        this.$refs['treeTable'].initTableExpand(ids) 
      })
      this.$message.success('保存成功!')
    },
    // 处理模态框，确定事件
    handleConfirm() {
      // 调用组件的数据验证方法
      this.$refs['categoryForm'].validate((valid) => {
        if (valid) {
          this.formSubmit()
        } else {
          this.$message.error('数据验证失败，请检查必填项数据！')
        }
      })
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
    // 处理模态框，关闭事件
    dialogClose() {
      this.initData()
    },
    // 初始化数据
    initData() {
      // 初始化form表单
      this.$nextTick(() => {
        this.dialogData.visible = false
        this.dialogData.loading = true
        this.formData = this.defaultFormData
        this.$refs['categoryForm'].resetFields()
        this.uploadFileList = []
      })
    },
    // 拖拽排序数据提交，请求接口
    async dragSortSubmit(orderIds) {
      let ids = this.$refs['treeTable'].getExpandIds()
      let info = await this.$api.orderCategory(orderIds)
      if (info == 'ok') {
        let {list}= await this.$api.getCategoryList()
        this.categoryList = []
        this.$nextTick(() => {
          this.categoryList=list
          this.$nextTick(() => {
            this.$refs['treeTable'].initTableExpand(ids) 
          })
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
        onEnd: evt => {
          let oldId = evt.item.querySelectorAll('.drag-handle')[0].dataset.id
          let Ids = []
          let orderIds = []
          let newList = []
          let tmp = el.querySelectorAll('.drag-handle')
          for (let i=0,len=tmp.length; i < len; i++) {
            newList[tmp[i].dataset.id] = {'parent_id':tmp[i].dataset.parent_id,'depth':tmp[i].dataset.depth}
            Ids.push(tmp[i].dataset.id)
          }
          // 处理组合实际请求后台数据
          for (let i=0,len=Ids.length; i < len; i++) {
            if ( newList[oldId].parent_id == newList[Ids[i]].parent_id && newList[oldId].depth == newList[Ids[i]].depth ) { 
              orderIds.push(Ids[i])
            }
          }
          this.dragSortSubmit(orderIds)
        },
      })
    }
  },
  async mounted() {
    let {list}= await this.$api.getCategoryList()
    this.categoryList=list
    this.loadingStaus=false
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
</style>
