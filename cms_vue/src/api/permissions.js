import * as request from '@/utils/request'

export default {
  /**
   * @description 获取权限列表
   * @author YM
   * @date 2019-01-17
   * @returns promise
   */
  getPermissionsList() {
    return request.post('/permissions/list')
  },
  /**
   * @description 保存权限，新建、编辑的保存都走此方法，却别是有没有主键id
   * @author YM
   * @date 2019-01-19
   * @param {*} data
   * @returns
   */
  savePermissions(data) {
    return request.post('/permissions/store',data)
  },
  /**
   * @description 根据id获取单条信息，编辑使用
   * @author YM
   * @date 2019-01-19
   * @param {*} data
   * @returns
   */
  getPermissionsInfo(id) {
    let data = {id:id}
    return request.post('/permissions/get_info',data)
  },
  /**
   * @description 根据id删除单条信息
   * @author YM
   * @date 2019-01-19
   * @param {*} data
   * @returns
   */
  deletePermissions(id) {
    let data = {id:id}
    return request.post('/permissions/delete',data)
  },
  /**
   * @description 相同层级权限排序
   * @author YM
   * @date 2019-01-19
   * @param {*} data
   * @returns
   */
  orderPermissions(ids) {
    let data = {ids:ids}
    return request.post('/permissions/order',data)
  }
}