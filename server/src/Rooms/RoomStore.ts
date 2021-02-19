import Room from "./Room";
import RoomManager from "./RoomManager";
import User from "../Users/User";

export default class RoomStore
{

    public rooms = new Map<string, Room>()

    constructor(){ }

    getOrCreate(roomId: string) {
        if(this.rooms.has(roomId)) {
            return this.rooms.get(roomId) as Room
        }

        const room = new Room(roomId)
        this.rooms.set(roomId, room);
        return room;
    }

    remove(room: Room) {
        this.rooms.delete(room.id)
    }
}

