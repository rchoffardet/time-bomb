import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";
import Home from "./Home.vue";
import Room from "./Room.vue";
import Invite from "./Invite.vue";

const routes = [
 { path: '/', name:"home", component: Home },
 { path: '/room/:roomId', name:"room", component: Room },
 { path: '/invite/:roomId', name:"invite", component: Invite },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router;