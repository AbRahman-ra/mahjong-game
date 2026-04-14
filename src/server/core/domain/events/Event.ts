import { GameOverReason } from "../model/GameState";
import { Hand } from "../model/Hand";

export interface GameEvent<T> {
    readonly type: GameEventType;
    readonly data: T;
}

export enum GameEventType {
    GAME_OVER = "GAME_OVER",
    PILE_OUTAGE = "PILE_OUTAGE",
    SUCCESSFUL_BET = "SUCCESSFUL_BET",
    UNSUCCESSFUL_BET = "UNSUCCESSFUL_BET",
}

// ready-to-pick contexts (feel free to use your own data schema)
export interface PileOutageContext {
    remaining: number;
    reshuffles: number;
}

export interface GameOverContext {
    reason: GameOverReason;
    lastScore: number;
}

export interface BetResolvedContext {
    hand: Hand;
    scoreChange: number;
}
