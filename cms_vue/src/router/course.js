export default {
  path: 'course',
  component: () => import(/* webpackChunkName: "course-list" */ '@/pages/course/CourseList'),
  meta: {title:'课程管理'},
  children: [
    {
      path: 'create',
      component: () => import(/* webpackChunkName: "course-create" */ '@/pages/course/CreateEdit'),
      meta: {title:'添加课程'},
    },
    {
      path: ':course_id/edit',
      component: () => import(/* webpackChunkName: "course-edit" */ '@/pages/course/CreateEdit'),
      meta: {title:'编辑课程'},
    }
  ]
}