export default {
  path: 'user',
  component: () => import(/* webpackChunkName: "user-list" */ '@/pages/user/UserList'),
  meta: {title:'用户管理'}
}