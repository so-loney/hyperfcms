import * as request from '@/utils/request'

export default {
// --------------------------------------  课程管理 -------------------------------------------
  /**
   * @description 获取课程分类列表
   * @author YM
   * @date 2019-03-07
   */
  getCourseCategoryList() {
    return request.post('/course/category_list')
  },
  /**
   * @description 获取课程列表
   * @author YM
   * @date 2019-02-01
   * @param {*} data
   * @returns 
   */
  getCourseList(data) {
    return request.post('/course/list', data)
  },
  /**
   * @description 课程保存
   * @author YM
   * @date 2019-02-06
   * @param {*} data
   * @returns 
   */
  saveCourse(data) {
    return request.post('/course/store', data)
  },
  /**
   * @description 获取课程详情
   * @author YM
   * @date 2019-02-11
   * @param {*} id
   * @returns 
   */
  getCourseInfo(id) {
    let data = {id:id}
    return request.post('/course/get_info', data)
  },
  /**
   * @description 根据id删除单条信息
   * @author YM
   * @date 2019-01-19
   * @param {*} data
   * @returns
   */
  deleteCourse(id) {
    let data = {id:id}
    return request.post('/course/delete',data)
  },
  /**
   * @description 获取课程视频章节list
   * @author YM
   * @date 2019-02-23
   * @param {*} id
   * @returns 
   */
  getCourseTreeVideoChapterList(id) {
    let data = {course_id:id}
    return request.post('/course/get_tree_video_chapter_list', data)
  },
  /**
   * @description 保存课程章节信息
   * @author YM
   * @date 2019-02-23
   * @param {*} data
   * @returns 
   */
  saveCourseVideoChapter(data) {
    return request.post('/course/save_video_chapter', data)
  },
  /**
   * @description 获取视频章节详情
   * @author YM
   * @date 2019-02-24
   * @param {*} id
   * @returns 
   */
  getCourseVideoChapterInfo(id) {
    let data = {id:id}
    return request.post('/course/get_video_chapter', data)
  },
  /**
   * @description 删除视频章节信息
   * @author YM
   * @date 2019-02-24
   * @param {*} id
   * @returns 
   */
  deleteCourseVideoChapterInfo(data) {
    return request.post('/course/delete_video_chapter',data)
  },
  /**
   * @description 保存视频信息
   * @author YM
   * @date 2019-02-24
   * @param {*} data
   * @returns 
   */
  saveCourseVideo(data) {
    return request.post('/course/save_video', data)
  },
  /**
   * @description 获取视频详情
   * @author YM
   * @date 2019-02-24
   * @param {*} id
   * @returns 
   */
  getCourseVideoInfo(id) {
    let data = {id:id}
    return request.post('/course/get_video', data)
  },
  /**
   * @description 删除视频信息
   * @author YM
   * @date 2019-02-24
   * @param {*} id
   * @returns 
   */
  deleteCourseVideoInfo(data) {
    return request.post('/course/delete_video',data)
  },
  /**
   * @description 排序课程视频章节
   * @author YM
   * @date 2019-02-24
   * @param {*} data
   * @returns 
   */
  orderCourseVideoChapter(data) {
    return request.post('/course/order_video_chapter',data)
  },
  /**
   * @description 获取课程视频的预览信息
   * @author YM
   * @date 2019-02-28
   * @param {*} data
   * @returns 
   */
  getCourseVideoPreview(videoId) {
    let data = {video_id:videoId}
    return request.post('/course/get_video_preview',data)
  },
  /**
   * @description 获取课程值直播list
   * @author YM
   * @date 2019-03-13
   * @param {*} id
   * @returns 
   */
  getCourseTreeLiveList(id) {
    let data = {course_id:id}
    return request.post('/course/get_tree_live_list', data)
  },
  /**
   * @description 课程直播搜索讲师
   * @author YM
   * @date 2019-03-13
   * @param {*} qs
   * @returns 
   */
  courseLiveSearchLecturer(qs){
    let data = {search:qs}
    return request.post('/course/live_search_lecturer',data)
  },
  /**
   * @description 保存课程直播信息
   * @author YM
   * @date 2019-03-14
   * @param {*} data
   * @returns 
   */
  saveCourseLive(data) {
    return request.post('/course/save_live', data)
  },
  /**
   * @description 获取直播详情
   * @author YM
   * @date 2019-03-14
   * @param {*} id
   * @returns 
   */
  getCourseLiveInfo(id) {
    let data = {id:id}
    return request.post('/course/get_live', data)
  },
  /**
   * @description 删除直播
   * @author YM
   * @date 2019-03-14
   * @param {*} id
   * @returns 
   */
  deleteCourseLiveInfo(id) {
    let data = {id:id}
    return request.post('/course/delete_live', data)
  },
  /**
   * @description 排序课程视频章节
   * @author YM
   * @date 2019-02-24
   * @param {*} data
   * @returns 
   */
  orderCourseLive(data) {
    return request.post('/course/order_live',data)
  },
  /**
   * @description 获取课程直播流相关信息
   * @author YM
   * @date 2019-03-14
   * @param {*} id
   * @returns 
   */
  getCourseLiveStreamInfo(id) {
    let data = {id:id}
    return request.post('/course/get_live_stream_info', data)
  }
}