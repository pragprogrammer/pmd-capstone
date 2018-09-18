<template>
    <v-expansion-panel class="contact-user">
        <v-expansion-panel-content>
            <h2 slot="header">EMAIL {{post.userName.toUpperCase()}}</h2>
            <v-card>
                <form v-if="email" class="contact-form" :action="formSpreeTarget" method="POST">
                    <hr>
                    <input type="text" placeholder=" title" name="title" required />
                    <textarea type="text" placeholder=" content" name="content" required></textarea>
                    <div class="under-the-hood">
                        <input type="text" name="post-reference" :value="post.title" />
                        <input type="text" name="_replyto" :value="user.email" />
                    </div>
                    <button type="submit" class="btn btn-info">send</button>
                </form>
            </v-card>
        </v-expansion-panel-content>
    </v-expansion-panel>


</template>

<script>
export default {
    name: 'contactUser',
    props: ['email', 'post'],
    data() {
        return {
            formSpreeTarget: "https://formspree.io/"+this.email+".com"
        }
    },
    computed: {
        user(){
            return this.$store.state.user
        }
    }
}
</script>

<style>
.contact-user {
    margin-left: -5%;
}
.contact-user h2 {
    margin-left: 5%;
}
.contact-form {
    display: flex;
    flex-flow: wrap column;
}
.contact-form input, .contact-form textarea {
    background-color: #f5f5f5;
    margin: 1vh 0 1vh 7.5%;
    width: 90%
}
.contact-form button {
    width: fit-content;
    margin: 0 auto;
}
.under-the-hood {
    display: none;
}
</style>
