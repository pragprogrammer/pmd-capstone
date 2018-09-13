<template>
  <div class="login container-fluid">
    <div class="row">
      <div class="col-12 text-center">
        <h1 class="title">bullUtin</h1>
      </div>
      <div class="user-input col-sm-8 offset-sm-2 col-md-4 offset-md-4">
        <div class="form-group" v-if="prevUser">
          <form @submit.prevent="loginUser" class="form-group" autocomplete="off">
            <input class="form-control" type="username" name="username" placeholder="username" required v-model="creds.username">
            <input class="form-control" type="password" name="password" placeholder="Password" required v-model="creds.password">
            <button type="submit" class="btn btn-primary mt-2">Login</button>
          </form>
          <h5><span @click="prevUser = !prevUser" class="clickable">Register for an account</span></h5>
        </div>
        <div class="register-form" v-else>
          <form @submit.prevent="registerUser" class="form-group" autocomplete="off">
            <input class="form-control" type="email" name="email" placeholder="email address" required v-model="newUser.email">
            <input class="form-control" type="text" name="username" placeholder="User Name" required v-model="newUser.username"
              @focusout="userExists">
            <input class="form-control" type="password" name="password" placeholder="Password" required v-model="newUser.password">
            <input class="form-control" type="password" name="password2" placeholder="Re-enter Password" required
              v-model="newUser.password2">
            <button type="submit" class="btn btn-primary mt-2">Register</button>
          </form>
          <h5><span @click="prevUser = !prevUser" class="clickable">Login to existing account</span></h5>
        </div>
      </div>
      <div class="image col-12 no">
        <img src="../assets/Bulletin-Boards.png" width="100%" height="auto" alt="Bulletin Board">
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'login',
    mounted() {
      if (confirm("may we use your location?")) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(this.captureCoords);
        }
        else {
          alert("your browser doens't support HTML5 Geolocation")
        }
      }
      else {
        alert('bullUtin works better with location access')
      }

      this.$store.dispatch('authenticate')
    },

    data() {
      return {
        prevUser: true,
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
      captureCoords(here) {
        let obj = {
          lat: here.coords.latitude,
          lng: here.coords.longitude
        }
        this.$store.dispatch("captureCoords", obj)
      },
      loginUser() {
        this.$store.dispatch('getPosts', 25)
        this.$store.dispatch('loginUser', this.creds);
        this.creds = { username: '', password: '' }
      },
      registerUser() {
        if (this.newUser.password === this.newUser.password2) {
          this.$store.dispatch('getPosts', 25)
          this.$store.dispatch('registerUser', this.newUser)
          this.newUser = {
            username: '',
            password: '',
            password2: '',
            email: ''
          }
        }
        else {
          alert('Passwords do not match')
        }
      },
      userExists() {
        this.$store.dispatch('userExists', this.newUser.username)
      }
    }
  };
</script>

<style>
  .clickable:hover {
    cursor: pointer;
  }

  .login {
    min-height: 100vh;
  }

  .title {
    color: #2C3E50;
    font-family: 'Lobster', cursive;
  }

  .user-input {
    margin-bottom: -10;
  }

  @media only screen and (min-width: 768px) {
    h1 {
      font-size: 5rem;
    }
  }
</style>