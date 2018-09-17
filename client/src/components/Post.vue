<template>
  <div class="posts">
    <div class="post" v-for="post in posts" :key="post._id">
      <div class="category">
        <p>
          <strong>{{post.title}}</strong>
          </p>
        <p class="distance" v-if="post.distance > 5">{{Math.round(post.distance)}} miles away</p>
        <p class="distance" v-else-if="post.distance <= 0.09">{{Math.round(post.distance)}} miles away</p>
        <p class="distance" v-else>{{post.distance.toFixed(2)}} miles away</p>
      </div>
      <div class="userName" @click="showUser(post.userId)">
        <p><strong>{{post.userName}}</strong></p>
        <p>{{post.timestamp | moment("from", "now")}}</p>
      </div>
      <div class="content-holder">
        <div class="content">{{post.content}}</div>
      </div>
      <div class="votes">
        <i @click="upVote(post._id)" class="far fa-check-circle"></i>
        <i @click="downVote(post._id)" class="far fa-times-circle"></i>
        <p v-if="post.votes">{{calculateVotes(post.votes)}}</p>
      </div>
    </div>
    <div class="spacer">spacer</div>
  </div>
</template>

<script>
let moment = require("moment");

export default {
  name: "post",
  data() {
    return {
      datavote: {
        upvoted: false,
        downvoted: false
      },
      voted: {
        vote: 1
      },
      dVoted: {
        vote: -1
      }
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
      if (!obj) {
        return 0;
      }
      let out = "";
      let postVotes = Object.values(obj);
      const getSum = (sum, value) => sum + value;
      let totalVotes = postVotes.reduce(getSum);
      if (totalVotes < 1) {
        return (out = "TROLL");
      } else if (totalVotes >= 2) {
        return (out = "VERIFIED");
      } else return (out = "UNVERIFIED");
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

.spacer {
  height: 25vh;
  color: transparent;
  pointer-events: none;
}

.posts {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
}

p {
  margin-bottom: 0;
}

.post {
  width: 100%;
  display: flex;
  height: auto;
  border: 1px solid black;
  border-radius: 1rem;
  flex-wrap: wrap;
  flex-direction: row;
  margin: 0.5rem;
  background-color: #18bc9c;
  transition: 0.2s;
}

.post:hover {
  box-shadow: -4px 5px 24px 1px white;
}

.category {
  width: 50%;
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: #76828e;
  margin-bottom: 1rem;
  border-top-left-radius: 1rem;
  border-bottom: 1px solid black;
}

.distance {
  padding-left: 1rem;
}

.userName {
  width: 50%;
  display: flex;
  justify-content: flex-end;
  background-color: #76828e;
  margin-bottom: 1rem;
  border-top-right-radius: 1rem;
  border-bottom: 1px solid black;
}

.userName p {
  padding: 0 0.5rem 0 0.5rem;
}

.content-holder {
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content {
  width: 95%;
  height: auto;
  text-align: left;
  padding: 0.5rem;
  border: 1px solid grey;
  text-transform: uppercase;
  /* border-radius: 0.5rem; */
  background-color: #ecf0f1;
}

/* .distance {
  width: 25%;
} */

.votes {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0.5rem;
}

.votes i {
  padding: 0 0.5rem 0 0;
  cursor: pointer;
}

/* .time {
  width: 50%;
} */
</style>