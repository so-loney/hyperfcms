import * as request from '@/utils/request'

export default {
  /**
   * @description 获取用户列表
   * @author YM
   * @date 2019-01-17
   * @returns promise
   */
  getUserList(data) {
    return request.post('/user/list',data)
  },
  /**
   * @description 保存权限，新建、编辑的保存都走此方法，却别是有没有主键id
   * @author YM
   * @date 2019-01-19
   * @param {*} data
   * @returns
   */
  saveUser(data) {
    return request.post('/user/store',data)
  },
  /**
   * @description 根据id获取单条信息，编辑使用
   * @author YM
   * @date 2019-01-28
   */
  getUserInfo(id) {
    let data = {id:id}
    return request.post('/user/get_info',data)
  },
  /**
   * @description 根据id删除单条信息
   * @author YM
   * @date 2019-01-19
   * @param {*} data
   * @returns
   */
  deleteUser(id) {
    let data = {id:id}
    return request.post('/user/delete',data)
  }, 
  /**
  * @description 用户绑定用户组，获取信息
  * @author YM
  * @date 2019-01-26
  * @returns 
  */
 getUserRoles() {
   return request.post('/user/get_roles')
 }
}