<template>
  <div class="home row">
    <div class="col-sm-6 col-md-4">
      <h3>Welcome {{user.username}}!</h3>
      <button class="btn btn-danger mb-3" @click="logout">Logout</button>
    </div>
  </div>
</template>

<script>


  export default {
    name: 'home',
    created() {
      //block users not logged in
      if (!this.$store.state.user._id) {
        this.$router.push({ name: 'login' })
      }
    },

    computed: {
      user() {
        return this.$store.state.user
      }
    }

  }
</script>