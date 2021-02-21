export default class Card
{
    constructor(
        public type:CardType,
        public picked:boolean = false
    )
    { }
}

export enum CardType 
{
    Neutral = "neutral",
    Wire = "wire",
    BigBen = "bigben"
}