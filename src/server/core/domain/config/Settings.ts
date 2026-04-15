import { BetOutcome } from "../model/Bet";
import { NumberTileGroup, NonNumberTileGroup, TileGroup } from "../model/TileGroup";

// system configurations (hand size, number of copies, etc...)
/**
 * Tile groups info
 */
export const TILE_GROUPS: Readonly<Record<NumberTileGroup | NonNumberTileGroup, TileGroup>> = {
    [NumberTileGroup.NUMBER]: {
        type: NumberTileGroup.NUMBER,
        copies: 4,
        accent: "#6cbf92",
        dynamicScaler: { [BetOutcome.WIN]: 0, [BetOutcome.LOSE]: 0 },
        possibleValues: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    },
    [NonNumberTileGroup.WIND]: {
        type: NonNumberTileGroup.WIND,
        copies: 4,
        accent: "#a9bacd",
        dynamicScaler: { [BetOutcome.WIN]: 1, [BetOutcome.LOSE]: -1 },
        baseValue: 5,
    },
    [NonNumberTileGroup.DRAGON]: {
        type: NonNumberTileGroup.DRAGON,
        copies: 4,
        accent: "#d85d5d",
        dynamicScaler: { [BetOutcome.WIN]: 1, [BetOutcome.LOSE]: -1 },
        baseValue: 5,
    },
};

export const HAND_SIZE = 4;

/**
 * Fixed number of copies for all tiletypes (less maintainability)
 */
export const FIXED_TILE_COPIES = 4;

/**
 * Gameover conditions
 */
export const GAME_OVER_CONDITIONS = {
    TILE_MIN: 0,
    TILE_MAX: 10,
    RESHUFFLES_MAX: 3,
};

/**
 * Minimum possible score (score can't go below this), if set to undefined, means no limit
 */
export const MIN_POSSIBLE_SCORE: number | undefined = undefined;

/**
 * Leaderboard size
 */
export const LEADERBOARD_SIZE = 5;

export const DECK_SIZE: number = Object.values(TILE_GROUPS).reduce((sum, g) =>
    sum + (g.possibleValues?.length ?? 1) * g.copies, 0
);
