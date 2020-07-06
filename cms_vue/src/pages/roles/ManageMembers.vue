<template>
  <div>
    <PageHeaderLayout>
      <div class="main-page-content">
        <el-row class="table-header">
          <el-col v-if="buttonType=='icon'">
            <el-tooltip effect="dark" content="添加成员" placement="top-start" v-if="userPermissions.indexOf('roles_users') != -1" >
              <el-button type="primary" size="medium" icon="iconfont icon-tianjiacaidan2" @click="addButton(0)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="返回" placement="top-start">
              <el-button class="fanhui-button" type="primary" size="medium" icon="iconfont icon-fanhui4" @click="returnRolesList"></el-button>
            </el-tooltip>
          </el-col>
          <el-col v-if="buttonType=='text'">
            <el-button type="primary" size="medium" v-if="userPermissions.indexOf('roles_users') != -1" @click="addButton(0)">添加成员</el-button>
            <el-button class="fanhui-button" type="primary" size="medium" @click="returnRolesList">返回</el-button>
          </el-col>
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
              <el-tooltip effect="dark" content="移除成员" placement="top-start">
                <span>
                  <el-popover
                    v-if="userPermissions.indexOf('roles_users') != -1"
                    placement="top"
                    width="150"
                    v-model="scope.row.visible">
                    <p>确定移除该用户吗？</p>
                    <div style="text-align: right; margin: 0;">
                      <el-button type="text" size="mini" @click="scope.row.visible=false">取消</el-button>
                      <el-button type="danger" size="mini" @click="removeButton(scope.row)">确定</el-button>
                    </div>
                    <el-button slot="reference" type="danger" size="mini" icon="iconfont icon-yichu-"></el-button>
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
                <el-popover
                  v-if="userPermissions.indexOf('roles_users') != -1"
                  placement="top"
                  width="150"
                  v-model="scope.row.visible">
                  <p>确定移除该用户吗？</p>
                  <div style="text-align: right; margin: 0;">
                    <el-button type="text" size="mini" @click="scope.row.visible=false">取消</el-button>
                    <el-button type="danger" size="mini" @click="removeButton(scope.row)">确定</el-button>
                  </div>
                  <el-button slot="reference" type="danger" size="mini">移除成员</el-button>
                </el-popover>
              </span>
            </template>
          </el-table-column>
        </ApeTable>
      </div>
    </PageHeaderLayout>

    <ModalDialog :dialog-data="dialogData" @dialogConfirm="handleConfirm" @dialogClose="dialogClose">
      <template slot="content">
        <el-form :model="formData" :rules="rules" ref="rolesUserForm" label-position="right" label-width="80px">
          <el-form-item label="选择用户" prop="mobile">
            <el-autocomplete
              v-model="formData.mobile"
              :fetch-suggestions="searchUser"
              placeholder="输入手机号检索用户"
              @select="handleUserSelect"
              @clear="initMobileVerify"
              clearable>
            </el-autocomplete>
          </el-form-item>
        </el-form>        
      </template>
    </ModalDialog>
  </div >
</template>

<script>
import PageHeaderLayout from '@/layouts/PageHeaderLayout'
import ApeTable from '@/components/ApeTable'
import ModalDialog from '@/components/ModalDialog'
import { mapGetters } from 'vuex'

export default {
  components: {
    PageHeaderLayout,
    ApeTable,
    ModalDialog
  },
  data() {
    return {
      loadingStaus: true,
      dialogData:{
        visible: false,
        title: '',
        width: '360px',
        loading: true,
        loading_text: '',
        modal: true
      },
      columns: [
        {
          title: '昵称',
          value: 'nickname'
        },
        {
          title: '手机号',
          value: 'mobile'
        }
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
      formData: {user_id:''},
      // 表单验证
      rules: {
        mobile: [
          {required: true, message: '选择用户', trigger: 'blur', validator:this.autocompleteVerify },
        ],
      },
    }
  },
  computed: {
    ...mapGetters(['userPermissions','buttonType'])
  },
  methods: {
    // 切换页码操作
    async switchPaging() {
      this.initUserList()
    },
    // 响应添加按钮
    async addButton() {
      this.dialogData.visible = true
      this.dialogData.title = '添加成员'
      this.dialogData.loading = false
    },
    // 搜索用户,qs请求参数，cb回调函数，详见组件用法
    async searchUser(qs, cb) {
      let roleId = this.$route.params.role_id
      let list = await this.$api.rolesSearchUser(qs,roleId)
      cb(list)
    },
    // 处理搜索结果的选中
    handleUserSelect(item) {
      this.formData.user_id = item.id
      this.formData.role_id = this.$route.params.role_id
      if (this.formData.user_id) {
        this.$refs['rolesUserForm'].validateField('mobile')
      }
    },
    // 初始化验证
    initMobileVerify() {
      this.formData.user_id = ''
      this.$refs['rolesUserForm'].validateField('mobile')
    },
    // 处理模态框，确定事件
    handleConfirm() {
      // 调用组件的数据验证方法
      this.$refs['rolesUserForm'].validate((valid) => {
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
    // form数据提交，请求接口
    async formSubmit() {
      this.dialogData.loading_text = '玩命提交中……'
      this.dialogData.loading = true
      await this.$api.saveRolesUser(this.formData)
      this.$nextTick(() => {
        this.dialogData.visible = false
      })
      this.$nextTick(async () => {
          this.initUserList()
      })
      this.$nextTick(() => {
        this.$message.success('保存成功!')
      })
      this.initFormData()
    },
    // 相应移除按钮
    async removeButton(row) {
      let data = {role_id:this.$route.params.role_id,user_id:row.id}
      let info = await this.$api.removeRolesUser(data)
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
        this.dialogData.visible = false
        this.dialogData.loading = true
        this.formData = {user_id:''}
        this.$refs['rolesUserForm'].resetFields()
      })
    },
    // 初始化用户列表
    async initUserList(type) {
      this.loadingStaus=true
      let pagingInfo = this.$refs['apeTable'].getPagingInfo(type)
      // 实现对量合并
      Object.assign(pagingInfo,this.$route.params)
      let {list,pages}= await this.$api.getRolesUser(pagingInfo)
      this.userList=list
      this.pagingData.total = pages.total
      this.offset = pages.offset
      this.loadingStaus=false
    },
    // 搜索用户，自动补全验证
    autocompleteVerify(rule, value, callback) {
      if (rule.required && (!this.formData.user_id || !this.formData.mobile) ) {
        callback(new Error(rule.message))
      }
      callback()
    },
    // 返回角色列表
    returnRolesList() {
      this.$router.push(this.$route.matched[1].path)
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
  .fanhui-button
    float right 
</style>
