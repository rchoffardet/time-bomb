import * as express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import Room from "./rooms/Room";
import UserStore from "./Users/UserStore";
import RoomManager from "./Rooms/RoomManager";
import SocketManager from "./Sockets/SocketManager";
import RoomStore from "./Rooms/RoomStore";
import User from "./Users/User";

const app = express();
const http = createServer(app);
export const io = new Server(http, {
    cors: {
        origin: "http://localhost:3001",
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
        const room = roomStore.getOrCreate(roomId)
        const roomManager = new RoomManager(room, roomStore);
        roomManager.add(socketManager.user)

        socketManager.join(room)
        
        io.to(roomId).emit("sync-room", users.getByRoom(room))
    });

    socket.on("leave-room", (roomId:string) => {
        const room = roomStore.getOrCreate(roomId)
        const roomManager = new RoomManager(room, roomStore);
        roomManager.remove(socketManager.user)

        socketManager.leave(room)
        
        io.to(roomId).emit("sync-room", users.getByRoom(room))
    });

    socket.on("disconnected", (reason) => {
        const user = socketManager.user
        socketManager.rooms.map(x => new RoomManager(x, roomStore).remove(user))
    })

    socket.on("start-game", (roomId:string) => {

    })
})

http.listen(3000, () => {
    console.log('listening on *:3000');
    console.log(__dirname + "../../client/dist")
  });

