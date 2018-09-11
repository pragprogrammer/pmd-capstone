<template>
  <div class="login">
    <div class="login-form" v-if="newUser">
      <form @submit.prevent="loginUser" class="form-group">
        <input class="form-control" type="text" name="username" placeholder="User Name" required v-model="creds.username">
        <input class="form-control" type="password" name="password" placeholder="Password" required v-model="creds.password">
        <button type="submit" class="btn btn-primary">Login</button>
      </form>
      <h5><span @click="newUser = !newUser" class="clickable">Register for an account</span></h5>
    </div>
    <div class="register-form" v-else>
      <form @submit.prevent="registerUser" class="form-group">
        <input class="form-control" type="email" name="email" placeholder="email address" required v-model="newUser.email">
        <input class="form-control" type="text" name="username" placeholder="User Name" required v-model="newUser.username">
        <input class="form-control" type="password" name="password" placeholder="Password" required v-model="newUser.password">
        <input class="form-control" type="password" name="password2" placeholder="Re-enter Password" required v-model="newUser.password2">
        <button type="submit" class="btn btn-primary">Register</button>
      </form>
      <h5><span @click="newUser = !newUser" class="clickable">Login to existing account</span></h5>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'login',
    data() {
      return {
        newUser: false,
        newUser: {
          username: '',
          password: '',
          password2: '',
          email: ''
        },
        creds: {
          username: '',
          password: ''
        }
      }
    },

    methods: {
      loginUser() {
        this.$store.dispatch('loginUser', this.creds);
        this.creds = { username: '', password: '' }
      },

      registerUser() {
        if (this.newUser.password === this.newUser.password2) {
          this.$store.dispatch('registerUser', this.newUser)
          this.newUser = {
            username: '',
            password: '',
            password2: '',
            email: ''
          }
        }
        else {
          return alert('Passwords do not match')
        }
      }
    }
  };

</script>

<style>
  .clickable:hover {
    cursor: pointer;
  }
</style>