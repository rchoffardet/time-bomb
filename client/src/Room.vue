<template>
    <h1>Room #{{roomId}}</h1>
    <nav>
        <button @click="share">Partager</button>
        <button @click="quit">Quitter la partie</button>
    </nav>
    <div v-if="true">
        <h2>participants</h2>
        <ul>
            <li v-for="user in users">
                {{user.name}} (#{{user.id}})
            </li>
        </ul>
    </div>
    <div class="board" v-if="true">
        <div class="line" v-for="user in users" :key="user.id">
            <div class="user you">
                {{ getInitials(user.name) }}
            </div>
            <div class="cards">
                <div class="card" v-for="index in 5" :key="index">
                    <div class="inner">
                        <div class="frontside neutral"></div>
                        <div class="backside"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div>
        <button>Commencer la partie</button>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSocket } from "./useSocket";
import User from "./User";

const Component = defineComponent({
    setup() {
        const route = useRoute();
        const router = useRouter();
        const { socket } = useSocket()

        const roomId = ref(route.params["roomId"] as string);
        const users = ref<User[]>([])
        socket.on("sync-room", (payload: User[]) => {
            console.log(payload)
            users.value = payload
        })
        socket.emit("join-room", roomId.value);

        function getInitials(name: string)
        {
            console.log(name)
            return name
                .split(" ")
                .slice(0, 2)
                .map(x => x.substr(0, 1))
                .join("")
                .toUpperCase();
        }

        function quit() {
            socket.emit("leave-room", roomId.value);
            router.push({name:"home"})
        }

        function share() {
            const route = router.resolve({name:"invite", params:{roomId:roomId.value}})
            const url = window.location.origin + "#" + route.fullPath;
            navigator.clipboard.writeText(url);
        }

        onMounted(() => {
        })

        return {
            roomId,
            quit,
            users,
            share,
            getInitials
        }
    }
});

export default Component
</script>

<style lang="postcss">
.board {
    margin: auto;
    width: 600px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
}
.line {
    height: 100px;
    display: flex;
    flex-direction: row;
    flex: 1;
    margin-bottom: 25px;
}
.user {
    height: 100px;
    line-height: 100px;
    width: 100px;
    font-size: 50px;
    color: black;
    background-color: white;
    border: 5px solid lightblue;
    border-radius: 100px;
    margin-right: 50px;
}
.user.you {
    border: 5px solid gold;
}
.cards {
    flex: 1;
    display: flex;
    flex-direction: row;
    padding: 10px;
}
.card {
    height: 100%;
    flex: 1;
    margin: 0 10px;
    background-color: transparent;
    perspective: 1000px;
}
.card .inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 400ms ease-in-out;
    transform-style: preserve-3d;
}

.card .inner .frontside, .card .inner .backside {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
}

.card .inner .backside {
  background-color: blue;
}

.card .inner .frontside {
  background-color: gray;
  transform: rotateY(180deg);
}

.card .inner .frontside.bigben{
  background-color: red;
}

.card .inner .frontside.neutral{
  background-color: gray;
}

.card .inner .frontside.good{
  background-color: lime;
}


.card:hover .inner{
    transform: rotateY(180deg)
}
</style>