import { BetOutcome } from "../model/Bet";
import { NumberTileGroup, NonNumberTileGroup } from "../model/TileGroup";

// system configurations (hand size, number of copies, etc...)

/**
 * Base value for each non-number tile
 */
export const NON_NUMBER_TILES_BASE_VALUES: Readonly<
    Record<NonNumberTileGroup, number>
> = {
    [NonNumberTileGroup.DRAGON]: 5,
    [NonNumberTileGroup.WIND]: 5,
};

export const HAND_SIZE = 4;

/**
 * Custom map specifying the copies for each tiletype
 */
export const TILE_COPIES: Readonly<
    Record<NumberTileGroup | NonNumberTileGroup, number>
> = {
    [NumberTileGroup.NUMBER]: 5,
    [NonNumberTileGroup.DRAGON]: 5,
    [NonNumberTileGroup.WIND]: 5,
};

/**
 * Number of tiles for each suit
 */
export const TILES_PER_GROUP: Readonly<
    Record<NumberTileGroup | NonNumberTileGroup, number>
> = {
    [NumberTileGroup.NUMBER]: 9,
    [NonNumberTileGroup.DRAGON]: 1,
    [NonNumberTileGroup.WIND]: 1,
};

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
 * Dynamic scale values for non number tiles after betting
 */
export const DYNAMIC_SCALER: Readonly<Record<BetOutcome, number>> = {
    [BetOutcome.WIN]: 1,
    [BetOutcome.LOSE]: -1,
};

/**
 * Leaderboard size
 */
export const LEADERBOARD_SIZE = 5;

export const DECK_SIZE: number = (
    Object.entries(TILES_PER_GROUP) as [
        NumberTileGroup | NonNumberTileGroup,
        number,
    ][]
).reduce((sum, [k, v]) => sum + v * TILE_COPIES[k], 0);
