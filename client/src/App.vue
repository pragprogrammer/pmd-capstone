<template>
  <div id="app" class="bg-light">
    <router-view />
  </div>
</template>

<style>
  #app {
    /* font-family: 'Avenir', Helvetica, Arial, sans-serif; */
    font-family: 'Fira Sans Condensed', sans-serif;
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
    color: #3498DB;
  }

  #nav a.router-link-exact-active {
    color: #18BC9C;
  }

  /* h3,
  h4,
  h5,
  h6,
  p {
    
  } */
</style>