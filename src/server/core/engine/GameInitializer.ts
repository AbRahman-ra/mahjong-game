import * as Settings from "../domain/config/Settings";
import * as Deck from "../domain/model/Deck";
import * as Hand from "../domain/model/Hand";
import * as GS from "../domain/model/GameState";

/**
 * Initialize a new game state
 * @returns a new game state
 */
export const initGame = (): GS.GameState => {
    const deck = Deck.newDeck();
    const { hand, remaining } = Deck.draw(deck);

    return {
        phase: GS.GamePhase.BETTING,
        score: 0,
        reshuffleCount: 0,
        drawPile: remaining,
        discardPile: [],
        currentHand: Hand.newHand(hand, Settings.NON_NUMBER_TILES_BASE_VALUES),
        nextHand: undefined,
        history: [],
        honorValues: { ...Settings.NON_NUMBER_TILES_BASE_VALUES },
        gameOverReason: undefined,
        currentBet: undefined,
    };
};
