/// @ts-ignore
import client from "socket.io-client/dist/socket.io.js";
import { Socket } from "socket.io-client"

const socket :Socket = client.io();
/// @ts-ignore
window["socket"] = socket

export function useSocket() {

    return { 
        socket,
    }
}
