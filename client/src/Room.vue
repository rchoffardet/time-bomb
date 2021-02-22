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
        <h3 v-if="room.game && !room.game.ended">
            {{ currentPlayer.name }} doit couper un fil ! (fils restants: {{ wiresLeft }})
        </h3>
        <h3 v-if="room.game && room.game.doBadGuysHaveWon">
            Les méchants ont gagné !
        </h3>
        <h3 v-if="room.game && room.game.doGoodGuysHaveWon">
            Les gentils ont gagné !
        </h3>
        <div :class="{line: true, you: isYou(user)}" v-for="user in room.players" :key="user.id">
            <div :class="{user: true, host: isHost(user), bad:isBadGuy(user)}">
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
        <button @click="startGame" v-if="room.game == undefined">Commencer la partie</button>
        <button @click="startGame" v-if="room.game != undefined">Recommencer la partie</button>
        <button @click="nextRound" v-if="room.game != undefined && room.game.cutsLeftCount == 0">Tour suivant</button>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed, h, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSocket } from "./useSocket";
import  useUser from "./useUser";
import User, { createUser } from "../../src/User";
import Room, { createRoom, RoomSerialized } from "../../src/Room";
import Card from "../../src/Card";

const Component = defineComponent({
    setup() {
        const route = useRoute();
        const router = useRouter();
        const { socket } = useSocket()
        const { user } = useUser()

        const roomId = ref(route.params["roomId"] as string);
        const room = ref(reactive(createRoom()))

        const cards = computed(() => {
            if(room.value.game == null) {
                return {} as {[id:string]: Card[]} 
            }

            return room.value.game.cards
        })

        const currentPlayer = computed(() => {
            if(room.value.game == null) {
                return createUser();
            }

            return room.value.players[room.value.game.cutter];
        })

        const wiresLeft = computed(() => {
            if(room.value.game == null) {
                return 0;
            }

            return room.value.game.wiresLeft
        })

        socket.on("sync-room", (payload: RoomSerialized) => {
            room.value = reactive(Room.fromJson(payload))
        })

        socket.on("flush-room", () => {
            if(!room.value.game) {
                return;
            }
            
            room.value.game.cards = {};
        })

        socket.emit("join-room", roomId.value);

        function getInitials(name: string)
        {
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

        function isBadGuy(x: User) {
            return room.value.game?.badguysIds.includes(x.id)
        }

        function quit() {
            socket.emit("leave-room", roomId.value);
            router.push({name:"home"})
        }

        function share() {
            const route = router.resolve({name:"invite", params:{roomId:roomId.value}});
            const url = window.location.origin + "#" + route.fullPath;
            navigator.clipboard.writeText(url);
        }

        function startGame() {
            
            socket.emit("start-game", roomId.value);
        }

        function nextRound() {
            
            socket.emit("next-turn", roomId.value);
        }

        function pickCard(playerId: string, index:number) {
            
            socket.emit("pick-card", {roomId: roomId.value, playerId, index});
        }

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
            pickCard,
            isBadGuy,
            currentPlayer,
            wiresLeft,
            nextRound
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
.user.bad  {
    background-color: red;
}

.cards {
    flex: 1;
    width: 50px;
    display: flex;
    flex-direction: row;
    padding: 10px;
}
.card {
    height: 100%;
    width: 65px;
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

.you:hover .card .inner{
    transform: rotateY(180deg)
}
</style>