export default {
  path: 'lecturer',
  component: () => import(/* webpackChunkName: "lecturer-list" */ '@/pages/lecturer/LecturerList'),
  meta: {title:'讲师管理'}
}