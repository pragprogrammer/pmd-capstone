import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import router from './router'

Vue.use(Vuex)

let auth = Axios.create({
  baseURL: 'localhost:3000/auth',
  timeout: 3000,
  withCredentials: true
})

let api = Axios.create({
  baseURL: 'localhost:3000/api/',
  timeout: 3000,
  withCredentials: true
})

export default new Vuex.Store({
  state: {
    user: {}
  },
  mutations: {

  },
  actions: {

    //USER AUTH METHODS

    loginUser({ commit, dispatch }, creds) {

    },

    registerUser({ commit, dispatch }, newUser) {

    }




  }
})
