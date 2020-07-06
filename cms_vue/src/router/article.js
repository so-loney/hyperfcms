export default  {
  path: 'article',
  component: () => import(/* webpackChunkName: "article-list" */ '@/pages/article/ArticleList'),
  meta: {title:'文章管理'},
  children: [
    {
      path: 'create',
      component: () => import(/* webpackChunkName: "article-create" */ '@/pages/article/CreateEdit'),
      meta: {title:'添加文章'},
    },
    {
      path: ':article_id/edit',
      component: () => import(/* webpackChunkName: "article-edit" */ '@/pages/article/CreateEdit'),
      meta: {title:'编辑文章'},
    }
  ]
}