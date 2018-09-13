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
    <div class="row">
      <div class="col-sm-12">
        <!-- {{posts}} -->
        <Post />
      </div>
    </div>
    <v-footer fixed color="#7cbce8" height="fit-content" dark>
      <v-layout>
        <button class="btn btn-danger mb-3" @click="logout">Logout</button>
      </v-layout>
    </v-footer>
  </div>
</template>

<script>
  import Post from '../components/Post'
  import FilterModal from '../components/FilterModal'
  export default {
    name: 'home',
    created() {
      //block users not logged in
      if (!this.$store.state.user._id) {
        this.$router.push({ name: 'login' })
      }
    },

    components: {
      FilterModal,
      Post
    },

    data() {
      return {
        postCategory: 'All',
        searchRadius: 25
      }
    },
    mounted: function getPosts() {
      this.$store.dispatch('getPosts', 25)
    },

    methods: {
      logout() {
        this.$store.dispatch('logout')
      },

      filterPosts() {
        let filters = {
          radius: this.searchRadius,
          category: this.postCategory
        }
        this.$store.dispatch('filterPosts', filters)
        $('#filterMenuModal').modal('hide')
      }

    },

    computed: {
      user() {
        return this.$store.state.user
      },
      // posts() {
      //   return this.$store.state.activePosts
      // }


    }

  }
</script>

<style>
  .home {
    min-height: 100vh;
  }
  .underline {
    border-bottom: 2px solid #2C3E50;
  }
  .form-group select {
    border: 1px solid #2c3e50;
    min-width: 2rem;
    text-align-last: center;
  }
</style>