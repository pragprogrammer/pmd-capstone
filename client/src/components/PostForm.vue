<template>
  <v-layout class="post-form">
    <v-dialog v-model="addPost" transition="dialog-bottom-transition">
      <i v-if="!addPost" slot="activator" @click="addPost = !addPost" class="btn btn-info fas fa-plus add-post-btn"></i>
      <i v-else slot="activator" @click="addPost = !addPost" id="minus-form" class="btn btn-danger fas fa-plus add-post-btn"></i>
      <v-card>
        <v-card-title id="form-title">create a post</v-card-title>
        <form @submit.prevent="verifyPost" id="form-body">
          <v-text-field v-model="post.title" maxlength="30" placeholder="title" type="string" required v-validate="'required|max:30'"
            data-vv-name="val.title" :error-messages="errors.collect('val.title')"></v-text-field>
          <v-textarea v-model="post.content" outline maxlength="140" counter placeholder="post content" clearable
            clear-icon="X" type="string" required></v-textarea>
          <v-radio-group v-model="post.category" label="#category">
            <v-radio append-icon="this" v-for="c in catOptions" :key="c" :label="c" :value="c" required></v-radio>
          </v-radio-group>
          <v-flex justify-content-center>
            <v-btn @click="submit" round color="#18bc9c">submit</v-btn>
          </v-flex>
        </form>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  export default {
    name: "postForm",
    $_veeValidate: {
      validator: "new"
    },
    data() {
      return {
        addPost: false,
        post: {
          title: "",
          content: "",
          category: ""
        },
        catOptions: [
          "event",
          "lost and found",
          "traffic update",
          "neighborhood watch"
        ],
        valForm: {
          val: {
            title: {
              required: () => "Every post needs a title",
              max: "Title cannot be longer than 30 characters"
            }
          }
        }
      };
    },
    mounted() {
      this.$validator.localize("en", this.valForm);
    },

    methods: {
      submit() {
        this.$validator.validateAll();
      },
      verifyPost() {
        console.log(this.post.content)
      },

      createPost() {
        this.$store.dispatch('addPost', this.post)
        this.post = {
          title: "",
          content: "",
          category: ""
        }
      }
    }
  };
</script>

<style>
  #form-title {
    background-color: #3498db;
  }

  #form-body {
    background-color: #7cbce8;
  }

  #minus-form {
    transform: rotate(45deg);
  }
</style>