import * as request from '@/utils/request'

export default {
  /**
   * @description 获取菜单列表
   * @author YM
   * @date 2019-01-17
   * @returns promise
   */
  getMenuList() {
    return request.post('/menu/list')
  },
  /**
   * @description 获取权限列表
   * @author YM
   * @date 2019-01-19
   * @returns promise
   */
  getMenuPermissionsList() {
    return request.post('/menu/permissions_list')
  },
  /**
   * @description 保存菜单，新建、编辑的保存都走此方法，却别是有没有主键id
   * @author YM
   * @date 2019-01-19
   * @param {*} data
   * @returns
   */
  saveMenu(data) {
    return request.post('/menu/store',data)
  },
  /**
   * @description 根据id获取单条信息，编辑使用
   * @author YM
   * @date 2019-01-19
   * @param {*} data
   * @returns
   */
  getMenuInfo(id) {
    let data = {id:id}
    return request.post('/menu/get_info',data)
  },
  /**
   * @description 根据id删除单条信息
   * @author YM
   * @date 2019-01-19
   * @param {*} data
   * @returns
   */
  deleteMenu(id) {
    let data = {id:id}
    return request.post('/menu/delete',data)
  },
  /**
   * @description 相同层级菜单排序
   * @author YM
   * @date 2019-01-19
   * @param {*} data
   * @returns
   */
  orderMenu(ids) {
    let data = {ids:ids}
    return request.post('/menu/order',data)
  },

}