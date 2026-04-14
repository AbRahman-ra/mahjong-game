import { BetDirection } from "./Bet";
import { Deck } from "./Deck";
import { GameHistoryRecord } from "./GameHistoryRecord";
import { Hand } from "./Hand";
import { Tile } from "./Tile";
import { NonNumberTileGroup } from "./TileGroup";

export interface GameState {
    readonly phase: GamePhase;
    readonly score: number;
    readonly reshuffleCount: number;
    readonly drawPile: Deck;
    readonly discardPile: readonly Tile[];
    readonly currentHand: Hand;
    readonly nextHand?: Hand;
    readonly history: readonly GameHistoryRecord[];
    readonly honorValues: Readonly<Record<NonNumberTileGroup, number>>; // alias for non number tiles
    readonly gameOverReason?: GameOverReason;
    readonly currentBet?: BetDirection;
}

export enum GamePhase {
    BETTING = "BETTING",
    REVEALING = "REVEALING",
    GAME_OVER = "GAME_OVER"
}

export enum GameOverReason {
    TILE_VALUE_MIN = "TILE_VALUE_MIN",
    TILE_VALUE_MAX = "TILE_VALUE_MAX",
    RESHUFFLE_LIMIT = "RESHUFFLE_LIMIT",
}
