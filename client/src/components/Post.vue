<template>
  <div class="posts">
    <div class="post" v-for="post in posts" :key="post._id" v-bind:class="[{eventsd:post.category=='event'},{lostsd:post.category=='lost and found'},{trafficsd:post.category=='traffic update'},{neighborsd:post.category=='neighborhood watch'}]">
      <div class="category" v-bind:class="[{eventbg:post.category=='event'},{lostbg:post.category=='lost and found'},{trafficbg:post.category=='traffic update'},{neighborbg:post.category=='neighborhood watch'}]">
        <div class="left-side">
          <p>
            <strong class="p-title">{{post.title}}</strong>
          </p>
        </div>
        <div class="right-side">
          <p class="distance inline" v-if="post.distance > 5">{{Math.round(post.distance)}} miles away</p>
          <p class="distance inline" v-else-if="post.distance <= 0.09">{{Math.round(post.distance)}} miles away</p>
          <p class="distance inline" v-else>{{post.distance.toFixed(2)}} miles away</p>
          <i v-if="post.userId == userId" @click="deletePost(post._id)" class="far fa-trash-alt mr-3 clickable"></i>
        </div>
      </div>
      <div class="content-holder" v-bind:class="[{event:post.category=='event'},{lost:post.category=='lost and found'},{traffic:post.category=='traffic update'},{neighbor:post.category=='neighborhood watch'}]">
        <div class="content">{{post.content}}</div>
        <div class="userName">
          <user-profile v-bind:post="post" />
          <p>{{post.timestamp | moment("from", "now")}}</p>
        </div>
        <div class="votes">
          <i @click="upVote(post)" class="far fa-check-circle"></i>
          <i @click="downVote(post)" class="far fa-times-circle"></i>
          <p v-if="post.votes">{{calculateVotes(post.votes)}}</p>
        </div>
      </div>
    </div>
    <div class="spacer">spacer</div>
  </div>
</template>
<script>
let moment = require("moment");
import UserProfile from "@/components/UserProfile";

export default {
  name: "post",
  data() {
    return {
      datavote: {
        upvoted: false,
        downvoted: false
      },
      voted: {
        vote: 0
      }
      // superVoter: {
      //   verify: 2,
      //   refute: -2
      // }
    };
  },
  methods: {
    upVote(post) {
      // debugger;
      if (this.userId == post.userId) {
        this.voted.vote = 0;
      } else if (this.user.reliability > 75) {
        this.voted.vote = 2;
      } else if (this.user.reliability > 25) {
        this.voted.vote = 1;
        // debugger;
      }
      this.$store.dispatch("vote", { postId: post._id, vote: this.voted });
      this.voted = { vote: 0 };
    },
    downVote(post) {
      if (this.userId == post.userId) {
        this.voted.vote = 0;
      } else if (this.user.reliability > 75) {
        this.voted.vote = -2;
      } else if (this.user.reliability > 25) {
        this.voted.vote = -1;
        // debugger;
      }
      this.$store.dispatch("vote", { postId: post._id, vote: this.voted });
      this.voted = { vote: 0 };
    },
    calculateVotes(obj) {
      if (!obj) {
        return 0;
      }
      let out = "";
      let postVotes = Object.values(obj);
      const getSum = (sum, value) => sum + value;
      let totalVotes = postVotes.reduce(getSum);
      if (totalVotes < 0) {
        return (out = "SUSPECT");
      } else if (totalVotes >= 2) {
        return (out = "VERIFIED");
      }
    },

    deletePost(postId) {
      this.$store.dispatch("deletePost", postId);
    }
  },
  computed: {
    posts() {
      return this.$store.state.activePosts;
    },
    userId() {
      return this.$store.state.user._id;
    },
    user() {
      return this.$store.state.user;
    }
  },
  components: {
    UserProfile
  }
};
</script>

<style scoped>
/* * {
  outline: 1px solid red;
} */

.user-profile {
  display: flex;
  flex: none;
  /* margin-top: 0.5rem; */
  align-items: center;
  padding: 0 0.5rem 0 0.5rem;
}

