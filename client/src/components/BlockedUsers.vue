<template>
  <div class="text-xs-center">
    <v-menu offset-y offset-overflow>
      <v-btn slot="activator" class="btn btn-secondary">
        Blocked
      </v-btn>
      <v-list>
        <v-list-tile v-for="(blockedUser, index) in blockedUsers" :key="index" @click="">
          <v-list-tile-title>
            <BlockedUserProfile v-bind:blockedUser="blockedUser" />
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
  import BlockedUserProfile from '@/components/BlockedUserProfile';
  export default {
    name: "BlockedUsers",

    components: {
      BlockedUserProfile
    },
    data() {
      return {

      }
    },

    methods: {

    },

    computed: {
      posts() {
        return this.$store.state.activePosts;
      },

      blockedUsers() {
        let users = this.$store.state.user.blockedUsers
        return Object.keys(users).map(function (key) {
          return { "userId": key, "username": users[key] }
        })
      }
    }
  };
</script>