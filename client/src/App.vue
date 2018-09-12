<template>
  <div id="app" class="bg-secondary">
    <div id="nav" class="text-info">
      <router-link to="/">Home |</router-link>
      <router-link to="/about"> About</router-link>
    </div>
    <router-view />
  </div>
</template>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  #nav {
    padding: 30px;
  }

  #nav a {
    font-weight: bold;
    color: #2C3E50;
  }

  #nav a.router-link-exact-active {
    color: #18BC9C;
  }
</style>