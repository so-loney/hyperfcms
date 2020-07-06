import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/display.css';
import '@/assets/element-variables.scss'
import App from '@/layouts/App.vue'
import router from '@/router/router'
// 默认会找store目录下面的index.js文件
import store from '@/store'
import api from '@/api'
import * as utils from '@/utils/utils'

Vue.config.productionTip = false
Vue.prototype.$api = api
Vue.prototype.$utils = utils

Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
