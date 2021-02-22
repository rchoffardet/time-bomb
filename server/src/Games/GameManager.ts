import Game, { generateCards, deal, shuffle } from "../../../src/Game";
import Card, { CardType } from "../../../src/Card";
import User from "../../../src/User";

export default class GameManager
{
    constructor(
        public game: Game
    )
    { }

    pick(player: User, targetId: string, cardIndex: number) {
        
        const card = this.game.cards[targetId][cardIndex];
        if(this.game.ended || card.picked || player.id != this.game.cutter || player.id == targetId || this.game.cutsLeftCount <= 0)
        {
            return;
        }

        card.picked = true
        this.game.cutsLeftCount -= 1;
        this.game.cutter = targetId;

        this.checkVictory(card);
    }

    checkVictory(card: Card) {
        
        if(card.type == CardType.BigBen || this.game.roundLeftCount == 0) {
            return this.loose();
        }

        if(this.game.wiresLeft == 0) {
            return this.win();
        }
    }

    endRound() {

        this.game.cutsLeftCount = this.game.cutsPerRound;
        this.game.roundLeftCount-- 

        const cards = generateCards(
            this.game.playersIds.length, 
            this.game.roundLeftCount,
            this.game.wiresLeft
        );
        
        this.game.cards = deal(shuffle(cards), this.game.playersIds)
    }

    loose() {
        this.game.doBadGuysHaveWon = true;
    }

    win() {
        this.game.doGoodGuysHaveWon = true;
    }

    
}