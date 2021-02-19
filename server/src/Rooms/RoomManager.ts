import Room from "./Room";
import User from "../Users/User";
import RoomStore from "./RoomStore";

export default class RoomManager
{

    constructor(
        public room:Room,
        private roomStore: RoomStore
    ){ }

    add(user: User) {
        this.room.players.set(user.id, user)
    }

    remove(user: User) {
        this.room.players.delete(user.id)

        if(this.isEmpty()) {
            this.roomStore.remove(this.room);
        }
    }

    isEmpty() {
        return this.room.players.size == 0
    }
}