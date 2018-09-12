import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import router from './router'

Vue.use(Vuex)

let auth = Axios.create({
  baseURL: '//localhost:3000/auth/',
  timeout: 3000,
  withCredentials: true
})

let api = Axios.create({
  baseURL: '//localhost:3000/api/',
  timeout: 3000,
  withCredentials: true
})

export default new Vuex.Store({
  state: {
    coords: {},
    user: {},
    searchRadius: 0,
    posts: {}
  },
  mutations: {
    //
    //USER MUTATIONS
    //
    //set user coords at app mount
    captureCoords(state, coords) {
      state.coords = coords
    },
    setUser(state, user) {
      state.user = user;
    },
    logout(state) {
      state.user = {}
      state.posts = {}
      state.searchRadius = 0
      router.push({ name: 'login' })
    },
    //
    //POST MUTATIONS
    //
    setPosts(state, postArr) {
      let postObj = {}
      postArr.forEach(post => {
        if (postObj[post.category]) {
          postObj[post.category].push(post)
        }
        let arr = []
        postObj[post.category] = arr.push(post)
      })
      state.posts = postObj
    }
  },
  actions: {
    //
    //USER ACTIONS
    //
    //get user coords at app mount
    captureCoords({ dispatch, commit }, coords) {
      commit('captureCoords', coords)
    },
    //USER AUTH METHODS
    loginUser({ commit, dispatch }, creds) {
      auth.post('login', creds)
        .then(res => {
          console.log('login user return: ', res.data)
          commit('setUser', res.data)
          router.push({ name: 'home' })
        })
        .catch(err => console.error(err))
    },
    registerUser({ commit, dispatch }, newUser) {
      newUser['created'] = Date.now()
      auth.post('register', newUser)
        .then(res => {
          console.log("register user return: ", res.data)
          commit('setUser', res.data)
          router.push({ name: 'home' })
        })
        .catch(err => console.error(err))
    },
    authenticate({ commit, dispatch }) {
      auth.get('authenticate')
        .then(res => {
          commit('setUser', res.data)
          router.push({ name: 'home' })
        })
        .catch(err => console.error(err))
    },
    userExists({ }, name) {
      auth.get(`exists/${name}`)
        .then(res => {
          if (res.data) {
            console.log('existing username: ', res.data)
            return alert('USERNAME TAKEN:\nPlease select a different username')
          }
        })
    },
    logout({ commit, dispatch }) {
      auth.delete('logout')
        .then(res => {
          console.log("logging out: ", res.data)
          commit('logout')
        })
        .catch(err => console.error(err))
    },
    //
    //POST ACTIONS
    //
    getPosts({ dispatch, commit, state }, radius) {
      api.get(`posts/${state.coords.lat}/${state.coords.lng}/${radius}`)
        .then(res => {
          commit("setPosts", res.data)
        })
        .catch(err => console.error(err))
    }
  }
})
