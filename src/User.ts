export default class User
{
    constructor(
        public id: string, 
        public name: string,
        public registered: boolean = false
    ) { }
}