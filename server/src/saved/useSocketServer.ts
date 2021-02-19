import { createServer } from "http";
import { AddressInfo } from "net"
import { Manager } from "socket.io-client";
import { Server, Socket } from "socket.io";
import { afterEach } from "mocha";

const clients:SocketIOClient.Socket[] = [];
const http = createServer();
http.listen();

const addr = http.address() as AddressInfo
const port = addr.port;

const server = new Server(http).listen(http);
const manager = new Manager("ws://localhost:"  + port)

export function useSocketServer() {

    function createClient() {
        const client = manager.socket("/test");
        clients.push(client);
        return client;
    }

    function clearClients() {
        clients.forEach(x => x.disconnect());
        clients.length = 0;
    }

    function resetServer() {
        clearClients();
        server.removeAllListeners();
    }

    function attach(handler:(socket: Socket, server:Server) => void)
    {
        server.of("/test").on("connection", (socket:Socket) => {
            handler(socket, server)
        })
    }

    return {
        server,
        manager,
        createClient,
        attach,
        resetServer
    }
}



