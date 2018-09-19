<template>
  <v-app>

    <v-container fluid class="home">
      <v-layout class="row underline header">
        <v-flex class="col-4">
          <h4 class="text-white mt-2">{{activePosts.length}} bullUtins nearby</h4>
        </v-flex>
        <v-flex class="col-4">
          <BlockedUsers />
        </v-flex>
        <div class="col-4 modal-filter-btn">
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
      </v-layout>
      <div class="row display-flex post-bod">
        <div class="col-sm-12 center-post">
          <Post />
        </div>
      </div>
      <v-footer fixed color="#2c3e50" height="5vh" dark>
        <v-layout flex justify-content-start>
          <div v-if="showSettings" class="settings card">
            <button class="btn btn-outline-secondary" @click="logout('disable')">disable location sharing</button>
            <button class="btn btn-outline-danger mt-2" @click="deleteAccount">delete account</button>
            <button class="btn btn-outline-primary mt-2" @click="logout">Logout</button>
          </div>
          <i @click="showSettings = !showSettings" class="fas fa-ellipsis-v pl-3 pr-2 pt-1 clickable"></i>
          <post-form />
        </v-layout>
      </v-footer>
    </v-container>
  </v-app>
</template>

<script>
  import Post from "@/components/Post";
  import PostForm from "@/components/PostForm";
  import FilterModal from "@/components/FilterModal";
  import BlockedUsers from "@/components/BlockedUsers";
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
    data() {
      return {
        postCategory: "All",
        searchRadius: 25,
        showSettings: false,
        //showBlockedUsers: false
      };
    },
    components: {
      FilterModal,
      Post,
      PostForm,
      BlockedUsers
    },

    methods: {
      captureCoords(here) {
        let obj = {
          lat: here.coords.latitude,
          lng: here.coords.longitude
        };
        this.$store.dispatch("captureCoords", obj);
      },
      logout(disabled) {
        this.$store.dispatch("logout", disabled);
      },
      filterPosts() {
        let filters = {
          radius: this.searchRadius,
          category: this.postCategory
        };
        this.$store.dispatch("filterPosts", filters);
        $("#filterMenuModal").modal("hide");
      },

      deleteAccount() {
        if (window.confirm("Do you really want to delete your account?")) {
          this.$store.dispatch("deleteUser");
        }
        this.showSettings = false;
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
      },
      activePosts() {
        return this.$store.state.activePosts;
      }
    }
  };
</script>

<style>
  col {
    padding: 0;
  }

  .modal-filter-btn {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .header {
    background-color: #2c3e50;
    box-shadow: -5px 2px 5px 1px black;
  }

  .header h4 {
    font-size: 2rem;
  }

  .post-bod {
    height: 90vh;
    overflow-y: scroll;
    overflow-x: hidden;
    /* z-index: -1; */
    /* background: url("../assets/cork-board.jpg"); */
  }

  .center-post {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .underline {
    border-bottom: 2px solid #2c3e50;
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
    bottom: 5vh;
  }

  .add-post-btn {
    position: fixed;
    right: 5vw;
    bottom: 2vh;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    /* border: 1px solid black; */
    display: flex;
    justify-content: center;
    /* background-color: black; */
    font-size: 2rem;
  }

  .fa-ban {
    font-size: 2rem;
  }

  .add-post-btn i {
    display: flex;
    justify-content: center;
    align-self: center;
  }

  .post-bod::-webkit-scrollbar {
    width: 0.5rem;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: grey;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }

  ::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: white;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }

  .inline {
    display: inline;
  }

  .clickable {
    cursor: pointer;
  }
</style>