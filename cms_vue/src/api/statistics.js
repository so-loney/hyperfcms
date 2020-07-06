import * as request from '@/utils/request'

export default {
  /**
   * getStatisticsFlowData
   * @description 流量统计
   * @author YQ
   * @date 2019-12-19
   * @returns
   */
  getStatisticsFlowData(data) {
    return request.post('/statistics/flow_data', data)
  },
  /**
   * getStatisticsRegionData
   * @description 地域统计
   * @author YQ
   * @date 2019-12-19
   * @returns
   */
  getStatisticsRegionData(data) {
    return request.post('/statistics/region_data', data)
  },
}
