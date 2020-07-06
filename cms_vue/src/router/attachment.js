export default {
  path: 'attachment',
  component: () => import(/* webpackChunkName: "attachment-list" */ '@/pages/attachment/AttachmentList'),
  meta: {title:'附件管理'}
}