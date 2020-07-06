export default {
  path: 'setting',
  component: () => import(/* webpackChunkName: "setting-base" */ '@/pages/setting/SettingBase'),
  meta: {title:'系统配置'},
  children: [
    {
      path: 'site',
      component: () => import(/* webpackChunkName: "setting-site" */ '@/pages/setting/SettingSite'),
      meta: {title:'站点设置'},
    }
  ]
}