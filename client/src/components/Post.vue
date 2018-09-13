<template>
  <div class="posts">
    <div class="post" v-for="post in posts" :key="post._id">
      <h1>{{post.category}}</h1>
      <p>{{post.userName}}</p>
      <p>{{post.content}}</p>
      <p>Within {{post.distance}} miles</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "post",
  // data() {},
  methods: {},
  computed: {
    posts() {
      return this.$store.state.activePosts;
    }
  }
};
</script>

<style scoped>
</style>
