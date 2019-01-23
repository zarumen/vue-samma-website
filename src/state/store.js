import Vue from 'vue'
import Vuex from 'vuex'
import center from './modules/center.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    center
  }
})
