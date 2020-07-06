import * as request from '@/utils/request'

export default {
  /**
   * @description 获取文章列表
   * @author YM
   * @date 2019-03-04
   * @param {*} data
   * @returns 
   */
  getArticleList(data) {
    return request.post('/article/list', data)
  },
  /**
   * @description 获取文章分类列表
   * @author YM
   * @date 2019-03-04
   * @returns 
   */
  getArticleCategoryList() {
    return request.post('/article/category_list')
  },
  /**
   * @description 获取文章分类列表
   * @author YM
   * @date 2019-03-04
   * @returns 
   */
  getArticleCategoryLabelList() {
    return request.post('/article/category_label_list')
  },
  /**
   * @description 文章保存
   * @author YM
   * @date 2019-02-06
   * @param {*} data
   * @returns 
   */
  saveArticle(data) {
    return request.post('/article/store', data)
  },
  /**
   * @description 获取文章详情
   * @author YM
   * @date 2019-02-11
   * @param {*} id
   * @returns 
   */
  getArticleInfo(id) {
    let data = {id:id}
    return request.post('/article/get_info', data)
  },
  /**
   * @description 根据id删除单条信息
   * @author YM
   * @date 2019-01-19
   * @param {*} data
   * @returns
   */
  deleteArticle(id) {
    let data = {id:id}
    return request.post('/article/delete',data)
  },
  /**
   * @description 获取文章列表
   * @author YM
   * @date 2019-12-05
   * @param {*} id
   * @returns 
   */
  getArticleAttachment(id) {
    let data = {id:id}
    return request.post('/article/get_attachment', data)
  },
  /**
   * @description 保存文章附件
   * @author YM
   * @date 2019-12-05
   * @param {*} id
   * @returns 
   */
  saveArticleAttachment(data) {
    return request.post('/article/save_attachment', data)
  },
  /**
   * @description 上
   * @author YM
   * @date 2019-12-05
   * @param {*} id
   * @returns 
   */
  deleteArticleAttachment(id) {
    let data = {id:id}
    return request.post('/article/delete_attachment',data)
  },

}