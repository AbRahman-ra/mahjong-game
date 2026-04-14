import { NumberTileGroup } from "./TileGroup";

export type SinglePositiveDigit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export const NUMBER_TILES_POSSIBLE_VALUES: Readonly<Record<NumberTileGroup, number[]>> = {
    [NumberTileGroup.NUMBER]: [1, 2, 3, 4, 5, 6, 7, 8, 9]
};
