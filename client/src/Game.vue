<template>
    <login v-if="!user.registered"></login>
    <router-view  v-else/>
</template>
<script lang="ts">
import { defineComponent, watch, reactive, onMounted } from "vue";
import useUser from "./useUser";
import Login from "./Login.vue"
import { useSocket } from "./useSocket";
import User from "../../src/User";

export default defineComponent({
    setup() {
        const { socket } = useSocket();
        const { user } = useUser();

        function sync(user: User)
        {
            socket.emit("sync-user", user);
            console.log("synced")

        }

        watch(user, (_) => sync(_))
        sync(user)

        return {
            user
        }
    },
    components: {
        Login
    },
});
</script>

<style>

</style>