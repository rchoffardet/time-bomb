<template>
    <h1>Qui es-tu ?</h1>
    <input ref="username" id="username" type="text" v-model="user.name" />
    <br />
    <input type="button" value="Ok" @click="register" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import useUser from "./useUser";

export default defineComponent({
    setup() {        
        const {user} = useUser()

        function register() {
            user.registered = true;
        }

        return {
            user,
            register
        }
    }
});

</script>

<style>

</style>