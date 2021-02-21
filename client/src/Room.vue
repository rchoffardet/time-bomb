<template>
    <h1>Room #{{roomId}}</h1>
    <nav>
        <button @click="share">Partager</button>
        <button @click="quit">Quitter la partie</button>
    </nav>
    <div v-if="false">
        <h2>participants</h2>
        <ul>
            <li v-for="user in room.players">
                {{user.name}} (#{{user.id}})
            </li>
        </ul>
    </div>
    <div class="board" v-if="true">
        <div :class="{line: true, you: isYou(user)}" v-for="user in room.players" :key="user.id">
            <div :class="{user: true, host: isHost(user)}">
                {{ getInitials(user.name) }}
            </div>
            <div class="cards">
                <div :class="{card:true, picked:card.picked}" v-for="(card, index) in cards[user.id]" :key="index" @click="pickCard(user.id, index)">
                    <div class="inner">
                        <div :class="['frontside', card.type]"></div>
                        <div :class="'backside'"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-if="isHost(user)">
        <button @click="startGame">Commencer la partie</button>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed, h } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSocket } from "./useSocket";
import  useUser from "./useUser";
import User from "../../src/User";
import Room from "../../src/Room";
import { uid } from "uid";
import Card from "../../src/Card";

const Component = defineComponent({
    setup() {
        const route = useRoute();
        const router = useRouter();
        const { socket } = useSocket()
        const { user } = useUser()

        const roomId = ref(route.params["roomId"] as string);
        const room = ref<Room>(new Room(uid(), new User(uid(), ""), undefined))

        const cards = computed(() => {
            if(room.value.game == null) {
                return {} as {[id:string]: Card[]} 
            }

            return room.value.game.cards
        })

        socket.on("sync-room", (payload: Room) => {
            room.value = payload
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

        function isHost(x: User) {
            return user.id == room.value.host.id
        }

        function isYou(x: User) {
            return user.id ==  x.id
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

        function startGame() {
            
            socket.emit("start-game", roomId.value);
        }

        function pickCard(playerId: string, index:number) {
            
            socket.emit("pick-card", {roomId: roomId.value, playerId, index});
        }

        onMounted(() => {
        })

        return {
            roomId,
            quit,
            room,
            share,
            getInitials,
            isHost,
            user,
            isYou,
            startGame,
            cards,
            pickCard
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
.you .user {
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

.card .inner .frontside.wire{
  background-color: lime;
}

.card.picked .inner{
    transform: rotateY(180deg)
}

.you .card:hover .inner{
    transform: rotateY(180deg)
}
</style>