import User from "./User";
import Game from "./Game";

export default class Room
{
    public players:{[id: string]: User} = {}
    constructor(
        public id: string,
        public host: User,
        public game?: Game
    ) { }
}