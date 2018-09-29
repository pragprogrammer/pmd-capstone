<template>
  <v-layout class="user-profile">
    <v-dialog v-model="showUserProfile" fullscreen transition="scale-transition">
      <p @click="getTargetUser" class="v-step-3 u-nme" slot="activator"><strong>{{post.userName}}</strong></p>
      <v-card>
        <v-toolbar>
          <v-btn @click.native="showUserProfile = false">
            <v-icon @click="clearTargetUser">close</v-icon>
          </v-btn>
          <v-toolbar-title>{{post.userName}}</v-toolbar-title>
        </v-toolbar>
        <div v-if="target.username" class="profile-content">
          <h2 class="mt-1">AGE</h2>
          <span class="days-old">
            <v-icon>fa-birthday-cake</v-icon>
            <p>{{target.created | daysOld}}</p>
          </span>
          <p class="created">Member since: {{target.created | moment("MMMM Do, YYYY")}}</p>
          <hr>
          <h2>RELIABILITY</h2>
          <div class="progresses">
            <v-progress-circular v-if="target.reliability <= 10" color="#ff5252" size="150" :width="20" :value="target.reliability"
              :rotate="90">{{target.reliability}}</v-progress-circular>
            <v-progress-circular v-if="target.reliability <= 25 && target.reliability > 10" color="#ffc107" size="150"
              :width="20" :value="target.reliability" :rotate="90">{{target.reliability}}</v-progress-circular>
            <v-progress-circular v-if="target.reliability <= 60 && target.reliability > 25" color="#2196f3" size="150"
              :width="20" :value="target.reliability" :rotate="90">{{target.reliability}}</v-progress-circular>
            <v-progress-circular v-if="target.reliability <= 100 && target.reliability > 60" color="#4caf50" size="150"
              :width="20" :value="target.reliability" :rotate="90">{{target.reliability}}</v-progress-circular>
          </div>
          <hr>
          <contact-user :email="target.email" :post="post" :targetName="post.userName" />
          <hr>
          <div v-if="user._id != post.userId" class="user-action">
            <h2>BLOCK USER</h2>
            <v-icon class="clickable" @click="blockUser()">fa-ban</v-icon>
          </div>
          <div v-else>
            <p>favorites style here!</p>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  let moment = require("moment");
  import ContactUser from "@/components/ContactUser";

  export default {
    name: "userProfile",
    props: ["post"],
    data() {
      return {
        showUserProfile: false
      };
    },
    computed: {
      target() {
        return this.$store.state.targetUser;
      },
      user() {
        return this.$store.state.user
      }
    },
    methods: {
      getTargetUser() {
        this.$store.dispatch("userPosts", this.post.userId);
        this.$store.dispatch("getTargetUser", this.post.userName);
      },

      blockUser() {
        console.log("block user ", this.post.userId, this.post.userName)
        this.$store.dispatch('blockUser', { 'userId': this.post.userId, 'username': this.post.userName })
      },

      clearTargetUser() {
        this.$store.dispatch('getTargetUser', {})
      }
    },
    filters: {
      daysOld(date) {
        return moment(date).fromNow(true);
      }
    },
    components: {
      ContactUser
    }
  };

</script>

<style scoped>
  .u-nme:hover {
    text-decoration: underline;
    cursor: pointer;
  }

  .profile-content {
    text-align: left;
    margin-left: 5%;
    overflow-y: scroll;
  }

  .profile-content hr {
    position: relative;
    left: -5%;
  }

  .days-old {
    display: flex;
    height: fit-content;
  }

  .days-old i {
    font-size: 5rem;
  }

  .days-old p {
    font-size: 5rem;
    margin-left: 5%;
  }

  .created {
    font-size: 1.5rem;
  }

  p {
    margin-bottom: 0;
  }

  .progresses {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-left: -5%;
  }

  .user-action {
    display: flex;
    justify-content: space-between;
  }

  .user-action i {
    font-size: 3rem;
    margin-right: 5%;
  }

  .clickable {
    cursor: pointer;
  }
</style>