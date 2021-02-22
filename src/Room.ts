import User, { createUser, UserSerialized } from "./User";
import Game, { GameSerialized } from "./Game";
import { uid } from "uid";

export default class Room
{
    
    constructor(
        public id: string,
        public host: User,
        public game?: Game,
        public players:{[id: string]: User} = {}
    ) { }

    static fromJson(payload: RoomSerialized) {
        const room = new Room(
            payload.id, 
            User.fromJson(payload.host), 
            payload.game == undefined ? undefined : Game.fromJson(payload.game),
            Object.assign({}, ...Object.entries(payload.players).map(([key, value]) => ({[key]: User.fromJson(value)})))
        )

        return room;
    }
}

export function createRoom()
{
    return new Room(uid(), createUser(), undefined)
}

export type RoomSerialized = Omit<Room, "players" | "host" | "game"> 
    & {
        players: {[id: string]: UserSerialized},
        host: UserSerialized,
        game?: GameSerialized
    }