import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import About from './views/About.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/home',
      name: 'home',
      component: Home,
      props: true
    },
    {
      path: '/',
      name: 'login',
      props: true,
      component: Login
    },
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/about',
      name: 'about',
      component: About
    }
  ]
})
