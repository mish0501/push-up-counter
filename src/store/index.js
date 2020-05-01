import Vue from 'vue'
import Vuex from 'vuex'

import counter from './modules/counter'
import settings from './modules/settings'
import alert from './modules/alert'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: { counter, settings, alert },
})
