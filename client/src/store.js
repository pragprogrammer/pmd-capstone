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
    posts: [],
    activePosts: [],
    category: 'All',
    searchRadius: 25,
    targetUser: {}
  },
  mutations: {
    //
    //USER MUTATIONS
    //
    captureCoords(state, coords) {
      state.coords = coords
    },
    setUser(state, user) {
      state.user = user;
    },
    logout(state, disabled) {
      state.user = {}
      state.coords = {}
      state.posts = []
      state.activePosts = []
      state.category = 'All'
      state.searchRadius = 25
      if (disabled == 'disable') {
        return router.push({ name: 'login', params: { disabled: 'disable' } })
      }
      router.push({ name: 'login' })
    },
    setTargetUser(state, targetUser) {
      state.targetUser = targetUser
    },

    updateBlockedUsers(state, user) {
      if (!state.user.blockedUsers) { state.user.blockedUsers = {} }
      state.user.blockedUsers = user.blockedUsers
      for (let i = 0; i < state.activePosts.length; i++) {
        let postUserId = state.activePosts[i].userId
        if (user.blockedUsers[postUserId]) {
          state.activePosts.splice(i, 1)
        }
      }
    },
    //
    //POST MUTATIONS
    //
    setPosts(state, postArr) {
      postArr.sort((a, b) => { return b.timestamp - a.timestamp })
      state.posts = postArr
      state.activePosts = state.posts
      // .filter(post => {
      //   return !state.user.blockedUsers[post.userId]
      // })
    },

    addPost(state, post) {
      state.posts.unshift(post)
      // state.activePosts.unshift(post)  pw - I had to comment this out because it caused a duplicate render when user first posts
    },

    filterPosts(state, filters) {
      let postArr = []
      //state.category = filters.catagory
      //state.searchRadius = filters.radius
      if (filters.category == 'All') {
        postArr = state.posts.filter(post => {
          return (post.distance <= filters.radius)
        })
      }
      else {
        postArr = state.posts.filter(post => {
          return (post.category == filters.category && post.distance <= filters.radius)
        })
      }
      state.activePosts = postArr
    },

    updateVotes(state, post) {
      let i = 0
      for (i; i < state.activePosts.length; i++) {
        let p = state.activePosts[i];
        if (p._id == post._id) {
          p = post
          break
        }
      }
      // let target = state.activePosts.find(p => p._id == post._id)
      // let index = state.activePosts.indexOf(target)
      state.activePosts.splice(i, 1, post)
    },

    deletePost(state, postId) {
      for (let i = 0; i < state.activePosts.length; i++) {
        if (state.activePosts[i]._id == postId) {
          state.activePosts.splice(i, 1)
          break;
        }
      }
      for (let i = 0; i < state.posts.length; i++) {
        if (state.posts[i]._id == postId) {
          state.posts.splice(i, 1)
          break;
        }
      }

    }

  },
  actions: {
    //
    //USER ACTIONS
    //
    //get user coords at app mount
    captureCoords({ dispatch, commit, state }, coords) {
      commit('captureCoords', coords)
      dispatch("getPosts", 25);
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

    logout({ commit, dispatch }, disabled) {
      auth.delete('logout')
        .then(res => {
          console.log("logging out: ", res.data)
          commit('logout', disabled)
        })
        .catch(err => console.error(err))
    },

    deleteUser({ commit, dispatch, state }) {
      console.log('deleting user: ', state.user.username)
      //delete the user's posts
      api.delete(`posts/by-user/${state.user._id}`)
        .then(res => {
          console.log(res.data)
          //delete user account
          auth.delete('delete')
            .then(res => {
              console.log(res.data)
              dispatch('logout')
            })
        })
        .catch(err => console.log(err))
    },
    getTargetUser({ dispatch, commit }, userId) {
      auth.get(`find/byUserId/${userId}`)
        .then(res => {
          commit('setTargetUser', res.data)
        })
        .catch(err => console.error(err))
    },

    blockUser({ commit, dispatch, state }, userId) {
      auth.post('block', { userId: userId })
        .then(res => {
          commit('updateBlockedUsers', res.data)
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
    },

    filterPosts({ dispatch, commit }, filters) {
      commit('filterPosts', filters)
    },

    addPost({ commit, dispatch, state }, post) {
      post.userId = state.user._id
      post.userName = state.user.username
      post.coordinates = state.coords
      post.timestamp = Date.now()
      post.distance = 0;
      api.post('posts', post)
        .then(res => {
          console.log(res.data)
          commit('addPost', res.data)
        })
        .catch(err => console.error(err))
    },

    //TO-DO  WRITE LOGIC FOR POSTING VOTES
    vote({ dispatch, commit, state }, payload) {
      api.post('posts/' + payload.postId + '/vote', payload.vote)
        .then(res => {
          commit('updateVotes', res.data)
        })
        .catch(err => console.log(err))
    },

    //DELETE A POST
    deletePost({ commit, dispatch }, postId) {
      api.delete(`posts/${postId}`)
        .then(res => {
          commit('deletePost', postId)
        })
        .catch(err => console.log(err))
    }
  }
})
