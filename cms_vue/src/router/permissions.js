export default {
  path: 'permissions',
  component: () => import(/* webpackChunkName: "permissions-list" */ '@/pages/permissions/PermissionsList'),
  meta: {title:'权限管理'}
}