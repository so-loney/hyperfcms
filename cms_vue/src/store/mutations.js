/**
 * state属性必须使用mutation改变
 * 跟级别的mutation
 */
const mutations = {
  /**
   * @description 左侧导航折叠状态控制
   * @author YM
   * @date 2019-01-10
   * @param {*} state
   */
  changeCollapse (state) {
    state.isCollapse = !state.isCollapse
  },
  /**
   * @description 处理菜单
   * @author YM
   * @date 2019-01-10
   * @param {*} state
   * @param {*} data
   */
  handleMenuList (state,data) {
    state.menuList = data
  },
  /**
   * @description 处理地址栏url路由
   * @author YM
   * @date 2019-01-14
   * @param {*} state
   * @param {*} data
   */
  handleRoutePath (state,data) {
    state.routePath = data
  },
  /**
  * @description 处理用户登录信息
  * @author YM
  * @date 2019-01-10
  * @param {*} state
  * @param {*} data
  */
  handleUserInfo (state,data) {
    state.userInfo = data
  },
  /**
    * @description 处理用户权限信息
    * @author YM
    * @date 2019-01-10
    * @param {*} state
    * @param {*} data
    */
  handleUserPermissions (state,data) {
    state.userPermissions = data
  },
  /**
   * @description 改变响应错误弹窗标志
   * @author YM
   * @date 2020-01-07
   * @param {*} state
   * @param {*} data  true|false
   */
  changeRespErrMsgBoxMark (state,data) {
    state.responseErrorMessageBoxMark = data
  },
  /**
   * @description 全局loading状态控制
   * @author YM
   * @date 2020-02-19
   * @param {*} state
   * @param {*} data  true|false
   */
  changeLoadingStatus (state,data) {
    state.loadingStatus = data
  },
}

export default mutations