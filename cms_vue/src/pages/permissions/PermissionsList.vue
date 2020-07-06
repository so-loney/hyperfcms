<template>
  <div>
    <PageHeaderLayout>
      <div class="main-page-content">
        <el-row class="table-header">
          <el-col>
            <el-tooltip effect="dark" content="添加权限组" placement="top-start"  v-if="userPermissions.indexOf('permissions_create') != -1 && buttonType=='icon'" >
              <el-button type="primary" size="medium" icon="iconfont icon-tianjiacaidan2" @click="addButton(0)"></el-button>
            </el-tooltip>
            <el-button type="primary" size="medium" icon="iconfont " v-if="userPermissions.indexOf('permissions_create') != -1 && buttonType=='text'" @click="addButton(0)">添加权限组</el-button>
          </el-col>
        </el-row>
        <TreeTable :data="permissionsList" :columns="columns" :loading="loadingStaus" ref="treeTable" highlight-current-row border>
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
              <el-tooltip effect="dark" content="添加子权限" placement="top-start"  v-if="userPermissions.indexOf('permissions_create') != -1" >
                <el-button size="mini" icon="iconfont icon-zengjiazicaidan" @click="addButton(scope.row.id,scope.row.name)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="编辑" placement="top-start"  v-if="userPermissions.indexOf('permissions_edit') != -1" >
                <el-button size="mini" icon="el-icon-edit" @click="editButton(scope.row.id,scope.row.parent)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top-start">
                <span>
                  <el-popover
                    v-if="userPermissions.indexOf('permissions_delete') != -1"
                    :ref="'el-popover-'+scope.$index"
                    placement="top"
                    width="150">
                    <p>确定要删除记录吗？</p>
                    <div style="text-align: right; margin: 0;">
                      <el-button type="text" size="mini" @click="$refs['el-popover-'+scope.$index].doClose()">取消</el-button>
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
              <el-button size="mini" icon="iconfont" v-if="userPermissions.indexOf('permissions_create') != -1" @click="addButton(scope.row.id,scope.row.name)">添加子权限</el-button>
              <el-button size="mini" v-if="userPermissions.indexOf('permissions_edit') != -1" @click="editButton(scope.row.id,scope.row.parent)">编辑</el-button>
              <el-popover
                v-if="userPermissions.indexOf('permissions_delete') != -1"
                :ref="'el-popover-'+scope.$index"
                placement="top"
                width="150">
                <p>确定要删除记录吗？</p>
                <div style="text-align: right; margin: 0;">
                  <el-button type="text" size="mini" @click="$refs['el-popover-'+scope.$index].doClose()">取消</el-button>
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
        <el-form :model="formData" :rules="rules" ref="permissionsForm" label-position="right" label-width="96px">
          <el-form-item label="权限名称" prop="display_name">
            <el-input v-model="formData.display_name"></el-input>
          </el-form-item>
          <el-form-item label="权限标识" prop="name">
            <el-input v-model="formData.name">
              <template slot="prepend" v-if="isInherit && handleChild">{{namePrefix}}</template>
              <el-button slot="append" v-if="handleChild" type="danger" @click="toggleInput">{{isInherit?'自定义':'继承父级'}}</el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="作用路由" prop="effect_uri">
            <el-input type="textarea" v-model="formData.effect_uri"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="description">
            <el-input type="textarea" v-model="formData.description"></el-input>
          </el-form-item>
        </el-form>        
      </template>
    </ModalDialog>
  </div >
</template>

<script>
import PageHeaderLayout from '@/layouts/PageHeaderLayout'
import TreeTable from '@/components/TreeTable'
import ModalDialog from '@/components/ModalDialog'
import Sortable from 'sortablejs'
import { mapGetters } from 'vuex'

