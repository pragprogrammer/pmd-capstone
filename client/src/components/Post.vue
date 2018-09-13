<template>
  <div class="posts">
    <div class="post" v-for="post in posts" :key="post._id">
      <h1>{{post.category}}</h1>
      <p @click="showUser(post.userId)">{{post.userName}}</p>
      <p>{{post.content}}</p>
      <p>Within {{post.distance}} miles</p>
      <div class="vote">
      <i class="fas fa-arrow-alt-circle-up"></i>
      <i class="far fa-arrow-alt-circle-up"></i>
      <i class="fas fa-arrow-alt-circle-down"></i>
      <i class="far fa-arrow-alt-circle-down"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "post",
  // data() {},
  methods: {
    showUser() {
      //some stuff
    }
  },
  computed: {
    posts() {
      return this.$store.state.activePosts;
    }
  }
};
</script>

<style scoped>
</style>
