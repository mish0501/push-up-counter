import Vue from 'vue'
import VueRouter from 'vue-router'
import Counter from '../views/Counter.vue'
import Settings from '../views/Settings.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'counter',
    component: Counter,
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
  },
]

const router = new VueRouter({
  routes,
  mode: 'history',
  base: process.env.NODE_ENV === 'production' ? '/push-up-counter/' : '/',
})

export default router
