<template>
  <v-layout class="post-form">
    <v-dialog v-model="addPost" transition="dialog-bottom-transition">
      <button v-if="!addPost" slot="activator" @click="addPost = !addPost" class="v-step-2 btn-info add-post-btn">
        <i class="fas fa-plus text-primary"></i>
        </button>
        <button v-else slot="activator" @click="addPost = !addPost" id="minus-form" class="btn-danger add-post-btn">
        <i class="fas fa-plus"></i>
        </button>
      <v-card>
        <v-card-title id="form-title">create a post</v-card-title>
        <form class="vue-form" id="form-body">
          <v-text-field v-model="post.title" :counter="30" placeholder="title" type="string" required v-validate="'required|max:30'"
            data-vv-name="title" :error-messages="errors.collect('title')"></v-text-field>
          <v-textarea class="text-area-vue" v-model="post.content" outline :counter="140" placeholder="post content" no-resize clearable clear-icon="X"
            type="string" required v-validate="'required|max:140'" data-vv-name="content" :error-messages="errors.collect('content')"></v-textarea>
          <v-radio-group v-model="post.category" label="#category" v-validate="'required|included:0,1,2,3'"
            data-vv-name="category" :error-messages="errors.collect('category')">
            <v-radio append-icon="this" v-for="(c, i) in catOptions" :key="c" :label="c" :value="i" required></v-radio>
          </v-radio-group>
          <v-flex justify-content-center>
            <v-btn @click="submit" round color="#3498db">submit</v-btn>
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
          },
          content: {
            required: () => "Every post needs a content body",
            max: "Content cannot be longer than 140 characters"
          },
          category: {
            required: () => "Every post needs a category"
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
      this.$validator.validateAll().then(res => {
        if (!res) {
          return;
        }
        this.post.category = this.catOptions[this.post.category];
        this.createPost();
        this.addPost = false;
      });
    },
    createPost() {
      this.$store.dispatch("addPost", this.post);
      this.$emit("hidePostFormModal()");
      this.post = {
        title: "",
        content: "",
        category: ""
      };
    }
  }
};
</script>

<style>
#form-title {
  background-color: #2c3e50;
}

#form-body {
  background-color: #707c87;
}

#minus-form {
  transform: rotate(45deg);
}

.v-text-field__slot textarea {
  margin: 0 !important;
  /* margin-top: 0 !important; */
}

.vue-form {
  padding: 0 1rem 0 1rem;
}
</style>