import { Server, Socket } from "socket.io";
import { get } from "https";
import { Room } from "./Room";
import { RoomEvent } from "./RoomEvent";

export default function useRooms()
{
    const rooms:Map<string, Room> = new Map<string, Room>()

    function list(server:Server, socket: Socket, roomId:string) {
        const clients = socketsOf(server, roomId).map(socket => userFrom(server, socket))
        socket.emit("debug", "sync: " + JSON.stringify(clients))

        return clients;
    }

    function socketsOf(server:Server, roomId: string) {
        return Array.from(server.sockets.adapter.rooms.get(roomId) || []);
    }

    function userFrom(server:Server, socketId: string) {
        return server.sockets.sockets.get(socketId)["user"];
    }

    function handler(socket: Socket, server:Server)
    {
        socket.on(RoomEvent.Join, (roomId:string) => {   
            if(!rooms.has(roomId)) {
                rooms.set(roomId, new Room(roomId));
            }

            socket.join(roomId)
        });
    
        socket.on(RoomEvent.leave, (roomId:string) => {
            socket.leave(roomId)
            
            server.to(roomId).emit("sync-room", list(server, socket, roomId))
        });
    }

    return {handler, rooms}
}