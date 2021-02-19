import User from "../Users/User";

export default class Room
{
    public players = new Map<string, User>()
    constructor(
        public id: string
    ) { }
}