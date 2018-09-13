<template>
  <div class="posts">
    <div class="post" v-for="post in posts" :key="post._id">
      <h1>{{post.category}}</h1>
      <p @click="showUser(post.userId)">{{post.userName}}</p>
      <p>{{post.content}}</p>
      <p>Within {{post.distance}} miles</p>
      <div class="votes">
      <i @click="upvoted = !upvoted" v-if="upvoted" class="fas fa-arrow-alt-circle-up"></i>
      <i @click="upvoted = !upvoted" v-else class="far fa-arrow-alt-circle-up"></i>
      <i @click="downvoted = !downvoted" v-if="downvoted" class="fas fa-arrow-alt-circle-down"></i>
      <i @click="downvoted = !downvoted" v-else class="far fa-arrow-alt-circle-down"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "post",
  data() {
    return {
      upvoted: false,
      uVote: 1,
      downvoted: false,
      dVote: -1
    };
  },
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
/* * {
  outline: 1px solid red;
} */
</style>
