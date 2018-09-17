<template>
    <v-layout class="user-profile">
        <v-dialog v-model="showUserProfile" fullscreen transition="scale-transition">
            <p @click="getTargetUser" class="u-nme" slot="activator"><strong>{{post.userName}}</strong></p>
            <v-card>
                <v-toolbar>
                    <v-btn @click.native="showUserProfile = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                <v-toolbar-title>{{post.userName}}</v-toolbar-title>
                </v-toolbar>
                <div class="profile-content">
                    <p class="created">Member since: {{user.created}}</p>
                </div>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
let moment = require("moment");

export default {
  name: "userProfile",
  props: ["post"],
  data() {
    return {
      showUserProfile: false
    };
  },
  computed: {
    user() {
      return this.$store.state.targetUser;
    }
  },
  methods: {
    getTargetUser() {
      this.$store.dispatch("getTargetUser", this.post.userId);
    }
  }
};
</script>

<style scoped>
.u-nme:hover {
  text-decoration: underline;
  cursor: pointer;
}
</style>
