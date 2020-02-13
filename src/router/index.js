import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Spells from '../views/Spells.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
		path: '/spellbook/:spell?',
    name: 'Spellbook',
    component: Spells
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
