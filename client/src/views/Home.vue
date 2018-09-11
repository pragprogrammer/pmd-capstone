<template>
  <div class="home">
    <h1>Welcome to the main page!</h1>
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
    }

  }
</script>