<template>
  <div>
    <PageHeaderLayout>
      <div class="main-page-content">
        <el-row class="table-header">
          <el-col>
            <el-button type="primary" size="medium" icon="iconfont " v-if="userPermissions.indexOf('menu_create') != -1 && buttonType=='text'" @click="addButton(0)">添加菜单组</el-button>
            <el-tooltip effect="dark" content="添加菜单组" placement="top-start"  v-if="userPermissions.indexOf('menu_create') != -1 && buttonType=='icon'" >
              <el-button type="primary" size="medium" icon="iconfont icon-tianjiacaidan2" @click="addButton(0)"></el-button>
            </el-tooltip>
          </el-col>
        </el-row>
        <TreeTable :data="menuList" :columns="columns" :loading="loadingStaus" ref="treeTable" highlight-current-row >
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
              <el-tooltip effect="dark" content="添加子菜单" placement="top-start"  v-if="userPermissions.indexOf('menu_create') != -1" >
                <el-button size="mini" icon="iconfont icon-zengjiazicaidan" @click="addButton(scope.row.id)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="编辑" placement="top-start"  v-if="userPermissions.indexOf('menu_edit') != -1" >
                <el-button size="mini" icon="el-icon-edit" @click="editButton(scope.row.id)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top-start" >
                <span>
                  <el-popover
                    v-if="userPermissions.indexOf('menu_delete') != -1"
                    :ref="'el-popover-'+scope.$index"
                    placement="top"
                    width="150">
                    <p>确定要删除记录吗？</p>
                    <div style="text-align: right; margin: 0;">
                      <el-button type="text" size="mini" @click="$refs['el-popover-'+scope.$index].doClose()">取消</el-button>
                      <el-button type="danger" size="mini" @click="deleteButton(scope.row.id)">确定</el-button>
                    </div>
                    <el-button slot="reference" type="danger" size="mini" icon="el-icon-delete" ></el-button>
                  </el-popover>
                </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
          v-if="buttonType=='text'"
          width="200"
          label="操作">
            <template slot-scope="scope">
              <el-button size="mini" icon="iconfont" v-if="userPermissions.indexOf('menu_create') != -1" @click="addButton(scope.row.id)">添加子菜单</el-button>
              <el-button size="mini" v-if="userPermissions.indexOf('menu_edit') != -1" @click="editButton(scope.row.id)">编辑</el-button>
              <el-popover
                v-if="userPermissions.indexOf('menu_delete') != -1"
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
        <el-form :model="formData" :rules="rules" ref="menuForm" label-position="right" label-width="96px">
          <el-form-item label="菜单名称" prop="display_name">
            <el-input v-model="formData.display_name"></el-input>
          </el-form-item>
          <el-form-item label="权限绑定" prop="selectedList" ref="permissionsItem">
            <el-cascader
              placeholder="选择权限"
              :props="cascaderProps"
              :options="permissionsList"
              v-model="selectedList"
              @change="cascaderChange"
              show-all-levels
              clearable
              filterable>
            </el-cascader>
          </el-form-item>
          <el-form-item label="访问URL" prop="url">
            <el-input v-model="formData.url"></el-input>
          </el-form-item>
          <el-form-item label="ICON" prop="icon">
            <el-input v-model="formData.icon"></el-input>
          </el-form-item>
          <el-form-item label="附加内容" prop="additional">
            <el-input type="textarea" v-model="formData.additional"></el-input>
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
          width: 50
        },
        {
          title: '菜单名称',
          operation:true, // 作为展开操作列
          value: 'display_name'
        },
        {
          title: '绑定权限',
          value: 'permission_name'
        },
        {
          title: '图标',
          type: 'icon',
          value: 'icon'
        },
        {
          title: '路径URL',
          value: 'url'
        }
      ],
      // 表格列表数据
      menuList:[],
      // element的cascader的props值
      cascaderProps:{
        label:'display_name',
        value:'id',
      },
      // 权限列表
      permissionsList:[],
      // 已选中的权限列表，用于cascader组件选中效果
      selectedList:[],
      // 表单结构
      formData: {
        system_permission_id:0,
        display_name:''
      },
      // 表单验证
      rules: {
        display_name: [{required: true, message: '输入菜单名称', trigger: 'blur' }],
        url: [{required: false, message: '输入URL', trigger: 'blur' }],
        selectedList: [{required: true, message: '选择权限', trigger: 'change', validator:this.cascaderVerify}]
      },
      // 定义表格拖拽排序
      sortable: null
    }
  },
  computed: {
    ...mapGetters(['userPermissions','buttonType'])
  },
  methods: {
    // 响应添加按钮
    async addButton(pid) {
      this.dialogData.visible = true
      this.dialogData.title = pid?'添加子菜单':'添加菜单'
      this.initForm(pid)
    },
    // 响应编辑按钮
    async editButton(id) {
      this.dialogData.visible = true
      this.dialogData.title = '编辑菜单'
      let {info,menu_permissions} = await this.$api.getMenuInfo(id)
      this.formData = info
      this.initForm(info.parent_id,menu_permissions)  
    },
    // 初始化form，将添加，编辑共同数据抽取出来
    async initForm(pid,selectedPermissionsList = []) {
      this.formData.parent_id=pid
      // 获取权限列表
      let {list} = await this.$api.getMenuPermissionsList()
      this.permissionsList = list
      if (pid) {
        this.rules.selectedList[0].required = true
        this.rules.url[0].required = true
      } else {
        this.rules.selectedList[0].required = false
        this.rules.url[0].required = false
      }
      // console.log(this.formData);
      // 初始化级联菜单的选中……
      this.selectedList = selectedPermissionsList
      this.$refs['permissionsItem'].resetField()

      this.dialogData.loading = false
    },
    // form数据提交，请求接口
    async formSubmit() {
      let ids = this.$refs['treeTable'].getExpandIds()
      let id = await this.$api.saveMenu(this.formData)
      if (id) {
        let {list}= await this.$api.getMenuList()
        this.menuList=list
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
      let info = await this.$api.deleteMenu(id)
      if (info == 'ok') {
        let {list}= await this.$api.getMenuList()
        this.menuList=list
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
      this.$refs['menuForm'].validate((valid) => {
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
    // 级联菜单组件change事件
    cascaderChange(v) {
      if (v.length) {
        this.formData.system_permission_id = v[(v.length-1)]
      } else {
        this.formData.system_permission_id = 0
      }
    },
    // 级联菜单自定义验证
    cascaderVerify(rule, value, callback) {
      if (rule.required && !this.selectedList.length) {
        callback(new Error(rule.message))
      }
      callback()
    },
    // 初始化数据
    initData() {
      // 初始化form表单
      this.$nextTick(() => {
        this.dialogData.visible = false
        this.dialogData.loading = true
        this.selectedList = []
        this.formData = {
          system_permission_id:0,
          display_name:''
        }
        this.$refs['menuForm'].resetFields()
      })
    },
    // 拖拽排序数据提交，请求接口
    async dragSortSubmit(orderIds) {
      let ids = this.$refs['treeTable'].getExpandIds()
      let info = await this.$api.orderMenu(orderIds)
      if (info == 'ok') {
        let {list}= await this.$api.getMenuList()
        this.menuList = []
        this.$nextTick(() => {
          this.menuList=list
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
    let {list}= await this.$api.getMenuList()
    this.menuList=list
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
</style>
