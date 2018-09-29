import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import router from './router'
import { Stats } from 'fs';


Vue.use(Vuex)

import io from 'socket.io-client'
let socket = {}

var production = !window.location.host.includes('localhost');
var baseUrl = production ? '//bullutin.herokuapp.com/' : '//localhost:3000/';
let api = Axios.create({
  baseURL: baseUrl + 'api/',
  timeout: 2000,
  withCredentials: true
})
let auth = Axios.create({
  baseURL: baseUrl + 'auth/',
  timeout: 2000,
  withCredentials: true
})

// let auth = Axios.create({
//   baseURL: '//localhost:3000/auth/',
//   timeout: 3000,
//   withCredentials: true
// })

// let api = Axios.create({
//   baseURL: '//localhost:3000/api/',
//   timeout: 3000,
//   withCredentials: true
// })

export default new Vuex.Store({
  state: {
    coords: {},
    user: {},
    posts: [],
    activePosts: [],
    favoritePosts: [],
    filters: {
      radius: 25,
      category: 'All'
    },
    targetUser: {},
    joined: false,
    name: '',
    //messages: [],
    roomData: {}
  },

  mutations: {
    //
    //USER MUTATIONS
    updateReliabilty(state, user) {
      console.log('reliablilty console in store')
    },
    //
    captureCoords(state, coords) {
      state.coords = coords
    },
    setUser(state, user) {
      console.log("user= ", user)
      if (!user.favorites) user.favorites = {};
      state.user = user;
    },
    logout(state, disabled) {
      state.user = {}
      state.coords = {}
      state.posts = []
      state.activePosts = []
      state.filters = {
        radius: 25,
        category: 'All'
      }
      if (disabled == 'disable') {
        return router.push({ name: 'login', params: { disabled: 'disable' } })
      }
      router.push({ name: 'login' })
    },
    setTargetUser(state, targetUser) {
      state.targetUser = targetUser
      if (state.user.blockedUsers && state.user.blockedUsers[targetUser.userId]) {
        targetUser.blocked = true
      }
      else {
        targetUser.blocked = false;
      }
    },

    updateBlockedUsers(state, user) {
      if (user.blockedUsers) {
        state.user.blockedUsers = user.blockedUsers
      }
      else {
        Vue.delete(state.user, 'blockedUsers')
      }

    },

    updateUserFavorites(state, user) {
      if (user.favorites) {
        state.user.favorites = user.favorites
      }
      else {
        Vue.delete(state.user, 'favorites')
      }
    },


    //
    //POST MUTATIONS
    //
    setPosts(state, postArr) {
      postArr.sort((a, b) => { return b.timestamp - a.timestamp })
      postArr.forEach(post => {
        if (state.user.favorites[post._id]) {
          post.favorite = true;
        }
        else {
          post.favorite = false;
        }
      })
      state.posts = postArr
      if (state.user.blockedUsers) {
        state.activePosts = state.posts.filter(post => {
          return !state.user.blockedUsers[post.userId]
        })
      }
      else {
        state.activePosts = postArr;
      }
    },

    setFavorites(state, favorites) {
      state.favoritePosts = favorites;
    },

    addPost(state, post) {
      if (state.user.blockedUsers) {
        state.activePosts.unshift(post)
        state.posts.unshift(post)
      }
      else {
        state.posts.unshift(post)
      }
      // pw - I had to comment this out because it caused a duplicate render when user first posts
      //now its not duplicating and fixed issue with blockedUsers and post render on close modal

    },

    filterPosts(state, filters) {
      state.filters = filters
      let postArr = []

      //filter by distance    
      if (state.filters.category == 'All') {
        postArr = state.posts.filter(post => {
          return (post.distance <= state.filters.radius)
        })
      }
      //filter by distance and category
      else {
        postArr = state.posts.filter(post => {
          return (post.category == state.filters.category && post.distance <= state.filters.radius)
        })
      }
      //filter out blocked users
      if (state.user.blockedUsers) {
        postArr = postArr.filter(post => {
          return !state.user.blockedUsers[post.userId]
        })
      }
      //return updated activePost array
      state.activePosts = postArr
    },

    addFavorite(state, post) {
      state.favoritePosts.push(post);
      for (let i = 0; i < state.posts.length; i++) {
        if (state.posts[i]._id == post._id) {
          state.posts[i].favorite = true;
          break;
        }
      }
      for (let i = 0; i < state.activePosts.length; i++) {
        if (state.activePosts[i]._id == post._id) {
          state.activePosts[i].favorite = true;
          break;
        }
      }
    },

    deleteFavorite(state, post) {
      for (let i = 0; i < state.favoritePosts.length; i++) {
        if (state.favoritePosts[i]._id == post._id) {
          state.favoritePosts.splice(i, 1);
          break;
        }
      }

      for (let i = 0; i < state.posts.length; i++) {
        if (state.posts[i]._id == post._id) {
          state.posts[i].favorite = false;
          break;
        }
      }
      for (let i = 0; i < state.activePosts.length; i++) {
        if (state.activePosts[i]._id == post._id) {
          state.activePosts[i].favorite = false;
          break;
        }
      }
    },

    updateVotes(state, post) {
      let i = 0
      for (i; i < state.activePosts.length; i++) {
        let p = state.activePosts[i];
        if (p._id == post._id) {
          post.distance = p.distance
          post.favorite = p.favorite
          break
        }
      }

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

    },
    //SOCKET STUFF
    setJoined(state, payload) {
      state.joined = true;
      state.name = payload;
    },

    setRoom(state, payload) {
      state.roomData = payload;
    },

    newUser(state, payload) {
      Vue.set(state.roomData.connectedUsers, payload.userName, payload.userName)
      console.log(payload.userName + " has joined the session");
    },

    userLeft(state, payload) {
      Vue.set(state.roomData.connectedUsers, payload, undefined);
    },

    // newPost(state, payload) {
    //   console.log("new post received");
    //   //what do we do here?
    // },

    leave(state) {
      state.joined = false;
      state.name = '';
      //state.messages = [];//????do we need this
      state.roomData = {};
    }
  },
  actions: {
    //THANKS A TON https://www.movable-type.co.uk/scripts/latlong.html for the help with this math by supplying this function template!!
    haversine({ commit, state }, obj) {
      const earthRadius = 6371000
      let yourLat = obj.lat1 * (Math.PI / 180)
      let targetLat = obj.lat2 * (Math.PI / 180)
      let latDif = (obj.lat2 - obj.lat1) * (Math.PI / 180)
      let lngDif = (obj.lng2 - obj.lng1) * (Math.PI / 180)
      let a = (Math.sin(latDif / 2) * Math.sin(latDif / 2)) +
        (Math.cos(yourLat) * Math.cos(targetLat) *
          Math.sin(lngDif / 2) * Math.sin(lngDif / 2))
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      let distanceKM = (earthRadius * c) / 1000
      let distanceMiles = distanceKM * .6213
      if (distanceMiles <= 25 && obj.data.userId != state.user._id) {
        obj.data.distance = distanceMiles
        commit('addPost', obj.data)
        commit('filterPosts', state.filters)
      }
    },
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
          dispatch("join", res.data.username)
        })

        .catch(err => console.error(err))
    },
    registerUser({ commit, dispatch }, newUser) {
      newUser['created'] = Date.now()
      auth.post('register', newUser)
        .then(res => {
          console.log("register user return: ", res.data)
          commit('setUser', res.data)
          dispatch("join", res.data.username)
          router.push({ name: 'home', params: { justRegistered: 'newbie' } })
        })
        .catch(err => console.error(err))
    },
    authenticate({ commit, dispatch }) {
      auth.get('authenticate')
        .then(res => {
          commit('setUser', res.data)
          dispatch("join", res.data.username) //might not need this one
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
    getTargetUser({ dispatch, commit }, username) {
      if (typeof username == 'object') {
        return commit('setTargetUser', {})
      }
      auth.get(`find/byUsername/${username}`)
        .then(res => {
          commit('setTargetUser', res.data)
        })
        .catch(err => console.error(err))
    },

    blockUser({ commit, dispatch, state }, user) {
      if (user.userId == state.user._id) {
        return window.alert("You can't block yourself!")
      }
      auth.post('block', user)
        .then(res => {
          commit('updateBlockedUsers', res.data)
          commit('filterPosts', state.filters)
        })
        .catch(err => console.error(err))
    },

    unblockUser({ commit, dispatch, state }, userId) {
      auth.post('unblock', { 'userId': userId })
        .then(res => {
          console.log("unblock user data", res.data)
          commit('updateBlockedUsers', res.data)
          commit('filterPosts', state.filters)
        })
        .catch(err => console.error(err))
    },

    userPosts({ commit, dispatch, state }, userId) {
      api.get('posts/' + userId)
        .then(res => {
          let postArr = res.data
          let voteArr = []
          for (let i = 0; i < postArr.length; i++) {
            let post = postArr[i]
            if (!post.votes) {
              continue
            }
            let vote = post.votes
            voteArr.push(vote)
          }
          dispatch("userReliability", { userId, voteArr })
        })
    },

    userReliability({ commit, dispatch, state }, payload) {
      auth.post('post', payload)
        .then(res => {
          let voteObj = res.data
          //@ts-ignore          
          let postVotes = Object.values(voteObj);
          let voteValueArr = []
          for (let i = 0; i < postVotes.length; i++) {
            let vote = voteObj[i]
            for (var key in vote) {
              voteValueArr.push(vote[key])  //parseFloat was here
            }
          }
          if (!voteValueArr.length) {
            return
          }
          let reliabliltyValue = voteValueArr.reduce((sum, value) => sum + value)
          // debugger
          dispatch("calculateReliability", { userId: state.targetUser.userId, reliabliltyValue })
        })
    },

    calculateReliability({ commit, dispatch, state }, payload) {
      auth.post('reliability', payload)
        .then(res => {
          commit('setTargetUser', res.data)
        })
    },
    //POST ACTIONS
    //
    addFavorite({ commit, dispatch }, post) {
      auth.post('favorite', post)
        .then(res => {
          commit('updateUserFavorites', res.data)
          commit('addFavorite', post)
        })
        .catch(err => console.error(err))
    },

    removeFavorite({ commit, dispatch }, post) {
      auth.post('unfavorite', post)
        .then(res => {
          commit('updateUserFavorites', res.data)
          commit('deleteFavorite', post)
        })
        .catch(err => console.error(err));
    },


    getPosts({ dispatch, commit, state }, radius) {
      api.get(`posts/${state.coords.lat}/${state.coords.lng}/${radius}`)
        .then(res => {
          commit("setPosts", res.data)
          if (Object.keys(state.user.favorites).length > 0) {
            dispatch('getFavoritePosts')
          }
        })
        .catch(err => console.error(err))
    },

    getFavoritePosts({ commit, dispatch, state }) {
      api.get(`posts/user/favorites/${state.coords.lat}/${state.coords.lng}`)
        .then(res => {
          commit('setFavorites', res.data)
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
          dispatch('sendPost', res.data)
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
    },

    //SOCKET ACTIONS
    join({ commit, dispatch }, payload) {
      commit('setJoined', payload);
      dispatch('socket', payload)
    },
    socket({ commit, dispatch, state }, payload) {
      //establish connection with socket
      socket = io('//localhost:3000')

      //register socket event listeners
      socket.on('CONNECTED', data => {
        console.log('Connected to socket')
        //connect to room
        socket.emit('join', { name: payload })
      })

      socket.on('joinedRoom', data => {
        commit('setRoom', data)
      })

      socket.on('newUser', data => {
        commit('newUser', data)
      })

      socket.on('left', data => {
        console.log('user left', data)
        commit('userLeft', data)
      })

      socket.on('newPost', data => {
        let obj = {
          lat1: state.coords.lat,
          lng1: state.coords.lng,
          lat2: data.coordinates.lat,
          lng2: data.coordinates.lng,
          data
        }
        dispatch("haversine", obj)
      })

    },

    sendPost({ commit, dispatch }, payload) {
      socket.emit('post', payload)
      console.log("sending new post to socket");
    },

    leaveRoom({ commit, dispatch }, payload) {
      socket.emit('leave')
      socket.close()
      commit('leave')
    }
  }
})
