import { Server, Socket } from "socket.io";
import Room from "../../../src/Room";
import RoomStore from "../Rooms/RoomStore";
import UserStore from "../Users/UserStore";
import User from "../../../src/User";

export default class SocketManager
{
    constructor(
        public socket: Socket,
        public server: Server,
        private roomStore: RoomStore,
        private userStore: UserStore,
    ){ }

    join(room: Room) {
        this.socket.join(room.id);
    }

    leave(room: Room) {
        this.socket.leave(room.id);
    }

    get rooms() {
        return Array.from(this.socket.rooms)
            .filter(x => x != this.socket.id)
            .map(x => this.roomStore.get(x))
            .filter(x =>  x) // retire les rooms nulles
    }

    get user() {
        return this.userStore.fromSocket(this.socket);
    }

    set user(user: User) {
        this.userStore.store(this.socket, user);
    }
}
