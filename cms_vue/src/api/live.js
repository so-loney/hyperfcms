import * as request from '@/utils/request'

export default {
  /**
   * @description 获取直播列表
   * @author YM
   * @date 2019-03-04
   * @param {*} data
   * @returns 
   */
  getLiveList(data) {
    return request.post('/live/list', data)
  },
  /**
   * @description 直播保存
   * @author YM
   * @date 2019-02-06
   * @param {*} data
   * @returns 
   */
  saveLive(data) {
    return request.post('/live/store', data)
  },
  /**
   * @description 获取直播详情
   * @author YM
   * @date 2019-02-11
   * @param {*} id
   * @returns 
   */
  getLiveInfo(id) {
    let data = {id:id}
    return request.post('/live/get_info', data)
  },
  /**
   * @description 根据id删除单条信息
   * @author YM
   * @date 2019-01-19
   * @param {*} data
   * @returns
   */
  deleteLive(id) {
    let data = {id:id}
    return request.post('/live/delete',data)
  },
  /**
   * @description 获取课程直播流相关信息
   * @author YM
   * @date 2019-03-14
   * @param {*} id
   * @returns 
   */
  getLiveStreamInfo(id) {
    let data = {id:id}
    return request.post('/live/get_stream_info', data)
  },
  /**
   * @description 直播搜索讲师
   * @author YM
   * @date 2019-03-13
   * @param {*} qs
   * @returns 
   */
  getSearchLecturer(qs){
    let data = {search:qs}
    return request.post('/live/search_lecturer',data)
  }
}