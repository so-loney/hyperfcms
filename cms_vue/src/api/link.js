import * as request from '@/utils/request'

export default {
  /**
   * @description 获取友情链接列表
   * @author YM
   * @date 2019-02-01
   * @param {*} data
   * @returns 
   */
  getLinkList(data) {
    return request.post('/link/list', data)
  },
  /**
   * @description 友情链接保存
   * @author YM
   * @date 2019-02-06
   * @param {*} data
   * @returns 
   */
  saveLink(data) {
    return request.post('/link/store', data)
  },
  /**
   * @description 获取友情链接详情
   * @author YM
   * @date 2019-02-11
   * @param {*} id
   * @returns 
   */
  getLinkInfo(id) {
    let data = {id:id}
    return request.post('/link/get_info', data)
  },
  /**
   * @description 根据id删除单条信息
   * @author YM
   * @date 2019-01-19
   * @param {*} data
   * @returns
   */
  deleteLink(id) {
    let data = {id:id}
    return request.post('/link/delete',data)
  },
  /**
   * @description 友情链接排序
   * @author YM
   * @date 2019-01-19
   * @param {*} data
   * @returns
   */
  orderLink(ids) {
    let data = {ids:ids}
    return request.post('/link/order',data)
  },
  /**
   * @description 获取友链的类型列表
   * @author YM
   * @date 2019-12-03
   * @returns 
   */
  getLinkTypeList() {
    return request.post('/link/type_list')
  }
}