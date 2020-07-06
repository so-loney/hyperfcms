import Vue from 'vue'
import Vuex from 'vuex'
// 引入分割的单文件
import state from './state'
import getters from './getters'
import mutations from './mutations'

Vue.use(Vuex)
/**
 * 考虑未来不会因为内容的增多到时store文件太大
 * 我们将state、mutations、action、getter分割为单独文件
 * 这里只需要将他们引入，重新组合
 * 
 */
export default new Vuex.Store({
  strict: true,
  state,
  getters,
  mutations
})