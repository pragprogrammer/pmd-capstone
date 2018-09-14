<template>
  <div class="home container-fluid">
    <div class="row underline">
      <div class="col-12">
        <h4 class="text-primary mt-3">Welcome {{user.username}}!</h4>
      </div>
      <FilterModal :postCategory="postCategory" :searchRadius="searchRadius">
        <form @submit.prevent="filterPosts" class="form-group">
          <label for="search-radius">Search Radius(mi)</label>
          <select name="search-radius" v-model="searchRadius" class="mr-2 ml-1">
            <option value=5>5</option>
            <option value=10>10</option>
            <option value=15>15</option>
            <option value=20>20</option>
            <option value=25 selected>25</option>
          </select><br>
          <label for="category">Post Category</label>
          <select name="category" v-model="postCategory" class="ml-1">
            <option value='All'>All</option>
            <option value='event'>event</option>
            <option value='lost and found'>lost and found</option>
            <option value='traffic update'>traffic update</option>
            <option value='neighborhood watch'>neighborhood watch</option>
          </select><br>
          <button type="button" class="btn btn-secondary mt-3 mr-3" data-dismiss="modal">Close</button>
          <button type="submit" class="btn btn-primary mt-3">Apply Filters</button>
        </form>
      </FilterModal>
    </div>
    <div class="post-bod mb-3">
      <div class="row">
        <div class="col-sm-12">
          <Post />
        </div>
      </div>
    </div>
    <v-footer fixed color="#7cbce8" height="5vh" dark>
      <v-layout flex justify-content-start>
        <div v-if="showSettings" class="settings card">
          <button class="btn btn-outline-secondary">disable location sharing</button>
          <button class="btn btn-outline-danger">delete account</button>
          <button class="btn btn-outline-primary mt-3" @click="logout">Logout</button>
        </div>
        <i @click="showSettings = !showSettings" class="fas fa-ellipsis-v pl-3 pr-2 pt-1"></i>
      </v-layout>
    </v-footer>
  </div>
</template>

<script>
import Post from "@/components/Post";
import FilterModal from "@/components/FilterModal";
export default {
  name: "home",
  created() {
    //block users not logged in
    if (!this.$store.state.user._id) {
      this.$router.push({ name: "login" });
    } else {
      navigator.geolocation.getCurrentPosition(this.captureCoords);
    }
  },

  components: {
    FilterModal,
    Post
  },

  data() {
    return {
      postCategory: "All",
      searchRadius: 25,
      showSettings: false
    };
  },
  methods: {
    captureCoords(here) {
      let obj = {
        lat: here.coords.latitude,
        lng: here.coords.longitude
      };
      this.$store.dispatch("captureCoords", obj);
    },
    logout() {
      this.$store.dispatch("logout");
    },
    filterPosts() {
      let filters = {
        radius: this.searchRadius,
        category: this.postCategory
      };
      this.$store.dispatch("filterPosts", filters);
      $("#filterMenuModal").modal("hide");
    }
  },

  computed: {
    user() {
      return this.$store.state.user;
    }
  }
};
</script>

<style>
.home {
  min-height: 100vh;
}
.post-bod {
  height: 85vh;
  overflow-y: scroll;
}
.post-bod::-webkit-scrollbar {
  display: none;
}
.underline {
  border-bottom: 2px solid #2c3e50;
}
.form-group select {
  border: 1px solid #2c3e50;
  min-width: 2rem;
  text-align-last: center;
}
.settings {
  display: flex;
  width: fit-content;
  position: absolute;
  bottom: 6vh;
}
</style>