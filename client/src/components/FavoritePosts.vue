<template>
  <div class="favoriteposts">
    <h2>FAVORITE POSTS</h2>
      <v-carousel
      interval=60000
      hide-delimiters
      >
        <v-carousel-item
        v-for="post in favorites"
        :key="post._id"
        >
        <div id="favoritecontainer" :class="[{eventFav:post.category=='event'},{lostFav:post.category=='lost and found'},{trafficFav:post.category=='traffic update'},{neighborFav:post.category=='neighborhood watch'}]">
          <div id="favcontent">
            <div class="favheader">
              <div class="favtitle">
                <h3>{{post.title}}</h3>
              </div>
              <div class="favstar">
                <i @click="removeFavorite(post)" class="fas fa-star star"></i>
              </div>
            </div>
            <div class="favcon">
              <h5>{{post.content}}</h5>
            </div>
            <div class="specs">
              <h5>{{parseFloat(post.distance.toFixed(2))}} miles away</h5>              
            </div>
          </div>
        </div>
        </v-carousel-item>
      </v-carousel>
    </div>
</template>
<script>
export default {
  name: "favoritePost",
  computed: {
    favorites() {
      return this.$store.state.favoritePosts;
    }
  },
  methods: {
    removeFavorite(post) {
      this.$store.dispatch("removeFavorite", post);
    }
  }
};
</script>
<style scoped>
#favoritecontainer {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
}
.v-carousel {
  height: 250px;
}
#favcontent {
  height: 100%;
  width: 70%;
  display: flex;
  justify-content: center;
  /* align-items: center; */
  flex-wrap: wrap;
  color: white;
}

.favcon {
  width: 100%;
}

#favoritecontainer h3,
h5 {
  margin: 0;
}
.eventFav {
  background-color: #18bc9c;
}
.lostFav {
  background-color: #3498db;
}
.trafficFav {
  background-color: #2c3e50;
}
.neighborFav {
  background-color: #e74c3c;
}
.favheader {
  width: 100%;
  display: flex;
}
.favtitle {
  width: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.favstar {
  width: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.favstar * {
  font-size: 1.3rem;
}

/* h3 {
  margin: 0;
} */
</style>

