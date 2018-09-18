<template>
    <v-layout class="contact-user">
        <v-dialog v-model="showContactUser" transition="dialog-bottom-transition">
            <v-icon slot="activator">fa-envelope</v-icon>
        </v-dialog>
    </v-layout>
</template>

<script>
export default {
    name: 'contactUser',
    props: ['email']
}
</script>

<style>

</style>
