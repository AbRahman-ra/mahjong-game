import { SinglePositiveDigit } from "./NumberTileValues";
import { NonNumberTileGroup, NumberTileGroup } from "./TileGroup";

export type Tile = NumberTile | NonNumberTile;

/**
 * values are managed by store
 */
export interface NonNumberTile {
    readonly type: NonNumberTileGroup;
}

export interface NumberTile {
    readonly type: NumberTileGroup;
    readonly value: SinglePositiveDigit;
}

export const isNumberTile = (t: Tile): t is NumberTile =>
    t.type === NumberTileGroup.NUMBER;

export const isNonNumberTile = (t: Tile): t is NonNumberTile =>
    t.type === NonNumberTileGroup.WIND || t.type === NonNumberTileGroup.DRAGON;

export const value = (
    tile: Tile,
    honorValues: Readonly<Record<NonNumberTileGroup, number>>,
): number => (isNonNumberTile(tile) ? honorValues[tile.type] : tile.value);
