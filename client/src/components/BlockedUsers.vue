<template>
  <div class="text-xs-center block">
    <v-menu offset-y offset-overflow>
      <button slot="activator" class="btn btn-outline-info mt-2 blkbtn">
        Blocked Users
      </button>
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

<style>
  .blkbtn {
    padding-left: 40px;
    padding-right: 40px;
  }
</style>