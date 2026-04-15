import * as Settings from "../domain/config/Settings";
import * as Deck from "../domain/model/Deck";
import * as Hand from "../domain/model/Hand";
import * as GS from "../domain/model/GameState";
import { NonNumberTileGroup } from "../domain/model/TileGroup";

/**
 * Initialize a new game state
 * @returns a new game state
 */
export const initGame = (): GS.GameState => {
    const deck = Deck.newDeck();
    const { hand, remaining } = Deck.draw(deck);
    const nonNumberTilesBases = Object.fromEntries(
        Object.values(NonNumberTileGroup).map((t) => [
            t,
            Settings.TILE_GROUPS[t].baseValue,
        ]),
    ) as Record<NonNumberTileGroup, number>;

    return {
        phase: GS.GamePhase.BETTING,
        score: 0,
        reshuffleCount: 0,
        drawPile: remaining,
        discardPile: [],
        currentHand: Hand.newHand(hand, nonNumberTilesBases),
        nextHand: undefined,
        history: [],
        honorValues: { ...nonNumberTilesBases },
        gameOverReason: undefined,
        currentBet: undefined,
    };
};
