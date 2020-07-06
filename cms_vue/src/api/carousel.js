import * as request from '@/utils/request'

export default {
  /**
   * @description 获取轮播图列表
   * @author YM
   * @date 2019-02-01
   * @param {*} data
   * @returns 
   */
  getCarouselList(data) {
    return request.post('/carousel/list', data)
  },
  /**
   * @description 轮播图保存
   * @author YM
   * @date 2019-02-06
   * @param {*} data
   * @returns 
   */
  saveCarousel(data) {
    return request.post('/carousel/store', data)
  },
  /**
   * @description 获取轮播图详情
   * @author YM
   * @date 2019-02-11
   * @param {*} id
   * @returns 
   */
  getCarouselInfo(id) {
    let data = {id:id}
    return request.post('/carousel/get_info', data)
  },
  /**
   * @description 根据id删除单条信息
   * @author YM
   * @date 2019-01-19
   * @param {*} data
   * @returns
   */
  deleteCarousel(id) {
    let data = {id:id}
    return request.post('/carousel/delete',data)
  },
  /**
   * @description 轮播图排序
   * @author YM
   * @date 2019-01-19
   * @param {*} data
   * @returns
   */
  orderCarousel(ids) {
    let data = {ids:ids}
    return request.post('/carousel/order',data)
  },
  /**
   * @description 获取轮播的类型列表
   * @author YM
   * @date 2019-12-03
   * @returns 
   */
  getCarouselTypeList() {
    return request.post('/carousel/type_list')
  }
}