export default {
  components: {
    PageHeaderLayout,
    TreeTable,
    ModalDialog
  },
  data() {
    return {
      loadingStaus: true,
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
          width: 60
        },
        {
          title: '权限名称',
          operation:true, // 作为展开操作列
          value: 'display_name',
          width: 180
        },
        {
          title: '权限标识',
          value: 'name'
        },
         {
          title: '作用路由',
          value: 'effect_uri_alias',
          value_alias: 'effect_uri'
        },
        {
          title: '备注',
          value: 'description'
        }
      ],
      // 表格列表数据
      permissionsList:[],
      // 表单结构
      formData: {
        display_name:''
      },
      // 表单验证
      rules: {
        display_name: [{required: true, message: '输入权限名称', trigger: 'blur' }],
        name: [{required: true, message: '输入权限标识', trigger: 'blur' }],
      },
      // 定义权限标识输入方式，是否继成
      // 在添加修改子权限时候生效
      isInherit: true,
      namePrefix: '',
      handleChild: false,
      // 定义表格拖拽排序
      sortable: null
    }
  },
  computed: {
    ...mapGetters(['userPermissions','buttonType'])
  },
  methods: {
    // 响应添加按钮
    async addButton(pid,name) {
      // 添加子权限，拼接的前缀
      if (name) {
        this.namePrefix = name+'_'
      }
      this.dialogData.visible = true
      this.dialogData.title = pid?'添加子权限':'添加权限'
      this.initForm(pid)
    },
    // 响应编辑按钮
    async editButton(id,parent) {
      this.dialogData.visible = true
      this.dialogData.title = '编辑权限'
      let {info} = await this.$api.getPermissionsInfo(id)
      this.formData = info
      // 编辑子权限，拼接的前缀
      if (parent) {
        this.namePrefix = parent.name+'_'
      }
      this.isInherit = false      
      this.initForm(info.parent_id)  
    },
    // 初始化form，将添加，编辑共同数据抽取出来
    async initForm(pid) {
      this.formData.parent_id=pid
      this.dialogData.loading = false
      if (pid) {
        this.handleChild = true
      } else {
        this.handleChild = false
      }
    },
    // 切换权限标识的输入方式，继成父级、自定义
    toggleInput() {
      this.isInherit = !this.isInherit
    },
    // form数据提交，请求接口
    async formSubmit() {
      let ids = this.$refs['treeTable'].getExpandIds()
      // 权限标识，如果需要拼接前缀，处理数据
      if (this.isInherit && this.handleChild) {
        this.formData.name = this.namePrefix+this.formData.name
      }
      
      let id = await this.$api.savePermissions(this.formData)
      if (id) {
        let {list}= await this.$api.getPermissionsList()
        this.permissionsList=list
      }
      this.initData()
      this.$nextTick(() => {
        this.$refs['treeTable'].initTableExpand(ids) 
      })
      this.$message.success('保存成功!')
    },
    // 相应删除按钮
    async deleteButton(id) {
      let ids = this.$refs['treeTable'].getExpandIds()
      let info = await this.$api.deletePermissions(id)
      if (info == 'ok') {
        let {list}= await this.$api.getPermissionsList()
        this.permissionsList=list
        this.$nextTick(() => {
          this.$refs['treeTable'].initTableExpand(ids) 
        })
        this.$message.success('删除成功!')
      } else {
        this.$message.error(info)
      }
      
    },
    // 处理模态框，确定事件
    handleConfirm() {
      // 调用组件的数据验证方法
      this.$refs['permissionsForm'].validate((valid) => {
        if (valid) {
          this.formSubmit()
        } else {
          this.$message.error('数据验证失败，请检查必填项数据！')
        }
      })
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
        this.isInherit= true
        this.namePrefix= ''
        this.formData = {
          display_name:''
        }
        this.$refs['permissionsForm'].resetFields()
      })
    },
    // 拖拽排序数据提交，请求接口
    async dragSortSubmit(orderIds) {
      let ids = this.$refs['treeTable'].getExpandIds()
      let info = await this.$api.orderPermissions(orderIds)
      if (info == 'ok') {
        let {list}= await this.$api.getPermissionsList()
        this.permissionsList = []
        this.$nextTick(() => {
          this.permissionsList = list
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
    let {list}= await this.$api.getPermissionsList()
    this.permissionsList=list
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
