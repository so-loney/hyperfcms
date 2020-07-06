export default {
  path: 'roles',
  component: () => import(/* webpackChunkName: "roles-list" */ '@/pages/roles/RolesList'),
  meta: {title:'角色管理'},
  children: [
    {
      path: ':role_id/manage-members',
      component: () => import(/* webpackChunkName: "manage-members" */ '@/pages/roles/ManageMembers'),
      meta: {title:'成员管理'},
    }
  ]
}