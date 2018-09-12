<template>
  <div class="home row">
    <div class="col-5">
      <h5>Welcome {{user.username}}!</h5>
      <button class="btn btn-danger mb-3" @click="logout">Logout</button>
    </div>
    <div class="col-6 offset-1">
      <FilterModal :postCategory="postCategory">
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
            <option value='lost&found'>lost & found</option>
            <option value='traffic-update'>traffic update</option>
            <option value='neighborhood-watch'>neighborhood watch</option>
          </select><br>
          <button type="button" class="btn btn-secondary mt-3 mr-3" data-dismiss="modal">Close</button>
          <button type="submit" class="btn btn-primary mt-3">Apply Filters</button>
        </form>
      </FilterModal>
    </div>
    {{posts}}
  </div>
</template>

<script>

  import FilterModal from '../components/FilterModal'
  export default {
    name: 'home',
    created() {
      //block users not logged in
      if (!this.$store.state.user._id) {
        this.$router.push({ name: 'login' })
      }
    },

    // mounted: function getPosts() {

    // },

    components: {
      FilterModal
    },

    data() {
      return {
        menusVisible: false,
        postCategory: 'All',
        searchRadius: 25
      }
    },

    methods: {
      logout() {
        this.$store.dispatch('logout')
      },

      applyFilters() {
        let filters = {
          searchRadius: this.searchRadius,
          category: this.postCategory
        }
        this.$store.dispatch('applyFilters', filters)
      }

    },

    computed: {
      user() {
        return this.$store.state.user
      },
      posts() {
        return this.$store.state.posts
      }


    }

  }
</script>