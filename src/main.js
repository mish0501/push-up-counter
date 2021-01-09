import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
// import router from './router'
import vuetify from './plugins/vuetify'

import vueAwesomeCountdown from 'vue-awesome-countdown'
import store from './store'

Vue.use(vueAwesomeCountdown, 'vac')

Vue.config.productionTip = false

new Vue({
  // router,
  vuetify,
  store,
  render: h => h(App),
}).$mount('#app')
