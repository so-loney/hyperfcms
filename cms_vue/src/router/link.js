export default {
  path: 'link',
  component: () => import(/* webpackChunkName: "link-list" */ '@/pages/link/LinkList'),
  meta: {title:'友情链接'}
}