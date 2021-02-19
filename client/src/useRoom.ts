import User from "./User"
import { Socket } from "socket.io-client";

function toPromise<ElementType>(socket: Socket, event: string, trigger: (arg:Socket) => void)
{
    return new Promise<ElementType>((resolve, reject) => {
        function handle(payload: ElementType)
        {
            socket.off(event, handle)
            resolve(payload);
        }

        socket.on(event, handle);
        trigger(socket)
    })
}

export function useRoom(socket: Socket) {

    return {
        createRoom: (roomId: string)  => socket.emit("create-room", roomId),
        leaveRoom: (roomId: string) => socket.emit("leave-room", roomId),
        listRoom: (roomId: string) => toPromise<User[]>(
            socket, 
            "room-listed", 
            (socket) => socket.emit("list-room", roomId)
        ),
        syncUser: (user: User) => socket.emit("sync", user),
        findRooms: () => toPromise<string[]>(
            socket, 
            "rooms-found", 
            (socket) => socket.emit("find-rooms")
        ),
        joinRoom: (roomId: string) => socket.emit("join-room", roomId),
    }
}
