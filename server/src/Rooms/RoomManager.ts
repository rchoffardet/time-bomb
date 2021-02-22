import Room from "../../../src/Room";
import User from "../../../src/User";
import RoomStore from "./RoomStore";

export default class RoomManager
{

    constructor(
        public room:Room,
        private roomStore: RoomStore
    ){ }

    add(user: User) {
        if(user != null && this.room != null)
            this.room.players[user.id] = user
    }

    remove(user: User) {
        delete this.room.players[user.id]

        if(this.isEmpty()) {
            this.roomStore.remove(this.room);
        }

        if(this.room.host.id == user.id) {
            const newHost = Object.values(this.room.players)[0] as User;
            this.room.host = newHost;
        }
    }

    isEmpty() {
        return Object.keys(this.room.players).length == 0
    }
}