import Vue from 'vue'
import Vuex from 'vuex'
import center from './modules/center'
import dmj from './modules/dmj'
import leader from './modules/leader'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    center,
    dmj,
    leader
  }
})
