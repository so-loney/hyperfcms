export default {
  path: 'login',
  component: () => import(/* webpackChunkName: "login" */ '@/pages/passport/Login'),
}