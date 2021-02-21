import { Server, Socket } from "socket.io";
import User from "../../../src/User";
import Room from "../../../src/Room";

export default class UserStore
{

    constructor(
        private server:Server,
    )
    { }

    store(socket: Socket, user: User) {
        socket["user"] = user;
    }

    fromSocket(socket:Socket) {
        const payload = socket["user"] as Object;

        if(payload == undefined || payload == null) {
            return undefined
        }

        return payload as User;
    }

    findById(id: string) {
        const socket = this.server.sockets.sockets.get(id)
        return this.fromSocket(socket)
    }

    getByRoom(room: Room) {
        return Array
            .from(this.server.sockets.adapter.rooms.get(room.id) ?? [])
            .map(x => this.findById(x))
    }
}