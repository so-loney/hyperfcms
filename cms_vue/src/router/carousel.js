export default {
  path: 'carousel',
  component: () => import(/* webpackChunkName: "carousel-list" */ '@/pages/carousel/CarouselList'),
  meta: {title:'轮播图管理'}
}