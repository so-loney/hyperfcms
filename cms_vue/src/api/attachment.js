import * as request from '@/utils/request'

export default {
  /**
   * @description 获取附件列表
   * @author YM
   * @date 2019-03-04
   * @param {*} data
   * @returns 
   */
  getAttachmentList(data) {
    return request.post('/attachment/list', data)
  },
  /**
   * @description 附件保存
   * @author YM
   * @date 2019-02-06
   * @param {*} data
   * @returns 
   */
  saveAttachment(data) {
    return request.post('/attachment/store', data)
  },
  /**
   * @description 获取附件详情
   * @author YM
   * @date 2019-02-11
   * @param {*} id
   * @returns 
   */
  getAttachmentInfo(id) {
    let data = {id:id}
    return request.post('/attachment/get_info', data)
  },
  /**
   * @description 根据id删除单条信息
   * @author YM
   * @date 2019-01-19
   * @param {*} data
   * @returns
   */
  deleteAttachment(id) {
    let data = {id:id}
    return request.post('/attachment/delete',data)
  },
}