import * as request from '@/utils/request'

export default {
  /**
   * @description 获取授权列表
   * @author YM
   * @date 2019-03-04
   * @param {*} data
   * @returns 
   */
  getAuthorizationList(data) {
    return request.post('/authorization/list', data)
  },
  /**
   * @description 授权管理搜索用户
   * @author YM
   * @date 2019-03-13
   * @param {*} qs
   * @returns 
   */
  authorizationSearchUser(qs){
    let data = {search:qs}
    return request.post('/authorization/search_user',data)
  },
  /**
   * @description 授权管理搜索课程
   * @author YM
   * @date 2019-03-15
   * @param {*} qs
   * @returns 
   */
  authorizationSearchCourse(qs) {
    let data = {search:qs}
    return request.post('/authorization/search_course',data)
  },
  /**
   * @description 保存授权信息
   * @author YM
   * @date 2019-03-15
   * @param {*} data
   * @returns 
   */
  saveAuthorizationInfo(data) {
    return request.post('/authorization/store', data)
  }
}