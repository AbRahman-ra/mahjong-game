import { BetOutcome } from "../model/Bet";
import { NumberTileGroup, NonNumberTileGroup, TileGroup } from "../model/TileGroup";
import { TileLabelFormat } from "../model/TileLabel";

// system configurations (hand size, number of copies, etc...)
/**
 * Tile groups info
 */
export const TILE_GROUPS: Readonly<Record<NumberTileGroup | NonNumberTileGroup, TileGroup>> = {
    [NumberTileGroup.NUMBER]: {
        type: NumberTileGroup.NUMBER,
        copies: 4,
        accent: "#6cbf92",
        possibleValues: [
            { value: 1, label: { format: TileLabelFormat.CHARACTER, value: "1" } },
            { value: 2, label: { format: TileLabelFormat.CHARACTER, value: "2" } },
            { value: 3, label: { format: TileLabelFormat.CHARACTER, value: "3" } },
            { value: 4, label: { format: TileLabelFormat.CHARACTER, value: "4" } },
            { value: 5, label: { format: TileLabelFormat.CHARACTER, value: "5" } },
            { value: 6, label: { format: TileLabelFormat.CHARACTER, value: "6" } },
            { value: 7, label: { format: TileLabelFormat.CHARACTER, value: "7" } },
            { value: 8, label: { format: TileLabelFormat.CHARACTER, value: "8" } },
            { value: 9, label: { format: TileLabelFormat.CHARACTER, value: "9" } },
        ],
        label: { format: TileLabelFormat.CHARACTER, value: "#" }
    },
    [NonNumberTileGroup.WIND]: {
        type: NonNumberTileGroup.WIND,
        copies: 4,
        accent: "#a9bacd",
        dynamicScaler: { [BetOutcome.WIN]: 1, [BetOutcome.LOSE]: -1 },
        baseValue: 5,
        label: { format: TileLabelFormat.CHARACTER, value: "風" }
    },
    [NonNumberTileGroup.DRAGON]: {
        type: NonNumberTileGroup.DRAGON,
        copies: 4,
        accent: "#d85d5d",
        dynamicScaler: { [BetOutcome.WIN]: 1, [BetOutcome.LOSE]: -1 },
        baseValue: 5,
        label: { format: TileLabelFormat.CHARACTER, value: "中" }
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

/**
 * Max visible draw piles at a time
 * instead of rendering 136 tiles, we render X, the load
 */
export const MAX_VISIBLE_DRAW_PILES = 12;

/**
 * Max visible draw piles at a time
 * instead of rendering 136 tiles, we render X, the load
 */
export const MAX_VISIBLE_DISCARD_PILES = 20;

/**
 * When the draw pile is completely discarded except the current hand, we bet, then 2 things should happen: 
 * 1. the current hand gets discarded
 * 2. The discarded pile gets reshuffled
 * 
 * The following option controls whether to discard then reshuffle (`true`, default), or to reshuffle then discard (`false`)
 */
export const DISCARD_LAST_BEFORE_RESHUFFLE = true;