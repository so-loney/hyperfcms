import Vue from 'vue'
import Router from 'vue-router'
import $vuex from '@/store'
import login from './login'
import menu from './menu'
import permissions from './permissions'
import roles from './roles'
import user from './user'
import setting from './setting'
import carousel from './carousel'
import adPosition from './ad_position'
import link from './link'
import category from './category'
import article from './article'
import live from './live'
import lecturer from './lecturer'
import statistics from './statistics'
import attachment from './attachment'
import sysLog from './sys_log'


// 解决vue报错vue-router.esm.js
const routerPush = Router.prototype.push
  Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}

Vue.use(Router)

// 路由详情
const routes = [
  {
    path: '/',
    component: () => import('@/layouts/BasicLayout'),
    meta: {title:'首页'},
    children: [
      menu, // 菜单
      permissions, // 权限
      roles, // 角色
      user, // 用户
      setting, // 基础设置
      carousel, // 轮播图
      adPosition, // 广告位
      link, // 友情链接
      category, // 分类管理
      article, // 文章管理
      live, // 直播管理
      lecturer, // 讲师管理
      statistics, // 统计管理
      attachment, // 附件管理
      sysLog, // 系统日志
      {
        path: 'exception/404',
        component: () => import(/* webpackChunkName: "exception-404" */ '@/pages/exception/404')
      }
    ]
  },
  {
    path: '/',
    component: () => import('@/layouts/PassportLayout'),
    children: [
      login, // 登录
    ]
  },
  {
    path:"*",
    redirect:'/exception/404',
    // component: () => import('@/pages/exception/404')
  }
]

// 实例化
const router = new Router({
  base : process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_URL : '/',
  mode : 'history',
  routes
})

// 路由钩子
router.beforeEach((to, from, next) => {
  ifLogin(to, next)
  handelSiderMenu(to)
  next()
});

/**
 * @description 处理左侧菜单的选中
 * @author YM
 * @date 2019-01-10
 * @param {*} to 当前路由
 */
let handelSiderMenu =  (to) => {
  $vuex.commit('handleRoutePath', to.path)
}

/**
 * @description 处理左侧菜单的选中
 * @author YM
 * @date 2019-01-10
 * @param {*} to 当前路由
 * @param {*} next 回调函数
 */
let ifLogin = (to, next) => {
  let userInfo = JSON.parse(localStorage.getItem('user_info'))
  // 判断是否是登录页
  let idx = to.path.indexOf('login') != -1
   // 没有userInfo 且 不是login 页 => 登录页
  if (!userInfo && !idx) {
    next('/login')
  }
  // 有userinfo 且 是login 页 => 首页
  if (idx && userInfo) {
    next('/')
  }
}

export default router
