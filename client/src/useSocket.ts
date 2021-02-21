/// @ts-ignore
import client from "socket.io-client/dist/socket.io.js";
import { Socket } from "socket.io-client"



const socket :Socket = client.io("http://localhost:3000");
console.log(socket)
socket.on("debug", (msg:any) => console.log(msg))
socket.on("connected", (msg:any) => console.log("connected " + socket.id))
/// @ts-ignore
window["socket"] = socket

export function useSocket() {

    return { 
        socket,
    }
}
