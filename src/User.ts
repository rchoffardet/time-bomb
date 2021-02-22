import { uid } from "uid";

export default class User
{
    constructor(
        public id: string, 
        public name: string,
        public registered: boolean = false
    ) { }

    static fromJson(payload: UserSerialized)
    {
        const user = new User(
            payload.id,
            payload.name,
            payload.registered
        )

        return user;
    }
}

export function createUser()
{
    return new User(uid(), "")
}

export type UserSerialized = User