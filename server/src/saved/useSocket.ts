import { Server, Socket } from "socket.io";

export const rooms = [];

export default function useSocket(io: Server)
{
    io.on("connection", (socket:Socket) => {
        socket.on("sync-user", (user) => {
            socket["user"] = user
            socket.join(user.id)
            socket.emit("debug", "synced user " + JSON.stringify(user))
        });
    
        socket.on("join-room", (roomId:string) => {
            socket.join(roomId)
            socket.emit("debug", "joined room " + roomId)
    
            io.to(roomId).emit("sync-room", list(roomId))
        });
    
        socket.on("leave-room", (roomId:string) => {
            socket.emit("debug", "leaved room " + roomId)
            socket.leave(roomId)
            
            io.to(roomId).emit("sync-room", list(roomId))
        });
    
        socket.on("disconnecting", (reason) => {
            for (const roomId of Array.from(socket.rooms)) {
                if(roomId == socket.id)
                    continue;
    
                const room = rooms[roomId];
    
                if(room != undefined && socketsOf(room).length > 1) {
                    delete rooms[roomId];
                }
            }
        })
    
        socket.on("start-game", () => {
    
        })
    
        function list(roomId:string) {
            const clients = socketsOf(roomId).map(socket => userFrom(socket))
            socket.emit("debug", "sync: " + JSON.stringify(clients))
    
            return clients;
        }
    
        function socketsOf(roomId: string) {
            return Array.from(io.sockets.adapter.rooms.get(roomId) || []);
        }
    
        function userFrom(socketId: string) {
            return io.sockets.sockets.get(socketId)["user"];
        }
    })
}

