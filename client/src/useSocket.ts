/// @ts-ignore (it works)
import io, { Socket } from "socket.io-client";

const socket :Socket = io("http://localhost:3000");
socket.on("debug", (msg:any) => console.log(msg))
socket.on("connected", (msg:any) => console.log("connected " + socket.id))
/// @ts-ignore
window["socket"] = socket

export function useSocket() {

    return { 
        socket,
    }
}
