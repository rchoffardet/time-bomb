import { beforeEach, describe } from "mocha";
import useRooms from "./useRooms";
import { useSocketServer } from "../useSocketServer"
import {uid} from "uid"
import { expect } from "chai";
import { RoomEvent } from "./RoomEvent";

const {server, manager, createClient, attach, resetServer} = useSocketServer();
afterEach(resetServer)

describe("room", () => {

    const {handler, rooms} = useRooms();
    attach(handler)
    
    it("is added when socket joins", (done) => {
        const client = createClient();
        setTimeout(() => {
            const roomId = uid()
            client.emit(RoomEvent.Join, roomId)

            setTimeout(() => {
                expect(rooms.size).to.equal(1);
                expect(rooms.has(roomId)).to.be.true;
                const room = rooms.get(roomId);
                expect(room.id).to.equal(roomId)

                done()
            }, 10)
        }, 10);
    })

    it("is updated when socket leaves", (done) => {
        const client = createClient();
        setTimeout(() => {
            const roomId = uid()
            client.emit(RoomEvent.Join, roomId)
            client.emit(RoomEvent.leave, roomId)

            setTimeout(() => {
                expect(rooms.size).to.equal(0);
                done()
            }, 10)
        }, 10);
    })

})