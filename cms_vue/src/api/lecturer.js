import * as request from '@/utils/request'

export default {
  // --------------------------------------  讲师管理 -------------------------------------------
  /**
   * @description 获取讲师列表
   * @author YM
   * @date 2019-03-04
   * @param {*} data
   * @returns 
   */
  getLecturerList(data) {
    return request.post('/lecturer/list', data)
  },
  /**
   * @description 课程直播搜索用户
   * @author YM
   * @date 2019-03-13
   * @param {*} qs
   * @returns 
   */
  lecturerSearchUser(qs){
    let data = {search:qs}
    return request.post('/lecturer/search_user',data)
  },
  /**
   * @description 讲师保存
   * @author YM
   * @date 2019-02-06
   * @param {*} data
   * @returns 
   */
  saveLecturer(data) {
    return request.post('/lecturer/store', data)
  },
  /**
   * @description 获取讲师详情
   * @author YM
   * @date 2019-02-11
   * @param {*} id
   * @returns 
   */
  getLecturerInfo(id) {
    let data = {id:id}
    return request.post('/lecturer/get_info', data)
  },
  /**
   * @description 根据id删除单条信息
   * @author YM
   * @date 2019-01-19
   * @param {*} data
   * @returns
   */
  deleteLecturer(id) {
    let data = {id:id}
    return request.post('/lecturer/delete',data)
  }
}