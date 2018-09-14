<template>
  <div class="posts">
    <div class="post" v-for="post in posts" :key="post._id">
      <div class="category">{{post.category}}</div>
      <div class="userName" @click="showUser(post.userId)">{{post.userName}}</div>
      <div class="distance">{{Math.round(post.distance)}} miles away</div>
      <div class="content">{{post.content}}</div>
      <div class="time">{{post.timestamp}}</div>
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

  .posts {
    width: 75%;
    height: auto;
    display: flex;
    flex-wrap: wrap;
  }

  .post {
    width: 100%;
    display: flex;
    height: auto;
    border: 1px solid black;
    flex-wrap: wrap;
    flex-direction: row;
    margin: 0.5rem;
  }

  .category {
    width: 50%;
  }

  .username {
    width: 25%;
  }

  .content {
    width: 70%;
    border: 1px solid grey;
    background-color: rgba(128, 128, 128, 0.466);
  }

  .distance {
    width: 25%;
  }

  .votes {
    width: 50%;
  }

  .time {
    width: 50%
  }
</style>