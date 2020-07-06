<template>
  <div>
    <PageHeaderLayout>
      <div class="main-page-content">
        <el-row class="table-header">
          <el-col>
            <el-tooltip effect="dark" content="添加用户" placement="top-start"  v-if="userPermissions.indexOf('user_create') != -1 && buttonType=='icon'" >
              <el-button type="primary" size="medium" icon="iconfont icon-tianjiacaidan2" @click="addButton(0)"></el-button>
            </el-tooltip>
            <el-button type="primary" size="medium"  v-if="userPermissions.indexOf('user_create') != -1 && buttonType=='text'" @click="addButton(0)">添加</el-button>
          </el-col>
        </el-row>
        <el-row class="table-search">
          <el-form size="medium" :inline="true" :model="searchCondition" class="demo-form-inline">
            <el-form-item label="用户名">
              <el-input v-model="searchCondition.username" placeholder="输入用户名" clearable></el-input>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="searchCondition.mobile" placeholder="输入手机号" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchButton">查询</el-button>
            </el-form-item>
          </el-form>
        </el-row>
        <ApeTable ref="apeTable" :data="userList" :columns="columns" :loading="loadingStaus" :pagingData="pagingData" @switchPaging="switchPaging" highlight-current-row>
          <el-table-column
            slot="first-column"
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
              <el-tooltip effect="dark" content="编辑" placement="top-start"  v-if="userPermissions.indexOf('user_edit') != -1" >
                <el-button size="mini" icon="el-icon-edit" @click="editButton(scope.row.id)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top-start">
                <span>
                  <el-popover
                    v-if="userPermissions.indexOf('user_delete') != -1"
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
              <span>
                <el-button size="mini"  v-if="userPermissions.indexOf('user_edit') != -1" @click="editButton(scope.row.id)">编辑</el-button>
                <el-popover
                  v-if="userPermissions.indexOf('user_delete') != -1"
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
        <el-form :model="formData" :rules="rules" ref="userForm" label-position="right" label-width="96px">
          <el-row>
            <el-col :span="22">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="formData.username"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="昵称" prop="nickname">
                <el-input v-model="formData.nickname"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="手机号" prop="mobile">
                <el-input v-model="formData.mobile"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="Email" prop="email">
                <el-input v-model="formData.email"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="工号" prop="job_number">
                <el-input v-model="formData.job_number"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="密码" prop="password">
                <el-input v-model="formData.password"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="角色绑定" prop="user_roles">
                <el-select v-model="formData.user_roles" multiple filterable clearable placeholder="请选择">
                  <el-option
                    v-for="item in rolesList"
                    :key="item.id"
                    :label="item.display_name"
                    :value="item.id">
                  </el-option>
                </el-select>
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
import { mapGetters } from 'vuex'

export default {
  components: {
    PageHeaderLayout,
    ApeTable,
    ApeDrawer
  },
  data() {
    return {
      // 搜索条件
      searchCondition:{},
      loadingStaus: true,
      columns: [
        {
          title: '用户名',
          value: 'username',
          width: 240
        },
        {
          title: '昵称',
          value: 'nickname'
        },
        {
          title: '手机号',
          value: 'mobile'
        },
        {
          title: '邮箱',
          value: 'email'
        },
        {
          title: '工号',
          value: 'job_number'
        },

      ],
      // 表格列表数据
      userList:[],
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
        user_roles: []
      },
      // 表单验证
      rules: {
        mobile: [
          {required: true, message: '输入手机号', trigger: 'blur' },
          {pattern: this.$utils.regular.mobile,message:'手机号格式错误', trigger: 'blur' }
        ],
        username: [
          {pattern: this.$utils.regular.enNum0to20,message:'用户名格式0-20位英文数字', trigger: 'blur' }
        ],
      },
      // 抽屉数据
      drawerData: {
        visible: false,
        loading: true,
        loading_text: '玩命加载中……',
        // direction: 'right',
        title: '权限绑定',
        width_height: '480px',
        // mask: false,
        // close_name: '关 闭',
        // confirm_name: '打 印',
      },
      rolesList: [],
      userRoles: []
      
    }
  },
  computed: {
    ...mapGetters(['userPermissions','buttonType'])
  },
  methods: {
    // 搜索
    searchButton() {
      this.initUserList()
    },
    // 切换页码操作
    async switchPaging() {
      this.initUserList()
    },
    // 响应添加按钮
    async addButton() {
      this.drawerData.loading_text = '玩命加载中……'
      this.drawerData.visible = true
      this.drawerData.title = '添加用户'
      let list = await this.$api.getUserRoles()
      this.rolesList = list
      this.$nextTick(() => {
        this.drawerData.loading = false
      })
    },
    // 响应编辑按钮
    async editButton(id) {
      this.drawerData.loading_text = '玩命加载中……'
      this.drawerData.visible = true
      this.drawerData.title = '编辑用户(UID：'+id+')'
      let list = await this.$api.getUserRoles()
      this.rolesList = list
      let {info} = await this.$api.getUserInfo(id)
      this.formData = info
      this.drawerData.loading = false
    },
    // 处理抽屉关闭
    drawerClose() {
      this.initFormData()
      this.drawerData.visible = false
      this.drawerData.loading = true
      this.rolesList = []
    },
    // 处理抽屉确认
    async drawerConfirm() {
      // 调用组件的数据验证方法
      this.$refs['userForm'].validate((valid) => {
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
      let id = await this.$api.saveUser(this.formData)
      this.$nextTick(() => {
        this.drawerData.visible = false
      })
      this.$nextTick(async () => {
        if (id) {
          this.initUserList()
        }
      })
      this.$nextTick(() => {
        this.$message.success('保存成功!')
      })
      this.initFormData()
    },
    // 相应删除按钮
    async deleteButton(id) {
      let info = await this.$api.deleteUser(id)
      if (info == 'ok') {
        this.$nextTick(async () => {
          this.initUserList('del')
        })
      } else {
        this.$message.error(info)
      }
      
    },
    // 初始化数据
    initFormData() {
      // 初始化form表单
      this.$nextTick(() => {
        this.formData = {user_roles: []}
        this.$refs['userForm'].resetFields()
      })
    },
    // 初始化用户列表
    async initUserList(type) {
      this.loadingStaus=true
      let pagingInfo = this.$refs['apeTable'].getPagingInfo(type)
      let searchCondition = this.searchCondition
      // 合并
      Object.assign(searchCondition,pagingInfo)
      let {list,pages}= await this.$api.getUserList(searchCondition)
      this.userList=list
      this.pagingData.total = pages.total
      this.offset = pages.offset
      this.loadingStaus=false
    }
  },
  mounted() {
    this.initUserList()
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
    width 300px
</style>
