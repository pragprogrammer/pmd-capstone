<template>
  <div id="app">
    <router-view class="our-app" />
  </div>
</template>

<style>
#app {
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif; */
  font-family: "Fira Sans Condensed", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #ecf0f1;
  width: 100%;
  height: 100%;
}
#app::-webkit-scrollbar {
  display: none;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #3498db;
}

#nav a.router-link-exact-active {
  color: #18bc9c;
}

/* h3,
  h4,
  h5,
  h6,
  p {
    
  } */
</style>