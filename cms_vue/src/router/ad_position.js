export default  {
  path: 'ad_position',
  component: () => import(/* webpackChunkName: "ad-position-list" */ '@/pages/ad_position/AdPositionList'),
  meta: {title:'广告位管理'}
}