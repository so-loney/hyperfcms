import * as request from '@/utils/request'

export default {
  /**
   * @description 获取用户菜单list，用于左侧导航
   * @author YM
   * @date 2019-01-10
   * @returns promise
   */
  getUserMenuList() {
    return request.post('/menu/user_menu')
  },
  /**
   * @description 获取用户权限list，用于页面按钮相关的控制
   * @author YM
   * @date 2019-01-10
   * @returns promise
   */
  getUserPermissionsList() {
    return request.post('/permissions/user_permissions')
  },
  /**
   * getOssToken
   * @description 获取上传凭证
   * @author YQ
   * @date 2019-01-19
   * @returns
   */
  getOssToken() {
    return request.post('/upload/get_upload_token')
  },
  /**
   * editorUploadFile
   * @description 富文本上传文件
   * @author YQ
   * @date 2019-01-31
   * @returns
   */
  editorUploadFile(data, ossUrl) {
    if(ossUrl){
      return request.post(ossUrl, data)
    }else{
      return request.post('/upload/editor', data)
    }
  },
  /**
   * @description 获取阿里云vod视频上传令牌信息
   * @author YM
   * @date 2019-02-25
   * @returns 
   */
  getVodToken(data) {
    return request.post('/upload/get_aliyun_vod_token',data)
  }
}