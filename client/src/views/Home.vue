<template>
  <div class="home container-fluid">
    <div class="row underline header">
      <div class="col-6 welcome">
        <h4 class="text-primary mt-4 welcome">Welcome {{user.username}}!</h4>
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
    <div class="row display-flex post-bod">
      <div class="col-sm-12 center-post">
        <Post />
      </div>
    </div>
    <v-footer fixed color="#7cbce8" height="5vh" dark>
      <v-layout flex justify-content-start>
        <div v-if="showSettings" class="settings card">
          <button class="btn btn-outline-secondary" @click="disableLocation">disable location sharing</button>
          <button class="btn btn-outline-danger" @click="deleteAccount">delete account</button>
          <button class="btn btn-outline-primary mt-3" @click="logout">Logout</button>
        </div>
        <i @click="showSettings = !showSettings" class="fas fa-ellipsis-v pl-3 pr-2 pt-1"></i>
        <post-form />
      </v-layout>
    </v-footer>
  </div>
</template>

<script>
  import Post from "@/components/Post";
  import PostForm from "@/components/PostForm";
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
    data() {
      return {
        postCategory: "All",
        searchRadius: 25,
        showSettings: false
      };
    },
    components: {
      FilterModal,
      Post,
      PostForm
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
      }
    }
  };
</script>

<style>
<<<<<<< HEAD
  .home {
    min-height: 100vh;
  }

  .header {
    background: #7cbce8;
  }

  .welcome {
    font-weight: bolder;
  }

  .post-bod {
    height: 90vh;
    overflow-y: scroll;
    overflow-x: hidden;
    background-color: #2c3e50;
  }

  /* .home::-webkit-scrollbar {
    display: none;
  } */

  .center-post {
    display: flex;
    justify-content: center;
    align-items: center;
  }
=======
.post-bod {
  height: 90vh;
  overflow-y: scroll;
  overflow-x: hidden;
  background-color: #2c3e50;
}

.center-post {
  display: flex;
  justify-content: center;
  align-items: center;
}

.underline {
  border-bottom: 2px solid #2c3e50;
}
>>>>>>> a012e119a91ee6137fc63c5d84256ea4adab0cc7

  .underline {
    border-bottom: 2px solid #2c3e50;
  }

  .form-group select {
    border: 1px solid #2c3e50;
    min-width: 2rem;
    text-align-last: center;
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

<<<<<<< HEAD
  .add-post-btn {
    position: fixed;
    right: 5vw;
    bottom: 3vh;
    padding-bottom: 0.25rem;
    font-size: 2rem;
    border-radius: 50%;
    box-shadow: 1px 0 3px #ecf0f1;
  }
=======
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
>>>>>>> a012e119a91ee6137fc63c5d84256ea4adab0cc7
</style>