import * as Settings from "../domain/config/Settings";
import * as Deck from "../domain/model/Deck";
import * as Hand from "../domain/model/Hand";
import * as GS from "../domain/model/GameState";
import * as Bet from "../domain/model/Bet";
import * as ArrayHelper from "../shared/helpers/ArrayHelper";
import * as HonorValuesDynamicScaler from "./HonorValuesDynamicScaler";
import * as GameOverChecker from "./GameOverChecker";
import { GameHistoryRecord } from "../domain/model/GameHistoryRecord";

/**
 * Records the bet and draws the next hand.
 * Handles draw pile exhaustion — caller receives reshuffled flag to publish PileOutage.
 * Transitions to REVEALING phase.
 */
export const placeBet = (state: GS.GameState, bet: Bet.BetDirection): GS.GameState => {
    let drawPile = state.drawPile;
    let discardPile = state.discardPile;
    let reshuffleCount = state.reshuffleCount;

    let isNoRemainingPiles = drawPile.length < Settings.HAND_SIZE;
    let isReshuffleLimit = GameOverChecker.isReshuffleLimitReached(state);

    if (isNoRemainingPiles && isReshuffleLimit) {
        return {
            ...state,
            phase: GS.GamePhase.GAME_OVER,
            gameOverReason: GS.GameOverReason.RESHUFFLE_LIMIT
        };
    } else if (isNoRemainingPiles) {
        drawPile = ArrayHelper.shuffle([...discardPile, ...Deck.newDeck()]);
        discardPile = [];
        reshuffleCount++;
    }

    const { hand, remaining } = Deck.draw(drawPile);
    const nextHand = Hand.newHand(hand, state.honorValues);

    return {
        ...state,
        phase: GS.GamePhase.REVEALING,
        drawPile: remaining,
        discardPile,
        reshuffleCount,
        nextHand,
        currentBet: bet,
    };
};

/**
 * Resolves the result of a bet
 * @param state the bet after betting
 * @returns 
 */
export const resolveBet = (state: GS.GameState): GS.GameState => {
    const { currentHand, nextHand, currentBet, honorValues } = state;

    const outcome = betOutcome(currentHand.total, nextHand!.total, currentBet!);
    let scoreChange = currentHand.total;

    // new score based on direction
    let newScore: number;
    if (outcome === Bet.BetOutcome.WIN) {
        newScore = state.score + scoreChange;
    } else {
        newScore = Settings.MIN_POSSIBLE_SCORE !== undefined
            ? Math.max(Settings.MIN_POSSIBLE_SCORE, state.score - scoreChange)
            : state.score - scoreChange;
    }

    // dynamic scaling and gameover conditions
    const newHonorValues = HonorValuesDynamicScaler.scaleHonorValues(currentHand, outcome, honorValues);
    const gameOverReason = GameOverChecker.isGameOver({ ...state, honorValues: newHonorValues });

    const record: GameHistoryRecord = {
        hand: currentHand,
        outcome,
        scoreChange: outcome === Bet.BetOutcome.WIN ? scoreChange : - scoreChange,
    };

    const result: GS.GameState = {
        ...state,
        phase: gameOverReason ? GS.GamePhase.GAME_OVER : GS.GamePhase.BETTING,
        score: newScore,
        honorValues: newHonorValues,
        currentHand: nextHand!,
        nextHand: undefined,
        discardPile: [...state.discardPile, ...currentHand.tiles],
        history: [...state.history, record],
        currentBet: undefined,
        ...(gameOverReason && { gameOverReason }),
    };

    return result;
};

// ================================ HELPERS ================================

/**
 * Resolves a bet direction based on the crrent and next hands' values
 * 
 * Note: if the current hand and next hand values' are the same, we consider this as a lower bet
 * @param current 
 * @param next 
 * @param bet 
 * @returns whether the bet was correct or not
 */
const betOutcome = (
    current: number,
    next: number,
    bet: Bet.BetDirection,
): Bet.BetOutcome => {
    if (bet === Bet.BetDirection.HIGHER && next > current) return Bet.BetOutcome.WIN;
    if (bet === Bet.BetDirection.LOWER && next <= current) return Bet.BetOutcome.WIN;
    return Bet.BetOutcome.LOSE;
};