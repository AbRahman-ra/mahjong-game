import { BetOutcome } from "./Bet";
import { Hand } from "./Hand";

export interface GameHistoryRecord {
    readonly hand: Hand;
    readonly outcome: BetOutcome;
    readonly scoreChange: number;
}