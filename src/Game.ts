import Card, { CardType, CardSerialized } from "./Card"

export default class Game
{
    constructor(
        public playersIds: string[],
        public badguysIds: string[],
        public cards:{[id:string]: Card[]},
        public cutsPerRound: number,
        public cutsLeftCount: number,
        public roundLeftCount: number,
        public cutter: string,
        public doBadGuysHaveWon = false,
        public doGoodGuysHaveWon = false,
    ) { }

    get wiresLeft() {
        return Object.values(this.cards)
            .reduce((acc, x) => acc.concat(x), [])
            .filter(x => x.type == CardType.Wire && x.picked == false)
            .length;
    }

    get ended() {
        return this.doBadGuysHaveWon || this.doGoodGuysHaveWon
    }

    static fromJson(payload: GameSerialized) {
        const game = new Game(
            payload.playersIds,
            payload.badguysIds,
            Object.assign({}, ...Object.entries(payload.cards).map(([key, value]) => ({[key]: value.map(x => Card.fromJson(x))}))),
            payload.cutsPerRound,
            payload.cutsLeftCount,
            payload.roundLeftCount,
            payload.cutter,
            payload.doBadGuysHaveWon,
            payload.doGoodGuysHaveWon
        )

        return game;
    }
}

export type GameSerialized = Omit<Game, "cards"> & {cards: {[id:string]: CardSerialized[]}}

export function createGame(playersIds: string[])
{
    playersIds = shuffle(playersIds);
    const roundsCount = 4
    const wireCount = playersIds.length;
    const cards = generateCards(playersIds.length, roundsCount, wireCount)
    const badguysCount = getBadGuysCount(playersIds.length);

    return new Game(
        playersIds,
        playersIds.slice(0, badguysCount),
        deal(cards, playersIds),
        playersIds.length,
        playersIds.length,
        roundsCount,
        playersIds[0]
    );
}

function getBadGuysCount(playerCount: number) {
    switch(playerCount)
    {
        case 1:
            return 0;
        case 2:
            return 1;
        case 3:
            return 1;
        case 4:
            return 1 + Math.round(Math.random());
        case 5:
            return 2;
        case 6:
            return 2;
        case 7:
            return 2 + Math.round(Math.random());
        case 8:
            return 3;
    }
}

export function generateCards(playersCount: number, roundNumber: number, wireLeftCount = playersCount)
{
    const cardCount = playersCount * (roundNumber + 1);
    const cards = new Array(cardCount).fill(null).map(x => new Card(CardType.Neutral));
    cards[0].type = CardType.BigBen;

    cards
        .slice(1, wireLeftCount + 1)
        .forEach((x) => x.type = CardType.Wire)

    return shuffle(cards);
}

export function shuffle<Element>(array: Element[])
{
    var result = array.slice();
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}

export function deal(cards: Card[], playersIds: string[])
{
    const cardsPerPlayer = Math.floor(cards.length / playersIds.length)
    return Object.assign({}, ...playersIds.map((x) => ({[x]: cards.splice(0, cardsPerPlayer)})))
}