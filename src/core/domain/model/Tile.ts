import { SinglePositiveDigit } from "./SinglePositiveDigit";
import { NonNumberTileType, NumberTileType } from "./TileType";

export type Tile = NumberTile | NonNumberTile;

/**
 * values are managed by store
 */
export interface NonNumberTile {
    readonly type: NonNumberTileType;
}

export interface NumberTile {
    readonly type: NumberTileType;
    readonly value: SinglePositiveDigit;
}

export const isNumberTile = (t: Tile): t is NumberTile =>
    t.type === NumberTileType.NUMBER;

export const isNonNumberTile = (t: Tile): t is NonNumberTile =>
    t.type === NonNumberTileType.WIND || t.type === NonNumberTileType.DRAGON;

export const value = (
    tile: Tile,
    honorValues: Readonly<Record<NonNumberTileType, number>>,
): number => (isNonNumberTile(tile) ? honorValues[tile.type] : tile.value);
