import * as express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import UserStore from "./Users/UserStore";
import RoomManager from "./Rooms/RoomManager";
import SocketManager from "./Sockets/SocketManager";
import RoomStore from "./Rooms/RoomStore";
import User from "../../src/User";
import Game, { createGame } from "../../src/Game";
import GameManager from "./Games/GameManager";

const app = express();
const http = createServer(app);
export const io = new Server(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(express.static(__dirname + "/../../client/dist"))


const roomStore = new RoomStore();
const users = new UserStore(io);


io.on("connection", (socket:Socket) => {

    const socketManager = new SocketManager(socket, io, roomStore, users);

    socket.on("sync-user", (user: User) => {
        socketManager.user = user;
    });

    socket.on("join-room", (roomId:string) => {
        if(!socketManager.user){
            return;
        }

        const room = roomStore.getOrCreate(roomId, socketManager.user)
        
        const roomManager = new RoomManager(room, roomStore);
        roomManager.add(socketManager.user)

        socketManager.join(room)
        io.to(roomId).emit("sync-room", room)
    });

    socket.on("leave-room", (roomId:string) => {
        const room = roomStore.get(roomId)
        const roomManager = new RoomManager(room, roomStore);
        roomManager.remove(socketManager.user)

        socketManager.leave(room)
        
        io.to(roomId).emit("sync-room", room)
    });

    socket.on("disconnected", (reason) => {
        const user = socketManager.user
        socketManager.rooms
            .forEach(x => {
                new RoomManager(x, roomStore).remove(user);
                io.to(x.id).emit("sync-room", x)
            })
        
    })

    socket.on("start-game", (roomId:string) => {
        const room = roomStore.get(roomId)
        const game = createGame(Object.values(room.players).map(x => x.id))

        room.game = game;
        io.to(roomId).emit("sync-room", room)
    })

    socket.on("pick-card", ({roomId, playerId, index}:{roomId:string, playerId:string, index:number}) => {
        const room = roomStore.get(roomId)
        const manager = new GameManager(room.game);
        manager.pick(socketManager.user, playerId, index)

        io.to(roomId).emit("sync-room", room)
    })

    socket.on("next-turn", (roomId: string) => {
        const room = roomStore.get(roomId)

        if(room.host.id != socketManager.user.id){
            return;
        }
        
        io.to(roomId).emit("flush-room")

        setTimeout(() => {
            const manager = new GameManager(room.game);
            manager.endRound()
            io.to(roomId).emit("sync-room", room)
        }, 500);
    })

})

http.listen(3000, () => {
    console.log('listening on *:3000');
  });

