import { NonNumberTileGroup, NumberTileGroup, TileGroup } from "./TileGroup";
import { TileLabel } from "./TileLabel";
import { TileValue } from "./TileValue";

export type Tile = NumberTile | NonNumberTile;

export interface NumberTile {
    readonly id: string;
    readonly type: NumberTileGroup;
    readonly value: TileValue;
}

/**
 * values are managed by store
 */
export interface NonNumberTile {
    readonly id: string;
    readonly type: NonNumberTileGroup;
    readonly label: TileLabel
}

export const isNumberTile = (t: Tile): t is NumberTile =>
    t.type === NumberTileGroup.NUMBER;

export const isNonNumberTile = (t: Tile): t is NonNumberTile =>
    t.type === NonNumberTileGroup.WIND || t.type === NonNumberTileGroup.DRAGON;

export const value = (
    tile: Tile,
    honorValues: Readonly<Record<NonNumberTileGroup, number>>,
): number => (isNonNumberTile(tile) ? honorValues[tile.type] : tile.value.value);
