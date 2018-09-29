import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import VeeValidate from 'vee-validate'
import 'vuetify/dist/vuetify.min.css'
import VueTour from 'vue-tour'

require('vue-tour/dist/vue-tour.css')

Vue.use(Vuetify)
Vue.use(VeeValidate)
Vue.use(VueTour)
Vue.use(require('vue-moment'));

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
