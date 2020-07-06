import * as request from '@/utils/request'

export default {
  /**
   * @description 获取角色列表
   * @author YM
   * @date 2019-01-17
   * @returns promise
   */
  getRolesList(data) {
    return request.post('/roles/list',data)
  },
  /**
   * @description 保存权限，新建、编辑的保存都走此方法，却别是有没有主键id
   * @author YM
   * @date 2019-01-19
   * @param {*} data
   * @returns
   */
  saveRoles(data) {
    return request.post('/roles/store',data)
  },
  /**
   * @description 根据id获取单条信息，编辑使用
   * @author YM
   * @date 2019-01-19
   * @param {*} data
   * @returns
   */
  getRolesInfo(id) {
    let data = {id:id}
    return request.post('/roles/get_info',data)
  },
  /**
   * @description 根据id删除单条信息
   * @author YM
   * @date 2019-01-19
   * @param {*} data
   * @returns
   */
  deleteRoles(id) {
    let data = {id:id}
    return request.post('/roles/delete',data)
  },
  /**
   * @description 角色权限绑定，获取信息
   * @author YM
   * @date 2019-01-26
   * @param {*} id 角色id
   * @returns 
   */
  getRolesPermissions(id) {
    let data = {id:id}
    return request.post('/roles/get_permissions',data)
  },
  /**
   * @description 保存角色对应的权限
   * @author YM
   * @date 2019-01-26
   * @param {*} data
   * @returns 
   */
  saveRolesPermissions(data) {
    return request.post('/roles/save_permissions',data)
  },
   /**
   * @description 获取角色用户列表
   * @author YM
   * @date 2019-01-17
   * @returns promise
   */
  getRolesUser(data) {
    return request.post('/roles/get_users',data)
  },
  /**
   * @description 用户组添加成员，用户搜索，qs请求参数
   * @author YM
   * @date 2019-01-31
   * @param {*} qs 请求参数
   * @param {*} rId 角色id
   * @returns 
   */
  rolesSearchUser(qs,rId){
    let data = {search:qs,role_id:rId}
    return request.post('/roles/search_user',data)
  },
  /**
   * @description 为角色添加用户
   * @author YM
   * @date 2019-01-31
   * @param {*} data
   * @returns 
   */
  saveRolesUser(data){
    return request.post('/roles/save_user',data)
  },
  /**
   * @description 为角色移除用户
   * @author YM
   * @date 2019-01-31
   * @param {*} data
   * @returns 
   */
  removeRolesUser(data) {
    return request.post('/roles/remove_user',data)
  }
}