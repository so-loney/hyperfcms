import * as request from '@/utils/request'

export default {
  /**
   * @description 获取站点配置信息
   * @author YM
   * @date 2019-03-18
   * @returns 
   */
  getSettingSiteInfo() {
    return request.post('/setting/site_set')
  },
  /**
   * @description 保存站点配置信息
   * @author YM
   * @date 2019-03-18
   * @param {*} data
   * @returns 
   */
  saveSettingSiteInfo(data) {
    return request.post('/setting/site_save', data)
  },
  /**
   * @description 备份列表
   * @author YQ
   * @date 2019-12-14
   * @param {*} data
   * @returns 
   */
  getBackupList(data) {
    return request.post('/statistics_backup/backup_list', data)
  }
}