import { Server, Socket } from "socket.io";
import Room from "../rooms/Room";
import RoomStore from "../Rooms/RoomStore";
import UserStore from "../Users/UserStore";
import User from "../Users/User";

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
        this.debug("joined room", room.id);
    }

    leave(room: Room) {
        this.socket.leave(room.id);
        this.debug("joined room", room.id);
    }

    get rooms() {
        return Array.from(this.socket.rooms)
            .filter(x => x != this.socket.id)
            .map(x => this.roomStore.getOrCreate(x))
    }

    get user() {
        return this.userStore.fromSocket(this.socket);
    }

    set user(user: User) {
        this.userStore.store(this.socket, user);
        this.debug("synced user", JSON.stringify(user))
    }

    debug(title: string, message: string) {
        this.socket.emit("debug", title + ": " + message)
    }
}
