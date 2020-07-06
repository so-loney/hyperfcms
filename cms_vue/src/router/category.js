export default {
  path: 'category',
  component: () => import(/* webpackChunkName: "category-list" */ '@/pages/category/CategoryList'),
  meta: {title:'分类管理'}
}