export default {
  path: 'authorization',
  component: () => import(/* webpackChunkName: "authorization-list" */ '@/pages/authorization/AuthorizationList'),
  meta: {title:'授权管理'}
}