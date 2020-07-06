export default {
  path: 'sys_log',
  component: () => import(/* webpackChunkName: "sys_log-list" */ '@/pages/sys_log/SysLogList'),
  meta: {title:'系统日志'}
}