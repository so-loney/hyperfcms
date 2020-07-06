import * as request from '@/utils/request'

export default {
  /**
   * @description 获取系统日志列表
   * @author YM
   * @date 2020-02-16
   * @param {*} data
   * @returns 
   */
  getSysLogList(data) {
    return request.post('/sys_log/list', data)
  }
}