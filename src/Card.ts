export default class Card
{
    constructor(
        public type:CardType,
        public picked:boolean = false
    )
    { }

    static fromJson(payload: CardSerialized) {
        const card = new Card(
            payload.type as CardType,
            payload.picked
        )

        return card;
    }
}

export enum CardType 
{
    Neutral = "neutral",
    Wire = "wire",
    BigBen = "bigben"
}

export type CardTypeSerialized = CardType
export type CardSerialized = {type: CardTypeSerialized, picked: boolean}