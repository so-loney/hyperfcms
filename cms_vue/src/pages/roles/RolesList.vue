<template>
  <div >
    <router-view v-show="this.$route.matched.length==3"></router-view>
    <PageHeaderLayout v-show="this.$route.matched.length==2">
      <div class="main-page-content">
        <el-row class="table-header">
          <el-col>
            <el-tooltip effect="dark" content="添加角色" placement="top-start"  v-if="userPermissions.indexOf('roles_create') != -1 && buttonType=='icon'" >
              <el-button type="primary" size="medium" icon="iconfont icon-tianjiacaidan2" @click="addButton(0)"></el-button>
            </el-tooltip>
            <el-button type="primary" size="medium" icon="iconfont" v-if="userPermissions.indexOf('roles_create') != -1 && buttonType=='text'" @click="addButton(0)">添加角色</el-button>
          </el-col>
        </el-row>
        <ApeTable ref="apeTable" :data="rolesList" :columns="columns" :loading="loadingStaus" :pagingData="pagingData" @switchPaging="switchPaging" highlight-current-row>
          <el-table-column
          v-if="buttonType=='icon'"
          label="操作">
            <template slot-scope="scope">
              <span v-if="scope.row.id !== 1">
                <el-tooltip effect="dark" content="编辑" placement="top-start"  v-if="userPermissions.indexOf('roles_edit') != -1" >
                  <el-button size="mini" icon="el-icon-edit" @click="editButton(scope.row.id)"></el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="权限绑定" placement="top-start"  v-if="userPermissions.indexOf('roles_permissions') != -1" >
                  <el-button size="mini" icon="iconfont icon-access_give" @click="permissionsBinding(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="成员管理" placement="top-start"  v-if="userPermissions.indexOf('roles_users') != -1" >
                  <el-button size="mini" icon="iconfont icon-chengyuanguanli4" @click="manageMembers(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="删除" placement="top-start">
                  <span>
                    <el-popover
                      v-if="userPermissions.indexOf('roles_delete') != -1"
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
              <span v-else>
                <el-tooltip placement="top" v-if="userPermissions.indexOf('roles_edit') != -1 || userPermissions.indexOf('roles_permissions') != -1" >
                  <div slot="content">系统内置禁止操作</div>
                  <el-button circle type="warning" size="mini" icon="iconfont icon-jinggao"></el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="成员管理" placement="top-start"  v-if="userPermissions.indexOf('roles_users') != -1" >
                  <el-button size="mini" icon="iconfont icon-chengyuanguanli4" @click="manageMembers(scope.row)"></el-button>
                </el-tooltip>
              </span>
            </template>
          </el-table-column>
          <el-table-column
          v-if="buttonType=='text'"
          width="300"
          label="操作">
            <template slot-scope="scope">
              <span v-if="scope.row.id !== 1">
                <el-button size="mini" v-if="userPermissions.indexOf('roles_edit') != -1" @click="editButton(scope.row.id)">编辑</el-button>
                <el-button size="mini" v-if="userPermissions.indexOf('roles_permissions') != -1" @click="permissionsBinding(scope.row)">权限绑定</el-button>
                <el-button size="mini" v-if="userPermissions.indexOf('roles_users') != -1" @click="manageMembers(scope.row)">用户绑定</el-button>
                  <el-popover
                    v-if="userPermissions.indexOf('roles_delete') != -1"
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
              <span v-else>
                <el-tooltip placement="top" v-if="userPermissions.indexOf('roles_edit') != -1 || userPermissions.indexOf('roles_permissions') != -1" >
                  <div slot="content">系统内置禁止操作</div>
                  <el-button circle type="warning" size="mini" icon="iconfont icon-jinggao"></el-button>
                </el-tooltip>
                <el-button size="mini"  v-if="userPermissions.indexOf('roles_users') != -1" @click="manageMembers(scope.row)">用户绑定</el-button>
              </span>
            </template>
          </el-table-column>
        </ApeTable>
      </div>
    </PageHeaderLayout>
    
    <ModalDialog :dialogData="dialogData" @dialogConfirm="handleConfirm" @dialogClose="dialogClose">
      <template slot="content">
        <el-form :model="formData" :rules="rules" ref="rolesForm" label-position="right" label-width="96px">
          <el-form-item label="角色名称" prop="display_name">
            <el-input v-model="formData.display_name"></el-input>
          </el-form-item>
          <el-form-item label="角色标识" prop="name">
            <el-input v-model="formData.name"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="description">
            <el-input type="textarea" v-model="formData.description"></el-input>
          </el-form-item>
        </el-form>        
      </template>
    </ModalDialog>

    <ApeDrawer :drawerData="drawerData"  @drawerClose="drawerClose" @drawerConfirm="drawerConfirm">
      <template slot="ape-drawer">
        <div class="drawer-roles-premissions">
          <el-popover
            trigger="hover"
            placement="bottom"
            width="150"
            v-for="v in permissionsList"
            :key="v.id">
            <div class="permissions-checked" slot="reference" >
              <el-checkbox :indeterminate="checkedIndeterminate(v)" v-model="v.checked_status" @change="handleCheckAll(v)">全选</el-checkbox><span class="permissions-group-name">{{v.display_name}}</span>
            </div>
            <el-checkbox-group v-model="rolePermissions[v.id]" >
              <el-checkbox v-for="v in v.children" :label="v.id" :key="v.id">{{v.display_name}}</el-checkbox>
            </el-checkbox-group>
          </el-popover>
        </div>
      </template>
    </ApeDrawer>
  </div >
