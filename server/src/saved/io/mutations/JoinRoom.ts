import User from "../../domain/User";
export default class JoinRoom
{
    constructor(public id: string, public user: User, public roomId: string)
    { }
}