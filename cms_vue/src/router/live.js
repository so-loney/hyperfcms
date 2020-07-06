export default {
  path: 'live',
  component: () => import(/* webpackChunkName: "live-list" */ '@/pages/live/LiveList'),
  meta: {title:'直播管理'}
}