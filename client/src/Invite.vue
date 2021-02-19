<template>
  <h1>Rejoindre la partie</h1>
  <label for="username">Ton nom : </label>
  <input ref="username" id="username" type="text" v-model="user.name" />
  <br />
  <input type="button" value="Rejoindre la partie" @click="registerAndJoinRoom" />
</template>

<script lang="ts">
import { ref, defineComponent, watch, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSocket } from "./useSocket";
import Room from "./Room";
import { useStorage } from "./useStorage";
import User from "./User";
import { useRoom } from "./useRoom";

const Component = defineComponent({
    setup() {        
        const {getJson, setJson} = useStorage();
        const userValue = getJson("user", User.fromName(""));
        const user = reactive(userValue)

        watch(user, (newValue) => {
            setJson("user", newValue);
        })

        const router = useRouter();
        const route = useRoute();
        const {socket} = useSocket();
        const {register, joinRoom} = useRoom(socket)
        
        const roomId = ref(route.params["roomId"] as string);

        function registerAndJoinRoom() {
            register(user);
            joinRoom(roomId.value);
            router.push({name: "room", params:{roomId: roomId.value}})
        }

        return {
            user, 
            registerAndJoinRoom
        }
    }
});

export default Component

</script>

<style>
</style>