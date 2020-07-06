import * as request from '@/utils/request'

export default {
  /**
   * getCategoryList
   * @description 分类管理列表
   * @author YQ
   * @date 2019-01-19
   * @param {*} data
   * @returns
   */
  getCategoryList(data) {
    return request.post('/category/list', data)
  },
  /**
   * saveCategory
   * @description 保存分类
   * @author YQ
   * @date 2019-01-19
   * @param {*} data
   * @returns
   */
  saveCategory(data) {
    return request.post('/category/store', data)
  },
  /**
   * getCategoryInfo
   * @description 获取分类详情
   * @author YQ
   * @date 2019-01-19
   * @param {*} data
   * @returns
   */
  getCategoryInfo(id) {
    let data = {id:id}
    return request.post('/category/get_info', data)
  },
  /**
   * deleteCategoryInfo
   * @description 删除分类详情
   * @author YQ
   * @date 2019-01-19
   * @param {*} id
   * @returns
   */
  deleteCategoryInfo(id) {
    let data = {id:id}
    return request.post('/category/delete', data)
  },
  /**
   * @description 分类排序
   * @author YM
   * @date 2019-03-07
   * @param {*} ids
   * @returns 
   */
  orderCategory(ids) {
    let data = {ids:ids}
    return request.post('/category/order',data)
  }
}