import { uid } from "uid";

export default class User {
    public constructor(
        public id: string,
        public name: string,
        public registered: boolean,
    )
    {

    }

    static fromName(name: string): User
    {
        return new User(
            uid(16), 
            name,
            false
        )
    }
}