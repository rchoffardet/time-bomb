import User from "./User";
import Card, { CardType } from "./Card"

export default class Game
{
    constructor(
        public badguysIds: string[],
        public cards:{[id:string]: Card[]}
    ) { }
}

export function createGame(players: User[])
{
    const cardPerPlayerCount = 5
    const cardCount = players.length * cardPerPlayerCount;
    const wireCount = players.length;
    const bigbenCount = 1;

    const badguysCount = players.length <= 6 ? 2 : 3;

    const cards = new Array(cardCount).fill(null).map(x => new Card(CardType.Neutral));

    cards[0].type = CardType.BigBen;
    
    cards
        .slice(1, wireCount)
        .forEach((x) => x.type = CardType.Wire)

    shuffle(cards);
    console.log(cards.map(x => x.type))
    shuffle(players);


    return new Game(
        players.slice(0, badguysCount).map(x => x.id),
        Object.assign({}, ...players.map((x) => ({[x.id]: cards.splice(0, cardPerPlayerCount)})))
    )
}

function shuffle<Element>(array: Element[])
{
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}