</template>

<script>
import PageHeaderLayout from '@/layouts/PageHeaderLayout'
import ApeTable from '@/components/ApeTable'
import ModalDialog from '@/components/ModalDialog'
import ApeDrawer from '@/components/ApeDrawer'
import { mapGetters } from 'vuex'

export default {
  components: {
    PageHeaderLayout,
    ApeTable,
    ModalDialog,
    ApeDrawer
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
          width: 80
        },
        {
          title: '角色名称',
          value: 'display_name',
          width: 240
        },
        {
          title: '角色标识',
          value: 'name'
        },
        {
          title: '备注',
          value: 'description'
        }

      ],
      // 表格列表数据
      rolesList:[],
      // 分页信息
      pagingData:{
        is_show: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        page_size: 10,
        total: 0
      },
      // 表单结构
      formData: {
        display_name:''
      },
      // 表单验证
      rules: {
        display_name: [{required: true, message: '输入角色名称', trigger: 'blur' }],
        name: [{required: true, message: '输入角色标识', trigger: 'blur' }],
      },
      // 抽屉数据
      drawerData: {
        visible: false,
        loading: true,
        loading_text: '玩命加载中……',
        // direction: 'right',
        title: '权限绑定',
        width_height: '680px',
        // mask: false,
        // close_name: '关 闭',
        // confirm_name: '打 印',
      },
      permissionsList: [],
      rolePermissions: [],
      currentRoleId: null
      
    }
  },
  computed: {
    ...mapGetters(['userPermissions','buttonType'])
  },
  methods: {
    // 切换页码操作
    async switchPaging() {
      this.loadingStaus=true
      let pagingInfo = this.$refs['apeTable'].getPagingInfo()
      let {list,pages}= await this.$api.getRolesList(pagingInfo)
      this.pagingData.total = pages.total
      this.rolesList=list
      this.loadingStaus=false
    },
    // 响应添加按钮
    async addButton() {
      this.dialogData.visible = true
      this.dialogData.title = '添加角色'
      this.dialogData.loading = false
    },
    // 响应编辑按钮
    async editButton(id) {
      this.dialogData.visible = true
      this.dialogData.title = '编辑角色'
      let {info} = await this.$api.getRolesInfo(id)
      this.formData = info
      this.dialogData.loading = false
    },
    // form数据提交，请求接口
    async formSubmit() {
      let id = await this.$api.saveRoles(this.formData)
      if (id) {
        let {list}= await this.$api.getRolesList()
        this.rolesList=list
      }
      this.initFormData()
      this.$message.success('保存成功!')
    },
    // 相应删除按钮
    async deleteButton(id) {
      let info = await this.$api.deleteRoles(id)
      if (info == 'ok') {
        let {list}= await this.$api.getRolesList()
        this.rolesList=list
        this.$message.success('删除成功!')
      } else {
        this.$message.error(info)
      }
      
    },
    // 处理模态框，确定事件
    handleConfirm() {
      // 调用组件的数据验证方法
      this.$refs['rolesForm'].validate((valid) => {
        if (valid) {
          this.formSubmit()
        } else {
          this.$message.error('数据验证失败，请检查必填项数据！')
        }
      })
    },
    // 处理模态框，关闭事件
    dialogClose() {
      this.initFormData()
    },
    // 初始化数据
    initFormData() {
      // 初始化form表单
      this.$nextTick(() => {
        this.dialogData.visible = false
        this.dialogData.loading = true
        this.formData = {
          display_name:''
        }
        this.$refs['rolesForm'].resetFields()
      })
    },
    // 权限绑定
    async permissionsBinding(row) {
      this.drawerData.loading_text = '玩命加载中……'
      this.drawerData.visible = true
      this.currentRoleId = row.id
      this.drawerData.title = '权限绑定'+'（ID'+row.id+'-'+row.display_name+'-'+row.name+'）'
      let {permissions_list,role_permissions} = await this.$api.getRolesPermissions(row.id)
      this.permissionsList = permissions_list
      this.rolePermissions = role_permissions
      this.$nextTick(() => {
        this.drawerData.loading = false
      })
    },
    // 每一个权限组的全选状态
    checkedIndeterminate(v) {
      v.checked_status = false
      if (typeof(this.rolePermissions[v.id])==='undefined') {
        return false
      }
      if  (this.rolePermissions[v.id].length < v.children.length && this.rolePermissions[v.id].length > 0) {
        return true
      }
      if (this.rolePermissions[v.id].length == v.children.length) {
        v.checked_status = true
      }
      return false
    },
    // 处理点击每个组的全选
    handleCheckAll(v) {
      if (v.checked_status) {
        this.rolePermissions[v.id] = v.children.map((val)=>{return val.id})
      } else {
        this.rolePermissions[v.id] = []
      }
    },
    // 处理抽屉关闭
    drawerClose() {
      this.drawerData.visible = false
      this.drawerData.loading = true
      this.permissionsList = []
      this.rolePermissions = []
    },
    // 处理抽屉确认
    async drawerConfirm() {
      this.drawerData.loading_text = '玩命提交中……'
      this.drawerData.loading = true
      let params = {
        role_id: this.currentRoleId,
        permissions_id: this.rolePermissions
      }
      await this.$api.saveRolesPermissions(params)
      this.$nextTick(() => {
        this.drawerData.visible = false
      })
      this.$nextTick(() => {
        this.$message.success('保存成功!')
      })
    },
    // 管理成员
    manageMembers(row) {
      this.$router.push(this.$route.path+'/'+row.id+'/manage-members')
    }
  },
  async mounted() {
    let pagingInfo = this.$refs['apeTable'].getPagingInfo()
    let {list,pages}= await this.$api.getRolesList(pagingInfo)
    this.rolesList=list
    this.pagingData.total = pages.total
    this.loadingStaus=false
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
  .permissions-group-name
    padding-left 10px
    cursor pointer
  .permissions-checked
    width 144px
    display inline-block;
    height 40px;
    line-height 40px;
    padding 0 12px 0 12px
    box-sizing border-box
    margin 8px 12px 0 0
    border 1px solid #e8e8e8 
    border-radius 5px
    font-size 14px
    overflow hidden
    .el-checkbox
      margin-right 0px
  .el-popover .el-checkbox-group .el-checkbox
    margin-left 0px
    margin-right 12px
</style>
