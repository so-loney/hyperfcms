import * as request from '@/utils/request'

export default {
 // --------------------------------------  广告位管理 -------------------------------------------
  /**
   * @description 获取广告位列表
   * @author YM
   * @date 2019-02-01
   * @param {*} data
   * @returns 
   */
  getAdPositionList(data) {
    return request.post('/ad_position/list', data)
  },
  /**
   * @description 广告位保存
   * @author YM
   * @date 2019-02-06
   * @param {*} data
   * @returns 
   */
  saveAdPosition(data) {
    return request.post('/ad_position/store', data)
  },
  /**
   * @description 获取广告位详情
   * @author YM
   * @date 2019-02-11
   * @param {*} id
   * @returns 
   */
  getAdPositionInfo(id) {
    let data = {id:id}
    return request.post('/ad_position/get_info', data)
  },
  /**
   * @description 根据id删除单条信息
   * @author YM
   * @date 2019-01-19
   * @param {*} data
   * @returns
   */
  deleteAdPosition(id) {
    let data = {id:id}
    return request.post('/ad_position/delete',data)
  },
  /**
   * @description 获取广告视频的预览信息
   * @author YM
   * @date 2019-02-28
   * @param {*} data
   * @returns 
   */
  getAdPositionVideoPreview(videoId) {
    let data = {video_id:videoId}
    return request.post('/ad_position/get_video_preview',data)
  },
  /**
   * @description 获取广告位的类型列表
   * @author YM
   * @date 2019-12-03
   * @returns 
   */
  getAdPositionTypeList() {
    return request.post('/ad_position/type_list')
  }
}