export default {
  path: 'menu',
  component: () => import(/* webpackChunkName: "menu-list" */ '@/pages/menu/MenuList'),
  meta: {title:'菜单管理'}
}