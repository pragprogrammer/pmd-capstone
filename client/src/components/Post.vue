<template>
  <div class="posts">
    <div class="post" v-for="post in posts" :key="post._id">
      <div class="category">{{post.category}}</div>
      <div class="userName" @click="showUser(post.userId)"><strong>{{post.userName}}</strong></div>
      <div class="distance">{{Math.round(post.distance)}} miles away</div>
      <div class="content-holder">
        <div class="content">{{post.content}}</div>
      </div>
      <div class="time">{{post.timestamp | moment("from", "now")}}</div>
      <div class="votes">
        <i @click="upVote(post._id)"  v-if="!datavote.upvoted" class="fas fa-arrow-alt-circle-up"></i>
        <i v-else class="far fa-arrow-alt-circle-up"></i>
        <i @click="downVote(post._id)"  v-if="!datavote.downvoted" class="fas fa-arrow-alt-circle-down"></i>
        <i v-else class="far fa-arrow-alt-circle-down"></i>
      </div>
      <div class="vote-value">{{calculateVotes(post.votes)}}</div>
    </div>
  </div>
</template>

<script>
let moment = require("moment");

export default {
  name: "post",
  data() {
    return {
      upvoted: false,
      downvoted: false,
      voted: {
        vote: 1
      },
      dVoted: {
        vote: -1
      }
      // upvoted: false,
      // uVote: 1,
      // downvoted: false,
      // dVote: -1
    };
  },
  methods: {
    showUser() {
      //some stuff
    },
    upVote(id) {
      // debugger;
      this.$store.dispatch("vote", { postId: id, vote: this.voted });
      // debugger;
    },
    downVote(id) {
      this.$store.dispatch("vote", { postId: id, vote: this.dVoted });
    },
    calculateVotes(obj) {
      let postVotes = Object.values(obj);
      const getSum = (sum, value) => sum + value;
      return postVotes.reduce(getSum);
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
* {
  outline: 1px solid red;
}

.posts {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
}

.post {
  width: 100%;
  display: flex;
  height: 10rem;
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

.content-holder {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content {
  width: 90%;
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
  width: 50%;
}
</style>