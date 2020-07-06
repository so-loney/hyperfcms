export default {
  path: 'statistics',
  component: () => import(/* webpackChunkName: "statistics-list" */ '@/pages/statistics/Statistics'),
  meta: {title:'统计分析'},
  children: [
    {
      path: 'flow_data',
      component: () => import(/* webpackChunkName: "statistics-flow" */ '@/pages/statistics/StatisticsFlow'),
      meta: {title:'流量统计'},
    },
    {
      path: 'region_data',
      component: () => import(/* webpackChunkName: "statistics-region" */ '@/pages/statistics/StatisticsRegion'),
      meta: {title:'地域统计'},
    },
  ]
}