.event {
  border: 1px solid #18bc9c;
  border-bottom-right-radius: 1rem;
  border-bottom-left-radius: 1rem;
}

.lost {
  border: 1px solid #3498db;
  border-bottom-right-radius: 1rem;
  border-bottom-left-radius: 1rem;
}

.traffic {
  border: 1px solid #2c3e50;
  border-bottom-right-radius: 1rem;
  border-bottom-left-radius: 1rem;
}

.neighbor {
  border: 1px solid #e74c3c;
  border-bottom-right-radius: 1rem;
  border-bottom-left-radius: 1rem;
}
.eventsd {
  border-bottom-right-radius: 1rem;
  border-bottom-left-radius: 1rem;
}
.lostsd {
  border-bottom-right-radius: 1rem;
  border-bottom-left-radius: 1rem;
}
.trafficsd {
  border-bottom-right-radius: 1rem;
  border-bottom-left-radius: 1rem;
}
.neighborsd {
  border-bottom-right-radius: 1rem;
  border-bottom-left-radius: 1rem;
}

.eventsd:hover {
  box-shadow: -4px 5px 24px 1px #18bc9c;
}

.lostsd:hover {
  box-shadow: -4px 5px 24px 1px #3498db;
}

.trafficsd:hover {
  box-shadow: -4px 5px 24px 1px #2c3e50;
}

.neighborsd:hover {
  box-shadow: -4px 5px 24px 1px #e74c3c;
}

.eventbg {
  /* border: 1px solid #18bc9c;
  border-bottom: none; */
  background-color: #18bc9c;
  color:white;
}

.lostbg {
  /* border: 1px solid #3498db;
  border-bottom: none; */
  background-color: #3498db;
  color:white;
}

.trafficbg {
  /* border: 1px solid #2c3e50;
  border-bottom: none; */
  background-color: #2c3e50;
  color:white;
}

.neighborbg {
  /* border: 1px solid #e74c3c;
  border-bottom: none; */
  background-color: #e74c3c;
  color:white;
}

.userName {
  width: 50%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  /* align-items: center; */
  /* padding: 1rem; */
  font-size: 1rem;
  color: #2c3e50;
}

/* .userName p {
    padding: 0 0.5rem 0 0.5rem;
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

.left-side {
  width: 50%;
  flex-wrap: wrap;
  text-align: left;
  display: flex;
  align-items: center;
}

.right-side {
  width: 50%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.right-side i {
  font-size: 2rem;
}

.p-title {
  text-transform: uppercase;
  font-size: 1rem;
  max-width: 100%;
  /* display: inline-block; */
}

.inline {
  display: inline;
}

.deleted {
  display: inline-block;
}

@media (hover: hover) {
  .post {
    max-height: 30%;
    min-height: 30%;
  }
}
.post {
  width: 100%;
  display: flex;
  height: auto;
  /* height: 30%;
  max-height: 30%; */
  border-top-right-radius: 1rem;
  border-top-left-radius: 1rem;
  flex-wrap: wrap;
  flex-direction: row;
  margin: 0.5rem;
  /* background-color: #2c3e50; */
  transition: 0.2s;
  box-shadow: -4px 5px 24px 1px black;
}

.category {
  width: 100%;
  display: flex;
  /* justify-content: space-between;
  align-items: center; */
  /* padding: 0 1rem 0 1rem; */
  padding: 1rem;
  /* background-color: #76828e; */
  /* margin-bottom: 1rem; */
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  /* border-bottom: 1px solid black; */
}

.distance {
  padding-left: 1rem;
}

.content-holder {
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  border-top: none;
}

.content {
  width: 95%;
  height: auto;
  text-align: left;
  padding: 0.5rem;
  border: 1px solid grey;
  background-color: #ecf0f1;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* .distance {
  width: 25%;
} */

.votes {
  width: 50%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1rem;
  font-size: 1rem;
  color: #2c3e50;
}

.votes i {
  padding: 0 0.5rem 0 0;
  cursor: pointer;
}

.clickable:hover {
  cursor: pointer;
  color: white;
}

/* .time {
  width: 50%;
} */
</style>