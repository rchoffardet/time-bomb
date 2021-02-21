import Room from "../../../src/Room";
import RoomManager from "./RoomManager";
import User from "../../../src/User";

export default class RoomStore
{
    public rooms = new Map<string, Room>()

    constructor(){ }

    getOrCreate(roomId: string, user: User) {
        if(this.rooms.has(roomId)) {
            return this.rooms.get(roomId) as Room
        }

        const room = new Room(roomId, user)
        this.rooms.set(roomId, room);
        return room;
    }

    get(roomId: string) {
        return this.rooms.get(roomId) as Room
    }

    remove(room: Room) {
        this.rooms.delete(room.id)
    }
}

